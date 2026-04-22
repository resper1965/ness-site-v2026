import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { enforceGovernance, ASSISTED_TOPICS, AUTONOMOUS_TOPICS } from './governance'
import { collections, getCollection } from './collections'

const server = new McpServer({
  name: "canal-cms",
  version: "1.0.0"
})

// ── Helper: extrair texto legível do JSON de dados ──────────────
function extractTextFromData(dataStr: string): string {
  try {
    const obj = JSON.parse(dataStr)
    return Object.values(obj)
      .filter((v): v is string => typeof v === 'string')
      .join(' ')
  } catch {
    return dataStr
  }
}

// ── Ferramenta 1: Listar coleções ───────────────────────────────
server.tool(
  "list_collections",
  "Lista o schema e política de governança de todas as collections disponíveis no CMS",
  {},
  async () => {
    try {
      return {
        content: [{ type: "text", text: JSON.stringify(collections.map(c => ({
          slug: c.slug,
          label: c.label,
          governance: c.governance,
          fields: c.fields.map(f => f.name),
        })), null, 2) }]
      }
    } catch (e: any) {
      return { content: [{ type: "text", text: `Erro: ${e.message}` }] }
    }
  }
)

// ── Ferramenta 2: Listar entradas ───────────────────────────────
server.tool(
  "list_entries",
  "Lista as entries de uma collection específica pelo slug",
  {
    slug: z.string().describe("Slug da collection (ex: insights, jobs, cases, comunicados, social_posts, newsletters)"),
    limit: z.number().optional().describe("Limite de resultados (max 50, default 50)")
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      const tenantId = (globalThis as any).__MCP_TENANT
      let query = `SELECT * FROM entries WHERE collection_id = (SELECT id FROM collections WHERE slug = ?)`
      const params: any[] = [args.slug]
      
      if (tenantId) {
        query += ` AND tenant_id = ?`
        params.push(tenantId)
      } else {
        query += ` AND tenant_id IS NULL`
      }
      
      query += ` ORDER BY updated_at DESC LIMIT ?`
      params.push(args.limit || 50)

      const results = await db.prepare(query).bind(...params).all()

      const parsed = results.results.map((r: any) => ({
        ...r,
        data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data
      }))

      return {
        content: [{ type: "text", text: JSON.stringify(parsed, null, 2) }]
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Error fetching entries: ${err.message}` }]
      }
    }
  }
)

// ── Ferramenta 3: Criar Entrada (com Governança) ────────────────
server.tool(
  "create_entry",
  "Cria uma nova entry em uma collection. A política de governança da collection determina se o conteúdo será publicado automaticamente (autonomous) ou ficará como rascunho para aprovação humana (assisted). Collections 'protected' rejeitam a operação.",
  {
    slug: z.string().describe("Slug da collection"),
    data: z.string().describe("Objeto JSON em formato string com os dados de conteúdo"),
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      // Aplicar governança
      const contentText = extractTextFromData(args.data)
      const env = (globalThis as any).__MCP_ENV
      const governance = await enforceGovernance(args.slug, contentText, env)

      if (governance.decision === 'blocked') {
        return {
          content: [{ type: "text", text: `🚫 BLOQUEADO: ${governance.reason}` }]
        }
      }

      const tenantId = (globalThis as any).__MCP_TENANT
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      const publishedAt = governance.status === 'published' ? now : null

      await db.prepare(
        `INSERT INTO entries (id, tenant_id, collection_id, data, status, created_by, governance_decision, classification_reason, published_at, created_at, updated_at)
         VALUES (?, ?, (SELECT id FROM collections WHERE slug = ?), ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        tenantId || null,
        args.slug,
        args.data,
        governance.status,
        'agent:mcp',
        governance.decision,
        governance.reason,
        publishedAt,
        now,
        now
      ).run()

      const statusEmoji = governance.status === 'published' ? '✅' : '⏳'
      return {
        content: [{ type: "text", text: `${statusEmoji} Criado com sucesso.\nID: ${id}\nStatus: ${governance.status}\nGovernança: ${governance.decision}\nRazão: ${governance.reason}` }]
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Erro: ${err.message}` }]
      }
    }
  }
)

// ── Ferramenta 4: Atualizar Entrada (com Reclassificação) ───────
server.tool(
  "update_entry",
  "Atualiza os dados JSON de uma entry existente pelo ID. Reclassifica a governança se o conteúdo mudar.",
  {
    id: z.string(),
    data: z.string().describe("Novo objeto JSON em formato string com os dados"),
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      const tenantId = (globalThis as any).__MCP_TENANT

      // Buscar entry existente para saber a collection
      let findQuery = `SELECT e.*, c.slug as col_slug FROM entries e JOIN collections c ON e.collection_id = c.id WHERE e.id = ?`
      const findParams: any[] = [args.id]
      
      if (tenantId) {
        findQuery += ` AND e.tenant_id = ?`
        findParams.push(tenantId)
      } else {
        findQuery += ` AND e.tenant_id IS NULL`
      }

      const existing = await db.prepare(findQuery).bind(...findParams).first()
      if (!existing) {
        return { content: [{ type: "text", text: `Entry não encontrada: ${args.id}` }] }
      }

      // Verificar governança da collection
      const col = getCollection(existing.col_slug)
      if (col?.governance === 'protected') {
        return {
          content: [{ type: "text", text: `🚫 BLOQUEADO: Collection "${existing.col_slug}" é protegida. Apenas humanos podem editar.` }]
        }
      }

      // Reclassificar conteúdo
      const contentText = extractTextFromData(args.data)
      const env = (globalThis as any).__MCP_ENV
      const governance = await enforceGovernance(existing.col_slug, contentText, env)

      let updateQuery = `UPDATE entries SET data = ?, status = ?, governance_decision = ?, classification_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      const updateParams: any[] = [args.data, governance.status, governance.decision, governance.reason, args.id]
      
      if (tenantId) {
        updateQuery += ` AND tenant_id = ?`
        updateParams.push(tenantId)
      } else {
        updateQuery += ` AND tenant_id IS NULL`
      }

      await db.prepare(updateQuery).bind(...updateParams).run()

      const statusEmoji = governance.status === 'published' ? '✅' : '⏳'
      return {
        content: [{ type: "text", text: `${statusEmoji} Atualizado.\nID: ${args.id}\nStatus: ${governance.status}\nGovernança: ${governance.decision}\nRazão: ${governance.reason}` }]
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Erro ao atualizar: ${err.message}` }]
      }
    }
  }
)

// ── Ferramenta 5: Deletar Entrada (bloqueada para protected) ────
server.tool(
  "delete_entry",
  "Remove uma entry pelo seu ID. Collections 'protected' rejeitam a operação.",
  {
    id: z.string().describe("ID da entry a ser deletada"),
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      const tenantId = (globalThis as any).__MCP_TENANT

      // Verificar se a collection é protected
      let findQuery = `SELECT e.id, c.slug as col_slug FROM entries e JOIN collections c ON e.collection_id = c.id WHERE e.id = ?`
      const findParams: any[] = [args.id]
      
      if (tenantId) {
        findQuery += ` AND e.tenant_id = ?`
        findParams.push(tenantId)
      } else {
        findQuery += ` AND e.tenant_id IS NULL`
      }

      const existing = await db.prepare(findQuery).bind(...findParams).first()
      if (!existing) {
        return { content: [{ type: "text", text: `Entry não encontrada: ${args.id}` }] }
      }

      const col = getCollection(existing.col_slug)
      if (col?.governance === 'protected') {
        return {
          content: [{ type: "text", text: `🚫 BLOQUEADO: Collection "${existing.col_slug}" é protegida. Apenas humanos podem deletar.` }]
        }
      }

      let query = `DELETE FROM entries WHERE id = ?`
      const params: any[] = [args.id]
      
      if (tenantId) {
        query += ` AND tenant_id = ?`
        params.push(tenantId)
      } else {
        query += ` AND tenant_id IS NULL`
      }

      await db.prepare(query).bind(...params).run()

      return {
        content: [{ type: "text", text: `✅ Deletado com sucesso. ID: ${args.id}` }]
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Erro ao deletar: ${err.message}` }]
      }
    }
  }
)

