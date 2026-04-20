/**
 * Canal CMS — Main Worker Entry Point (v3)
 *
 * Arquitetura modular:
 *   /api/*          → Rotas legadas (retrocompat site público)
 *   /api/v1/*       → API CMS genérica (collections, entries, media)
 *   /api/auth/*     → Better Auth
 *   /api/chat       → RAG chatbot
 *   /api/admin/*    → Rotas administrativas protegidas
 */

import { Hono, Context } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { streamText } from 'ai'
import { z } from 'zod'
import { createWorkersAI } from 'workers-ai-provider'
import { createAuth } from './auth'
import { seedVectors } from './seed-vectors'
import { entries } from './routes/entries'
import { media } from './routes/media'
import { marketing } from './routes/marketing'
import { legacy } from './routes/legacy'
import { aiWriter } from './routes/ai-writer'
import { handleMcpRequest } from './mcp'

type Bindings = {
  DB: D1Database
  AI: Ai
  VECTORIZE: VectorizeIndex
  MEDIA: R2Bucket
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  ADMIN_SETUP_KEY: string
}

type Variables = {
  tenantId?: string;
  agentSession?: any;
  session?: any;
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// ── CORS & Security ───────────────────────────────────────────────
app.use('/*', secureHeaders())
app.use('/*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8787',
    'https://canal.ness.workers.dev',
    'https://ness-site2026.pages.dev',
    'https://ness.com.br',
    'https://www.ness.com.br',
    'https://forense.io',
    'https://www.forense.io',
    'https://trustness.com.br',
    'https://www.trustness.com.br',
  ],
  allowHeaders: ['Content-Type', 'Authorization', 'x-setup-key', 'x-session-id', 'x-tenant-id'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// ── Better Auth ─────────────────────────────────────────────────
app.all('/api/auth/*', (c) => {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  return auth.handler(c.req.raw)
})

// ── Auth Middleware (SaaS / Tenant Isolator) ───────────────────
async function requireSession(c: Context<{ Bindings: Bindings, Variables: Variables }>, next: () => Promise<void>) {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  
  // Extrai Tenant explícito, ou da sessão ativa do usuário
  const tenantId = c.req.header('x-tenant-id') || session?.session?.activeOrganizationId || undefined;
  c.set('tenantId', tenantId);
  c.set('session', session)
  await next()
}

async function requireAdminOrKey(c: Context<{ Bindings: Bindings, Variables: Variables }>, next: () => Promise<void>) {
  const setupKey = c.req.header('x-setup-key')
  if (setupKey === c.env.ADMIN_SETUP_KEY) {
    await next()
    return
  }
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  
  // Se for AI Agent usando Token (MCP via Agent Auth)
  const agentSession = await auth.api.getAgentSession?.({ headers: c.req.raw.headers }).catch(() => null)
  if (agentSession) {
    c.set('agentSession', agentSession);
    await next();
    return;
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  const tenantId = c.req.header('x-tenant-id') || session?.session?.activeOrganizationId || undefined;
  c.set('tenantId', tenantId);
  c.set('session', session)
  await next()
}

// ── Root (A05: no info disclosure) ──────────────────────────────
app.get('/', (c) => c.json({ name: 'Canal CMS', status: 'ok' }))


// ── Agent Discovery (/.well-known) ──────────────────────────────
app.all('/.well-known/agent-configuration', (c) => {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  return auth.handler(c.req.raw)
})

// ── Mount: Rotas legadas (retrocompat site) ─────────────────────
app.route('/api', legacy)

// ── Mount: API v1 (CMS genérico) ────────────────────────────────
// Leitura pública
app.route('/api/v1', entries)
app.route('/api/v1', marketing)
// Upload requer sessão (P0: evitar abuso do R2)
app.use('/api/v1/media/upload', requireSession)
app.route('/api/v1', media)

// ── Mount: AI Writer (agente redator) — protegido por auth ─────
app.use('/api/content-agent/*', requireSession)
app.route('/api/content-agent', aiWriter)

// ── MCP Server (Agents Integration) ──────────────────────────────
app.all('/api/mcp/*', requireAdminOrKey, async (c) => {
  let tenantId = c.get('tenantId') as string | undefined;
  const agentSession = c.get('agentSession') as any;
  if (agentSession) {
    tenantId = c.req.header('x-tenant-id') || agentSession.agent?.organizationId || tenantId;
  }
  return handleMcpRequest(c.req.raw, c.env.DB, tenantId)
})

const setupAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
}).strip();

// ── Bootstrap admin (setup-key) ─────────────────────────────────
app.post('/api/setup/admin', async (c) => {
  const key = c.req.header('x-setup-key')
  if (!key || key !== c.env.ADMIN_SETUP_KEY) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  
  const parsed = setupAdminSchema.safeParse(await c.req.json())
  if (!parsed.success) return c.json({ error: 'Invalid payload', details: parsed.error.issues }, 400)
  
  const { email, password, name } = parsed.data

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    })
    return c.json({ success: true, user: result.user.email })
  } catch (err: any) {
    return c.json({ error: err?.message ?? 'Failed to create user' }, 400)
  }
})

