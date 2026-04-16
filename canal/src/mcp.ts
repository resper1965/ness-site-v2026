import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'

const server = new McpServer({
  name: "canal-cms",
  version: "0.4.0"
})

// Ferramenta 1: Listar coleções
server.tool(
  "list_collections",
  "Lista o schema de todas as collections disponíveis no CMS (insights, jobs, cases, brandbook, signatures)",
  {},
  async () => {
    try {
      const { collections } = await import('./collections')
      return {
        content: [{ type: "text", text: JSON.stringify(collections, null, 2) }]
      }
    } catch (e: any) {
      return { content: [{ type: "text", text: `Erro: ${e.message}` }] }
    }
  }
)

// Ferramenta 2: Listar entradas
server.tool(
  "list_entries",
  "Lista as entries de uma collection específica pelo slug",
  {
    slug: z.string().describe("Slug da collection (ex: insights, jobs, cases, brandbook)"),
    limit: z.number().optional().describe("Limite de resultados (max 50, default 50)")
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      const results = await db.prepare(
        `SELECT * FROM entries 
         WHERE collection_id = (SELECT id FROM collections WHERE slug = ?)
         ORDER BY updated_at DESC
         LIMIT ?`
      ).bind(args.slug, args.limit || 50).all()

      // Vamos parsear JSON no return
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

// Ferramenta 3: Criar Entrada
server.tool(
  "create_entry",
  "Cria uma nova entry em uma collection",
  {
    slug: z.string(),
    data: z.string().describe("Objeto JSON em formato string com os dados de conteúdo"),
  },
  async (args) => {
    const db = (globalThis as any).__MCP_DB
    if (!db) return { content: [{ type: "text", text: "BD não conectado" }] }

    try {
      const id = crypto.randomUUID()
      await db.prepare(
        `INSERT INTO entries (id, collection_id, data, status)
         VALUES (?, (SELECT id FROM collections WHERE slug = ?), ?, 'published')`
      ).bind(id, args.slug, args.data).run()

      return {
        content: [{ type: "text", text: `Criado com sucesso. ID: ${id}` }]
      }
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Erro: ${err.message}` }]
      }
    }
  }
)


// Inicializa o transport do lado do servidor via Web Standards HTTP do MCP SDK Novo
const transport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID()
})

// Conecta o server ao transport de forma permanente para a instância atual do isolates
server.connect(transport).catch(console.error)

export async function handleMcpRequest(req: Request, db: any) {
  // Passa as dependências atachadas à request pro pool local temporário
  (globalThis as any).__MCP_DB = db
  return transport.handleRequest(req)
}
