/**
 * Canal CMS — Generic CRUD Routes for Collections/Entries
 *
 * Rotas RESTful que operam sobre qualquer collection registrada.
 * Resolve a collection pelo slug, valida campos e persiste no D1.
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { collections, getCollection, getRequiredFields } from '../collections'
import { createAuth } from '../auth'

type Env = {
  Bindings: {
    DB: D1Database
    AI: Ai
    VECTORIZE: VectorizeIndex
    MEDIA: R2Bucket
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    ADMIN_SETUP_KEY: string
  }
}

const entries = new Hono<Env>()

// ── Lista todas as collections ──────────────────────────────────
entries.get('/collections', (c) => {
  return c.json(collections.map(col => ({
    slug: col.slug,
    label: col.label,
    labelPlural: col.labelPlural,
    icon: col.icon,
    hasLocale: col.hasLocale,
    hasSlug: col.hasSlug,
    hasStatus: col.hasStatus,
    fieldCount: col.fields.length,
  })))
})

// ── Schema de uma collection ────────────────────────────────────
entries.get('/collections/:slug', (c) => {
  const col = getCollection(c.req.param('slug'))
  if (!col) return c.json({ error: 'Collection not found' }, 404)
  return c.json(col)
})

// ── Listar entries de uma collection ────────────────────────────
entries.get('/collections/:slug/entries', async (c) => {
  const col = getCollection(c.req.param('slug'))
  if (!col) return c.json({ error: 'Collection not found' }, 404)

  const locale = c.req.query('locale') || c.req.query('lang') || 'pt'
  const status = c.req.query('status') || 'published'
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = Math.min(parseInt(c.req.query('limit') || '20', 10), 100)
  const offset = (page - 1) * limit

  // Tenant identification fallback logic
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null)
  const tenantId = c.req.header('x-tenant-id') || session?.session?.activeOrganizationId

  // Buscar collection_id
  const colRow = await c.env.DB.prepare(
    'SELECT id FROM collections WHERE slug = ? LIMIT 1'
  ).bind(col.slug).first<{ id: string }>()

  if (!colRow) return c.json({ error: 'Collection not seeded in DB' }, 404)

  // Buscar entries
  let query = `SELECT * FROM entries WHERE collection_id = ?`
  const params: unknown[] = [colRow.id]

  if (col.hasLocale) {
    query += ` AND locale = ?`
    params.push(locale)
  }

  if (col.hasStatus && status !== 'all') {
    query += ` AND status = ?`
    params.push(status)
  }

  if (tenantId) {
    query += ` AND tenant_id = ?`
    params.push(tenantId)
  } else {
    query += ` AND tenant_id IS NULL`
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const { results } = await c.env.DB.prepare(query).bind(...params).all()

  // Contar total para paginação
  let countQuery = `SELECT COUNT(*) as total FROM entries WHERE collection_id = ?`
  const countParams: unknown[] = [colRow.id]
  if (col.hasLocale) {
    countQuery += ` AND locale = ?`
    countParams.push(locale)
  }
  if (col.hasStatus && status !== 'all') {
    countQuery += ` AND status = ?`
    countParams.push(status)
  }
  if (tenantId) {
    countQuery += ` AND tenant_id = ?`
    countParams.push(tenantId)
  } else {
    countQuery += ` AND tenant_id IS NULL`
  }
  const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>()


  // Parse JSON data de cada entry
  const items = (results as any[]).map(row => ({
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    status: row.status,
    ...safeParseJSON(row.data),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  }))

  return c.json({
    data: items,
    meta: {
      collection: col.slug,
      page,
      limit,
      total: countResult?.total ?? 0,
      totalPages: Math.ceil((countResult?.total ?? 0) / limit),
    }
  })
})

// ── Detalhe de uma entry ────────────────────────────────────────
entries.get('/collections/:slug/entries/:id', async (c) => {
  const col = getCollection(c.req.param('slug'))
  if (!col) return c.json({ error: 'Collection not found' }, 404)

  const id = c.req.param('id')
  const locale = c.req.query('locale') || c.req.query('lang') || 'pt'

  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null)
  const tenantId = c.req.header('x-tenant-id') || session?.session?.activeOrganizationId

  let tSql = tenantId ? 'tenant_id = ?' : 'tenant_id IS NULL';

  // Tentar buscar por ID primeiro, depois por slug
  let row = await c.env.DB.prepare(
    `SELECT * FROM entries WHERE id = ? AND ${tSql} LIMIT 1`
  ).bind(...(tenantId ? [id, tenantId] : [id])).first()

  if (!row && col.hasSlug) {
    // Buscar collection_id primeiro
    const colRow = await c.env.DB.prepare(
      'SELECT id FROM collections WHERE slug = ? LIMIT 1'
    ).bind(col.slug).first<{ id: string }>()

    if (colRow) {
      row = await c.env.DB.prepare(
        `SELECT * FROM entries WHERE collection_id = ? AND slug = ? AND locale = ? AND ${tSql} LIMIT 1`
      ).bind(colRow.id, id, locale, ...(tenantId ? [tenantId] : [])).first()
    }
  }

  if (!row) return c.json({ error: 'Entry not found' }, 404)

  const entry = row as any
  return c.json({
    id: entry.id,
    slug: entry.slug,
    locale: entry.locale,
    status: entry.status,
    ...safeParseJSON(entry.data),
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    publishedAt: entry.published_at,
  })
})

// ── Criar entry (requer auth) ───────────────────────────────────
entries.post('/collections/:slug/entries', async (c) => {
  const col = getCollection(c.req.param('slug'))
  if (!col) return c.json({ error: 'Collection not found' }, 404)

  const rawBody = await c.req.json()

  // Build dynamic Zod schema to strip unapproved fields
  const schemaObj: Record<string, z.ZodTypeAny> = {
    locale: z.string().optional(),
    status: z.string().optional(),
    slug: z.string().optional()
  }
  
  col.fields.forEach(f => {
    schemaObj[f.name] = f.required ? z.any() : z.any().optional()
  })
  
  const schema = z.object(schemaObj).strip()
  const parsed = schema.safeParse(rawBody)
  
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400)
  }
  
  const body = parsed.data as Record<string, unknown>

  // Additional fallback validation for required fields
  const required = getRequiredFields(col)
  const missing = required.filter(f => body[f] === undefined || body[f] === null || body[f] === '')
  if (missing.length > 0) {
    return c.json({ error: `Missing required fields: ${missing.join(', ')}` }, 400)
  }

  // Auth/Tenant validation for writes
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  const tenantId = c.req.header('x-tenant-id') || session.session.activeOrganizationId

  // Buscar collection_id
  const colRow = await c.env.DB.prepare(
    'SELECT id FROM collections WHERE slug = ? LIMIT 1'
  ).bind(col.slug).first<{ id: string }>()

  if (!colRow) return c.json({ error: 'Collection not seeded in DB' }, 404)

  const id = crypto.randomUUID()
  const locale = (body.locale as string) || 'pt'
  const status = (body.status as string) || 'draft'
  const slug = col.hasSlug ? ((body.slug as string) || generateSlug(body.title as string || id)) : null

  // Separar campos de sistema dos dados
  const { locale: _l, status: _s, slug: _sl, ...data } = body

  const now = new Date().toISOString()
  const publishedAt = status === 'published' ? now : null

  await c.env.DB.prepare(
    `INSERT INTO entries (id, tenant_id, collection_id, data, slug, locale, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, tenantId || null, colRow.id, JSON.stringify(data), slug, locale, status, publishedAt, now, now).run()

  return c.json({ id, slug, locale, status }, 201)
})

// ── Atualizar entry (requer auth) ───────────────────────────────
entries.put('/collections/:slug/entries/:id', async (c) => {
  const col = getCollection(c.req.param('slug'))
  if (!col) return c.json({ error: 'Collection not found' }, 404)

  const entryId = c.req.param('id')
  const rawBody = await c.req.json()

  // Build dynamic Zod schema to strip unapproved fields
  const schemaObj: Record<string, z.ZodTypeAny> = {
    locale: z.string().optional(),
    status: z.string().optional(),
    slug: z.string().optional()
  }
  
  col.fields.forEach(f => {
    schemaObj[f.name] = z.any().optional() // Updates shouldn't require all fields, just partial
  })
  
  const schema = z.object(schemaObj).strip()
  const parsed = schema.safeParse(rawBody)
  
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400)
  }
  
  const body = parsed.data as Record<string, unknown>

  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  const tenantId = c.req.header('x-tenant-id') || session.session.activeOrganizationId

  let tSql = tenantId ? 'tenant_id = ?' : 'tenant_id IS NULL';

  const existing = await c.env.DB.prepare(
    `SELECT * FROM entries WHERE id = ? AND ${tSql} LIMIT 1`
  ).bind(...(tenantId ? [entryId, tenantId] : [entryId])).first()

  if (!existing) return c.json({ error: 'Entry not found' }, 404)

  const status = (body.status as string) || (existing as any).status
  const slug = col.hasSlug ? ((body.slug as string) || (existing as any).slug) : null
  const locale = (body.locale as string) || (existing as any).locale

  // Merge data existing + new
  const existingData = safeParseJSON((existing as any).data)
  const { locale: _l, status: _s, slug: _sl, ...newData } = body
  const mergedData = { ...existingData, ...newData }

  const now = new Date().toISOString()
  const publishedAt = status === 'published' ? ((existing as any).published_at || now) : null

  await c.env.DB.prepare(
    `UPDATE entries SET data = ?, slug = ?, locale = ?, status = ?, published_at = ?, updated_at = ?
     WHERE id = ? AND ${tSql}`
  ).bind(JSON.stringify(mergedData), slug, locale, status, publishedAt, now, entryId, ...(tenantId ? [tenantId] : [])).run()

  return c.json({ id: entryId, slug, locale, status, updated: true })
})

// ── Deletar entry (requer auth) ─────────────────────────────────
entries.delete('/collections/:slug/entries/:id', async (c) => {
  const entryId = c.req.param('id')

  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, c.env.BETTER_AUTH_URL)
  const session = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  const tenantId = c.req.header('x-tenant-id') || session.session.activeOrganizationId

  let tSql = tenantId ? 'tenant_id = ?' : 'tenant_id IS NULL';

  const { success } = await c.env.DB.prepare(
    `DELETE FROM entries WHERE id = ? AND ${tSql}`
  ).bind(...(tenantId ? [entryId, tenantId] : [entryId])).run()

  return c.json({ success, deleted: entryId })
})

// ── Helpers ─────────────────────────────────────────────────────

function safeParseJSON(str: unknown): Record<string, unknown> {
  if (typeof str !== 'string') return {}
  try { return JSON.parse(str) } catch { return {} }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80)
}

export { entries }