// ── Admin CRUD v3 (gerenciado via collections/entries) ───────────────────

app.get('/api/admin/organizations', requireSession, async (c) => {
  const session = c.get('session')
  if (session?.user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  const query = `
    SELECT 
      o.*, 
      (SELECT COUNT(*) FROM member m WHERE m.organizationId = o.id) as memberCount 
    FROM organization o 
    ORDER BY o.createdAt DESC
  `
  const { results } = await c.env.DB.prepare(query).all()
  return c.json(results)
})

app.patch('/api/admin/organizations/:id', requireSession, async (c) => {
  const session = c.get('session')
  if (session?.user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  
  const id = c.req.param('id')
  const body = await c.req.json()
  
  // Atualiza metadados ou plan
  const { success } = await c.env.DB.prepare(
    'UPDATE organization SET metadata = ? WHERE id = ?'
  ).bind(JSON.stringify(body.metadata || {}), id).run()
  return c.json({ success })
})

app.delete('/api/admin/organizations/:id', requireSession, async (c) => {
  const session = c.get('session')
  if (session?.user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const id = c.req.param('id')
  
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM member WHERE organizationId = ?').bind(id),
    c.env.DB.prepare('DELETE FROM invitation WHERE organizationId = ?').bind(id),
    c.env.DB.prepare('DELETE FROM organization WHERE id = ?').bind(id)
  ])
  
  return c.json({ success: true })
})

app.get('/api/admin/api-keys/:orgId', requireSession, async (c) => {
  const orgId = c.req.param('orgId')
  const { results } = await c.env.DB.prepare(
    'SELECT id, name, createdAt, prefix FROM apikey WHERE metadata LIKE ? ORDER BY createdAt DESC'
  ).bind(`%"orgId":"${orgId}"%`).all()
  return c.json(results)
})

app.delete('/api/admin/api-keys/:id', requireSession, async (c) => {
  const id = c.req.param('id')
  const { success } = await c.env.DB.prepare('DELETE FROM apikey WHERE id = ?').bind(id).run()
  return c.json({ success })
})


// P0: forms e chats contêm dados sensíveis de leads — role=admin obrigatório
app.get('/api/admin/forms', requireSession, async (c) => {
  const session = c.get('session')
  if (session?.user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM forms ORDER BY created_at DESC LIMIT 50'
  ).all()
  return c.json(results)
})

app.get('/api/admin/chats', requireSession, async (c) => {
  const session = c.get('session')
  if (session?.user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM chats ORDER BY updated_at DESC LIMIT 50'
  ).all()
  return c.json(results)
})

// ── Seed Vectors (admin) ────────────────────────────────────────
app.post('/api/admin/seed-vectors', requireAdminOrKey, async (c) => {
  try {
    const results = await seedVectors(c.env)
    return c.json({ success: true, results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── Seed Collections (registra collections no D1) ───────────────
app.post('/api/admin/seed-collections', requireAdminOrKey, async (c) => {
  const { collections } = await import('./collections')

  const results = []
  for (const col of collections) {
    const id = crypto.randomUUID()
    try {
      await c.env.DB.prepare(
        `INSERT INTO collections (id, slug, label, label_plural, icon, has_locale, has_slug, has_status, fields, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           label = excluded.label,
           label_plural = excluded.label_plural,
           icon = excluded.icon,
           fields = excluded.fields`
      ).bind(
        id, col.slug, col.label, col.labelPlural ?? col.label + 's',
        col.icon, col.hasLocale ? 1 : 0, col.hasSlug ? 1 : 0, col.hasStatus ? 1 : 0,
        JSON.stringify(col.fields), collections.indexOf(col)
      ).run()
      results.push({ slug: col.slug, status: 'ok' })
    } catch (e: any) {
      results.push({ slug: col.slug, status: 'error', error: e.message })
    }
  }

  return c.json({ success: true, results })
})


// ── Chat rate limiter — A04: Insecure Design ────────────────────
const chatRateMap = new Map<string, { count: number; resetAt: number }>()
const CHAT_RATE_LIMIT = 20
const CHAT_RATE_WINDOW = 60_000

function isChatRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = chatRateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    chatRateMap.set(ip, { count: 1, resetAt: now + CHAT_RATE_WINDOW })
    return false
  }
  if (entry.count >= CHAT_RATE_LIMIT) return true
  entry.count++
  return false
}

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(4000),
  })).min(1).max(20),
})

