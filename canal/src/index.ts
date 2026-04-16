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

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'
import { createAuth } from './auth'
import { seedVectors, SOLUTIONS_CORPUS } from './seed-vectors'
import { entries } from './routes/entries'
import { media } from './routes/media'
import { marketing } from './routes/marketing'
import { legacy } from './routes/legacy'
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

const app = new Hono<{ Bindings: Bindings }>()

// ── CORS ────────────────────────────────────────────────────────
app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8787',
    'https://canal.ness.workers.dev',
  ],
  allowHeaders: ['Content-Type', 'Authorization', 'x-setup-key', 'x-session-id'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// ── Better Auth ─────────────────────────────────────────────────
app.all('/api/auth/*', (c) => {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  return auth.handler(c.req.raw)
})

// ── Auth Middleware ──────────────────────────────────────────────
async function requireSession(c: any, next: () => Promise<void>) {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('session', session)
  await next()
}

async function requireAdminOrKey(c: any, next: () => Promise<void>) {
  const setupKey = c.req.header('x-setup-key')
  if (setupKey === c.env.ADMIN_SETUP_KEY) {
    await next()
    return
  }
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('session', session)
  await next()
}

// ── Root ────────────────────────────────────────────────────────
app.get('/', (c) => c.json({
  name: 'Canal CMS',
  version: '0.4.0',
  endpoints: {
    legacy: '/api/{insights,cases,jobs}',
    v1: '/api/v1/collections',
    auth: '/api/auth/*',
    chat: '/api/chat',
    media: '/api/v1/media',
    marketing: '/api/v1/marketing/*',
  }
}))

// ── Mount: Rotas legadas (retrocompat site) ─────────────────────
app.route('/api', legacy)

// ── Mount: API v1 (CMS genérico) — protegidas por auth ─────────
// Rotas públicas de leitura
app.route('/api/v1', entries)
app.route('/api/v1', media)
app.route('/api/v1', marketing)

// ── MCP Server (Agents Integration) ──────────────────────────────
app.all('/api/mcp/*', requireAdminOrKey, async (c) => {
  return handleMcpRequest(c.req.raw, c.env.DB)
})

// ── Bootstrap admin (setup-key) ─────────────────────────────────
app.post('/api/setup/admin', async (c) => {
  const key = c.req.header('x-setup-key')
  if (!key || key !== c.env.ADMIN_SETUP_KEY) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const { email, password, name } = await c.req.json<{
    email: string; password: string; name: string
  }>()

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    })
    return c.json({ success: true, user: result.user.email })
  } catch (err: any) {
    return c.json({ error: err?.message ?? 'Failed to create user' }, 400)
  }
})

// ── Admin CRUD legado (protegido por session) ───────────────────

app.post('/api/admin/insights', requireSession, async (c) => {
  const body = await c.req.json<{
    lang: string; slug: string; title: string; tag: string;
    icon?: string; date: string; desc: string; featured?: number
  }>()
  const { success } = await c.env.DB.prepare(
    `INSERT INTO insights (lang, slug, title, tag, icon, date, desc, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.lang, body.slug, body.title, body.tag,
    body.icon ?? 'FileText', body.date, body.desc, body.featured ?? 0
  ).run()
  return c.json({ success })
})

app.delete('/api/admin/insights/:id', requireSession, async (c) => {
  const id = c.req.param('id')
  const { success } = await c.env.DB.prepare('DELETE FROM insights WHERE id = ?').bind(id).run()
  return c.json({ success })
})

app.post('/api/admin/jobs', requireSession, async (c) => {
  const body = await c.req.json<{
    lang: string; title: string; vertical: string; location: string;
    type: string; desc: string; requirements: string[]
  }>()
  const { success } = await c.env.DB.prepare(
    `INSERT INTO jobs (lang, title, vertical, location, type, desc, requirements)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.lang, body.title, body.vertical, body.location,
    body.type, body.desc, JSON.stringify(body.requirements ?? [])
  ).run()
  return c.json({ success })
})

app.post('/api/admin/cases', requireSession, async (c) => {
  const body = await c.req.json<{
    lang: string; client: string; category: string; project: string;
    result: string; desc: string; stats: string; image?: string; featured?: number
  }>()
  const { success } = await c.env.DB.prepare(
    `INSERT INTO cases (lang, client, category, project, result, desc, stats, image, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.lang, body.client, body.category, body.project,
    body.result, body.desc, body.stats, body.image ?? '', body.featured ?? 0
  ).run()
  return c.json({ success })
})

app.delete('/api/admin/cases/:id', requireSession, async (c) => {
  const id = c.req.param('id')
  const { success } = await c.env.DB.prepare('DELETE FROM cases WHERE id = ?').bind(id).run()
  return c.json({ success })
})

app.delete('/api/admin/jobs/:id', requireSession, async (c) => {
  const id = c.req.param('id')
  const { success } = await c.env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run()
  return c.json({ success })
})

app.get('/api/admin/forms', requireSession, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM forms ORDER BY created_at DESC LIMIT 50'
  ).all()
  return c.json(results)
})

app.get('/api/admin/chats', requireSession, async (c) => {
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

// ── Chat RAG (público) ──────────────────────────────────────────
app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json<{ messages: Array<{ role: string; content: string }> }>()
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

  const ragContext = context.trim()
    ? context
    : SOLUTIONS_CORPUS.map(s => s.content).join('\n\n---\n\n')

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
