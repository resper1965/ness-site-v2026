import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'

type Bindings = {
  DB: D1Database
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  ADMIN_SETUP_KEY: string   // env var temporária para proteger o endpoint de bootstrap
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS — permite o admin local e o domínio de produção
app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8787',
    'https://canal.ness.workers.dev',
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Better Auth — monta handler em /api/auth/*
// Usa app.all para cobrir GET, POST, OPTIONS e demais métodos usados pelo Better-Auth
app.all('/api/auth/*', (c) => {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  return auth.handler(c.req.raw)
})

// ── Bootstrap de primeiro usuário (protegido por ADMIN_SETUP_KEY) ────────────

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

// ── API pública ──────────────────────────────────────────────────────────────

app.get('/', (c) => c.text('Canal API v2 — Better Auth + D1'))

app.get('/api/insights', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, slug, title, tag, icon, date, desc, featured
     FROM insights WHERE lang = ? AND published = 1
     ORDER BY date DESC`
  ).bind(lang).all()
  return c.json(results)
})

app.get('/api/jobs', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, title, vertical, location, type, desc, requirements
     FROM jobs WHERE lang = ? AND published = 1
     ORDER BY id ASC`
  ).bind(lang).all()
  // Parse requirements JSON string → array
  const items = (results as any[]).map(j => ({
    ...j,
    requirements: (() => { try { return JSON.parse(j.requirements) } catch { return [] } })()
  }))
  return c.json(items)
})

app.get('/api/cases', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, client, category, project, result, desc, stats, image, featured
     FROM cases WHERE lang = ? AND published = 1
     ORDER BY featured DESC, id ASC`
  ).bind(lang).all()
  return c.json(results)
})

app.post('/api/submit-form', async (c) => {
  try {
    const body = await c.req.json()
    const source = (body as any)?.type || 'unknown_form'
    const { success } = await c.env.DB.prepare(
      "INSERT INTO forms (payload, source, status) VALUES (?, ?, 'new')"
    ).bind(JSON.stringify(body), source).run()
    if (success) {
      return c.json({ success: true, message: 'Formulário registrado.' })
    }
    throw new Error('Falha na inserção')
  } catch {
    return c.json({ error: 'Failed to submit form' }, 500)
  }
})

// ── API protegida (requer sessão válida) ─────────────────────────────────────

async function requireSession(c: any, next: () => Promise<void>) {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('session', session)
  await next()
}

// CRUD de insights (admin)
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

// CRUD de vagas (admin)
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

// CRUD de cases (admin)
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

// Listagem de formulários recebidos (admin)
app.get('/api/admin/forms', requireSession, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM forms ORDER BY created_at DESC LIMIT 50'
  ).all()
  return c.json(results)
})

export default app