// ── Chat RAG (público) ──────────────────────────────────────────
app.post('/api/chat', async (c) => {
  const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  if (isChatRateLimited(clientIp)) {
    return c.json({ error: 'Too many requests. Please wait.' }, 429)
  }

  const rawBody = await c.req.json()
  const chatParsed = chatSchema.safeParse(rawBody)
  if (!chatParsed.success) {
    return c.json({ error: 'Invalid request' }, 400)
  }
  const { messages } = chatParsed.data
  const lastMessage = messages[messages.length - 1]?.content || ''

  // 1. Embedding da pergunta
  const queryEmbedding = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [lastMessage]
  }) as any

  // 2. Buscar contexto no Vectorize
  const vectorResults = await c.env.VECTORIZE.query(queryEmbedding.data[0], {
    topK: 3,
    returnMetadata: 'all'
  })

  // 3. Montar contexto RAG
  const context = vectorResults.matches
    .map((m: any) => m.metadata?.content || '')
    .join('\n\n---\n\n')

  let ragContext = context.trim()
  
  if (!ragContext) {
    const fallback = await c.env.DB.prepare(`
      SELECT payload FROM entries 
      WHERE collection_id = (SELECT id FROM collections WHERE slug = 'solutions')
      LIMIT 10
    `).all()
    
    ragContext = fallback.results.map((r: any) => {
      const p = JSON.parse(r.payload || '{}')
      return `${p.title || ''}\n${p.content || p.desc || ''}`
    }).join('\n\n---\n\n')
  }
  // 4. System prompt
  const systemPrompt = `Você é a assistente virtual da ness., uma empresa de tecnologia fundada em 1991 com mais de 34 anos de experiência.
Você responde dúvidas sobre os serviços da ness. com base EXCLUSIVAMENTE no contexto abaixo.
Seja conciso, profissional, e direcione o usuário para falar com um consultor quando necessário.
Se a pergunta não tiver relação com a ness. ou seus serviços, diga educadamente que só pode ajudar com assuntos da ness.

--- CONTEXTO ---
${ragContext}
--- FIM DO CONTEXTO ---`

  // 5. Stream response
  const workersai = createWorkersAI({ binding: c.env.AI })

  const result = streamText({
    model: workersai('@cf/meta/llama-3.1-8b-instruct'),
    system: systemPrompt,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  })

  // 6. Log chat (fire-and-forget)
  const sessionId = c.req.header('x-session-id') || crypto.randomUUID()
  c.executionCtx.waitUntil(
    c.env.DB.prepare(
      `INSERT INTO chats (session_id, messages) VALUES (?, ?)
       ON CONFLICT(session_id) DO UPDATE SET messages = ?, updated_at = CURRENT_TIMESTAMP`
    ).bind(sessionId, JSON.stringify(messages), JSON.stringify(messages)).run().catch(() => {})
  )

  return result.toTextStreamResponse()
})

export default app
