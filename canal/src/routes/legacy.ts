/**
 * Canal CMS — Legacy API Routes
 *
 * Mantém retrocompatibilidade com as rotas que o site público consome:
 *   GET /api/insights, /api/cases, /api/jobs, etc.
 *
 * Ainda lêem das tabelas legadas (insights, jobs, cases).
 * Quando a migração completa para entries estiver pronta, essas rotas
 * passarão a ler da tabela entries.
 */

import { Hono } from 'hono'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const legacy = new Hono<Env>()

// ── Insights (blog) ─────────────────────────────────────────────
legacy.get('/insights', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, slug, title, tag, icon, date, desc, featured
     FROM insights WHERE lang = ? AND published = 1
     ORDER BY date DESC`
  ).bind(lang).all()
  return c.json(results)
})

legacy.get('/insights/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const slug = c.req.param('slug')
  const result = await c.env.DB.prepare(
    `SELECT * FROM insights WHERE slug = ? AND lang = ? AND published = 1 LIMIT 1`
  ).bind(slug, lang).first()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

// ── Cases (portfolio) ───────────────────────────────────────────
legacy.get('/cases', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, slug, client, category, project, result, desc, stats, image, featured
     FROM cases WHERE lang = ? AND published = 1
     ORDER BY featured DESC, id ASC`
  ).bind(lang).all()
  return c.json(results)
})

legacy.get('/cases/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const slug = c.req.param('slug')
  const result = await c.env.DB.prepare(
    `SELECT * FROM cases WHERE slug = ? AND lang = ? AND published = 1 LIMIT 1`
  ).bind(slug, lang).first()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

// ── Jobs (carreiras) ────────────────────────────────────────────
legacy.get('/jobs', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT id, lang, title, vertical, location, type, desc, requirements
     FROM jobs WHERE lang = ? AND published = 1
     ORDER BY id ASC`
  ).bind(lang).all()
  const items = (results as any[]).map(j => ({
    ...j,
    requirements: (() => { try { return JSON.parse(j.requirements) } catch { return [] } })()
  }))
  return c.json(items)
})

// ── Newsletter ──────────────────────────────────────────────────
legacy.post('/newsletter', async (c) => {
  try {
    const { email } = await c.req.json<{ email: string }>()
    if (!email || !email.includes('@')) return c.json({ error: 'Invalid email' }, 400)
    const existing = await c.env.DB.prepare(
      'SELECT id FROM newsletter WHERE email = ? LIMIT 1'
    ).bind(email).first()
    if (existing) return c.json({ success: true, message: 'already_subscribed' })
    await c.env.DB.prepare(
      "INSERT INTO newsletter (email) VALUES (?)"
    ).bind(email).run()
    return c.json({ success: true, message: 'subscribed' })
  } catch {
    return c.json({ error: 'Failed' }, 500)
  }
})

// ── Form submission ─────────────────────────────────────────────
legacy.post('/submit-form', async (c) => {
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

export { legacy }