// ── Ferramenta 6: Consultar Política de Governança ──────────────
server.tool(
  "get_governance_policy",
  "Retorna a política de governança de cada collection e as listas de tópicos sensíveis/seguros. Use antes de criar conteúdo para entender o que será publicado automaticamente vs o que vai para revisão humana.",
  {},
  async () => {
    const policies = collections.map(c => ({
      collection: c.slug,
      governance: c.governance,
      description: c.governance === 'autonomous'
        ? 'Agente pode publicar diretamente (exceto temas sensíveis)'
        : c.governance === 'assisted'
        ? 'Conteúdo vai como rascunho para aprovação humana'
        : 'Apenas humanos podem gerenciar esta collection',
    }))

    return {
      content: [{ type: "text", text: JSON.stringify({
        policies,
        sensitive_topics: ASSISTED_TOPICS,
        safe_topics: AUTONOMOUS_TOPICS,
        fail_safe: 'Na dúvida, conteúdo fica como rascunho (draft) para revisão humana.',
      }, null, 2) }]
    }
  }
)

// ── Transport & Connection ──────────────────────────────────────
const transport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID()
})

server.connect(transport).catch(console.error)

export async function handleMcpRequest(req: Request, db: any, tenantId?: string, env?: any) {
  (globalThis as any).__MCP_DB = db;
  (globalThis as any).__MCP_TENANT = tenantId;
  (globalThis as any).__MCP_ENV = env;
  return transport.handleRequest(req)
}
