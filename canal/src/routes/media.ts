/**
 * Canal CMS — Media Routes (R2 Upload + Gallery)
 *
 * Upload via multipart/form-data ou signed URLs.
 * Armazena metadados no D1, arquivos no R2.
 */

import { Hono } from 'hono'

type Env = {
  Bindings: {
    DB: D1Database
    MEDIA: R2Bucket
  }
}

const media = new Hono<Env>()

// ── Upload direto (multipart) ───────────────────────────────────
media.post('/media/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null

  if (!file) return c.json({ error: 'No file provided' }, 400)

  const id = crypto.randomUUID()
  const ext = file.name.split('.').pop() || 'bin'
  const r2Key = `uploads/${new Date().toISOString().slice(0, 7)}/${id}.${ext}`

  // Upload para R2
  const arrayBuffer = await file.arrayBuffer()
  await c.env.MEDIA.put(r2Key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  })

  // Extrair dimensões se for imagem (básico — sem lib externa)
  let width: number | null = null
  let height: number | null = null

  // Salvar metadados no D1
  await c.env.DB.prepare(
    `INSERT INTO media (id, filename, mime_type, size_bytes, r2_key, width, height, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, file.name, file.type, file.size, r2Key,
    width, height, new Date().toISOString()
  ).run()

  return c.json({
    id,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    r2Key,
    url: `/api/v1/media/${id}/file`,
  }, 201)
})

// ── Listar media (galeria) ──────────────────────────────────────
media.get('/media', async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = Math.min(parseInt(c.req.query('limit') || '20', 10), 100)
  const offset = (page - 1) * limit
  const mimeFilter = c.req.query('type') // ex: 'image', 'application'

  let query = 'SELECT * FROM media'
  const params: unknown[] = []

  if (mimeFilter) {
    query += ' WHERE mime_type LIKE ?'
    params.push(`${mimeFilter}/%`)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const { results } = await c.env.DB.prepare(query).bind(...params).all()

  // Total count
  let countQuery = 'SELECT COUNT(*) as total FROM media'
  const countParams: unknown[] = []
  if (mimeFilter) {
    countQuery += ' WHERE mime_type LIKE ?'
    countParams.push(`${mimeFilter}/%`)
  }
  const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>()

  return c.json({
    data: (results as any[]).map(row => ({
      id: row.id,
      filename: row.filename,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes,
      altText: row.alt_text,
      width: row.width,
      height: row.height,
      url: `/api/v1/media/${row.id}/file`,
      createdAt: row.created_at,
    })),
    meta: { page, limit, total: countResult?.total ?? 0 }
  })
})

// ── Servir arquivo do R2 ────────────────────────────────────────
media.get('/media/:id/file', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare(
    'SELECT r2_key, mime_type, filename FROM media WHERE id = ? LIMIT 1'
  ).bind(id).first<{ r2_key: string; mime_type: string; filename: string }>()

  if (!row) return c.json({ error: 'Not found' }, 404)

  const object = await c.env.MEDIA.get(row.r2_key)
  if (!object) return c.json({ error: 'File not found in storage' }, 404)

  const headers = new Headers()
  headers.set('Content-Type', row.mime_type)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('Content-Disposition', `inline; filename="${row.filename}"`)

  return new Response(object.body, { headers })
})

// ── Metadados de um arquivo ─────────────────────────────────────
media.get('/media/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT * FROM media WHERE id = ? LIMIT 1').bind(id).first()
  if (!row) return c.json({ error: 'Not found' }, 404)

  const r = row as any
  return c.json({
    id: r.id,
    filename: r.filename,
    mimeType: r.mime_type,
    sizeBytes: r.size_bytes,
    altText: r.alt_text,
    width: r.width,
    height: r.height,
    r2Key: r.r2_key,
    url: `/api/v1/media/${r.id}/file`,
    createdAt: r.created_at,
  })
})

// ── Atualizar alt text ──────────────────────────────────────────
media.put('/media/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ altText?: string }>()

  const { success } = await c.env.DB.prepare(
    'UPDATE media SET alt_text = ? WHERE id = ?'
  ).bind(body.altText || null, id).run()

  return c.json({ success, id })
})

// ── Deletar media ───────────────────────────────────────────────
media.delete('/media/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare(
    'SELECT r2_key FROM media WHERE id = ? LIMIT 1'
  ).bind(id).first<{ r2_key: string }>()

  if (!row) return c.json({ error: 'Not found' }, 404)

  // Deletar do R2
  await c.env.MEDIA.delete(row.r2_key)

  // Deletar do D1
  await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run()

  return c.json({ success: true, deleted: id })
})

export { media }
