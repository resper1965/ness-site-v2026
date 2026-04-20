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
import { z } from 'zod'

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
    `SELECT e.id, e.locale as lang, e.slug,
            json_extract(e.data, '$.title') as title,
            json_extract(e.data, '$.tag') as tag,
            json_extract(e.data, '$.icon') as icon,
            json_extract(e.data, '$.date') as date,
            json_extract(e.data, '$.desc') as desc,
            json_extract(e.data, '$.featured') as featured
     FROM entries e
     JOIN collections col ON e.collection_id = col.id
     WHERE col.slug = 'insights' AND e.locale = ? AND e.status = 'published'
     ORDER BY date DESC`
  ).bind(lang).all()
  return c.json(results)
})

legacy.get('/insights/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const slug = c.req.param('slug')
  const result = await c.env.DB.prepare(
    `SELECT e.id, e.locale as lang, e.slug,
            json_extract(e.data, '$.title') as title,
            json_extract(e.data, '$.tag') as tag,
            json_extract(e.data, '$.icon') as icon,
            json_extract(e.data, '$.date') as date,
            json_extract(e.data, '$.desc') as desc,
            json_extract(e.data, '$.body') as body,
            json_extract(e.data, '$.featured') as featured
     FROM entries e
     JOIN collections col ON e.collection_id = col.id
     WHERE col.slug = 'insights' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
     LIMIT 1`
  ).bind(slug, lang).first()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

// ── Cases (portfolio) ───────────────────────────────────────────
legacy.get('/cases', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT e.id, e.locale as lang, e.slug,
            json_extract(e.data, '$.client') as client,
            json_extract(e.data, '$.category') as category,
            json_extract(e.data, '$.project') as project,
            json_extract(e.data, '$.result') as result,
            json_extract(e.data, '$.desc') as desc,
            json_extract(e.data, '$.stats') as stats,
            json_extract(e.data, '$.image') as image,
            json_extract(e.data, '$.featured') as featured
     FROM entries e
     JOIN collections col ON e.collection_id = col.id
     WHERE col.slug = 'cases' AND e.locale = ? AND e.status = 'published'
     ORDER BY featured DESC, e.id ASC`
  ).bind(lang).all()
  return c.json(results)
})

legacy.get('/cases/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const slug = c.req.param('slug')
  const result = await c.env.DB.prepare(
    `SELECT e.id, e.locale as lang, e.slug,
            json_extract(e.data, '$.client') as client,
            json_extract(e.data, '$.category') as category,
            json_extract(e.data, '$.project') as project,
            json_extract(e.data, '$.result') as result,
            json_extract(e.data, '$.desc') as desc,
            json_extract(e.data, '$.stats') as stats,
            json_extract(e.data, '$.image') as image,
            json_extract(e.data, '$.featured') as featured
     FROM entries e
     JOIN collections col ON e.collection_id = col.id
     WHERE col.slug = 'cases' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
     LIMIT 1`
  ).bind(slug, lang).first()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

// ── Jobs (carreiras) ────────────────────────────────────────────
legacy.get('/jobs', async (c) => {
  const lang = c.req.query('lang') || 'pt'
  const { results } = await c.env.DB.prepare(
    `SELECT e.id, e.locale as lang,
            json_extract(e.data, '$.title') as title,
            json_extract(e.data, '$.vertical') as vertical,
            json_extract(e.data, '$.location') as location,
            json_extract(e.data, '$.type') as type,
            json_extract(e.data, '$.desc') as desc,
            json_extract(e.data, '$.requirements') as requirements
     FROM entries e
     JOIN collections col ON e.collection_id = col.id
     WHERE col.slug = 'jobs' AND e.locale = ? AND e.status = 'published'
     ORDER BY e.created_at ASC`
  ).bind(lang).all()
  const items = (results as any[]).map(j => ({
    ...j,
    requirements: (() => { try { return typeof j.requirements === 'string' ? JSON.parse(j.requirements) : j.requirements } catch { return [] } })()
  }))
  return c.json(items)
})

// ── Newsletter ──────────────────────────────────────────────────
const newsletterSchema = z.object({
  email: z.string().email().max(254),
})

legacy.post('/newsletter', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) return c.json({ error: 'Invalid email' }, 400)
    const { email } = parsed.data
    const existing = await c.env.DB.prepare(
      'SELECT id FROM newsletter WHERE email = ? LIMIT 1'
    ).bind(email).first()
    // Always return success — prevents email enumeration (A07)
    if (existing) return c.json({ success: true })
    await c.env.DB.prepare(
      "INSERT INTO newsletter (email) VALUES (?)"
    ).bind(email).run()
    return c.json({ success: true })
  } catch (err) {
    console.error('[security] newsletter error:', err instanceof Error ? err.message : String(err))
    return c.json({ error: 'Failed' }, 500)
  }
})

// ── Form submission ─────────────────────────────────────────────
const ALLOWED_FORM_TYPES = ['contact', 'careers', 'whistleblower', 'newsletter'] as const

const formSchema = z.object({
  type: z.enum(ALLOWED_FORM_TYPES),
  name: z.string().max(200).optional(),
  email: z.string().email().max(254).optional(),
  message: z.string().max(5000).optional(),
  phone: z.string().max(30).optional(),
  company: z.string().max(200).optional(),
  subject: z.string().max(300).optional(),
  // extra fields stored but bounded
  extra: z.record(z.string(), z.string().max(1000)).optional(),
})

legacy.post('/submit-form', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = formSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid form payload', details: parsed.error.issues }, 400)
    }
    const { type, ...rest } = parsed.data
    const { success } = await c.env.DB.prepare(
      "INSERT INTO forms (payload, source, status) VALUES (?, ?, 'new')"
    ).bind(JSON.stringify(rest), type).run()
    if (success) {
      return c.json({ success: true, message: 'Formulário registrado.' })
    }
    throw new Error('DB insert failed')
  } catch (err) {
    console.error('[security] form submission error:', err instanceof Error ? err.message : String(err))
    return c.json({ error: 'Failed to submit form' }, 500)
  }
})

export { legacy }
