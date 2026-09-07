import { Hono } from 'hono'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import * as schema from '../db/schema'
import { upsertVector } from '../vectorize-sync'

type Env = {
  Bindings: {
    DB: D1Database
    AI: Ai
    VECTORIZE: VectorizeIndex
    MEDIA: R2Bucket
  }
}

const brainRoutes = new Hono<Env>()

// Helper: SHA-256 hash for API Keys
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Middleware: Authenticate Agent API Key
async function authenticateAgentKey(c: any) {
  const authHeader = c.req.header('Authorization') || ''
  const apiKeyHeader = c.req.header('x-api-key') || ''
  
  let keyStr = ''
  if (apiKeyHeader) {
    keyStr = apiKeyHeader.trim()
  } else if (authHeader.startsWith('Bearer ')) {
    keyStr = authHeader.replace('Bearer ', '').trim()
  }

  if (!keyStr) {
    return { error: 'API key not provided', status: 401 }
  }

  const db = drizzle(c.env.DB, { schema })
  const keyHash = await hashKey(keyStr)

  const foundKey = await db.query.agent_api_keys.findFirst({
    where: and(
      eq(schema.agent_api_keys.key_hash, keyHash),
      eq(schema.agent_api_keys.status, 'active')
    )
  })

  if (!foundKey) {
    return { error: 'Invalid or revoked API key', status: 403 }
  }

  return { agentKey: foundKey }
}

// ── 1. Query Endpoint for AI Agents ─────────────────────────────
const querySchema = z.object({
  query: z.string().min(1).max(2000),
  limit: z.number().optional().default(5),
  include_raw_chunks: z.boolean().optional().default(true)
})

brainRoutes.post('/v1/brain/query', async (c) => {
  const auth = await authenticateAgentKey(c)
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status as any)
  }

  const { agentKey } = auth
  const body = await c.req.json().catch(() => ({}))
  const parsed = querySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400)
  }

  const { query, limit, include_raw_chunks } = parsed.data

  // Resolve allowed visibility tiers based on API key scope
  let allowedVisibility = ['public']
  if (agentKey.scope === 'internal_access') {
    allowedVisibility = ['public', 'internal']
  } else if (agentKey.scope === 'full_admin') {
    allowedVisibility = ['public', 'internal', 'restricted']
  }

  // 1. Generate query embedding
  const queryEmbedding = (await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [query]
  })) as { data: number[][] }

  // 2. Perform vector search in Vectorize
  const vectorResults = await c.env.VECTORIZE.query(queryEmbedding.data[0], {
    topK: limit,
    returnMetadata: 'all'
  })

  // Filter vector matches by visibility guardrail
  const matches = vectorResults.matches.filter((m) => {
    const meta = m.metadata as Record<string, any> | undefined
    const vis = meta?.visibility || 'public'
    return allowedVisibility.includes(vis)
  })

  const rawChunks = matches.map((m) => {
    const meta = (m.metadata as Record<string, any>) || {}
    return {
      id: m.id,
      score: m.score,
      title: meta.title || 'Sem título',
      collection: meta.collection || 'documentos',
      visibility: meta.visibility || 'public',
      content: meta.content || ''
    }
  })

  // Build context for LLM synthesis
  const contextText = rawChunks.map(c => `[${c.title}] (${c.visibility})\n${c.content}`).join('\n\n---\n\n')

  // 3. Synthesize answer with LLM
  let synthesizedAnswer = ''
  if (contextText.length > 0) {
    const synthResult = (await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        {
          role: 'system',
          content: `Você é a inteligência central do Cérebro ness. Responda à pergunta do agente de forma direta, precisa e baseada estritamente no contexto fornecido. Se o contexto for suficiente, resuma os pontos essenciais.`
        },
        {
          role: 'user',
          content: `PERGUNTA: ${query}\n\nCONTEXTO:\n${contextText}`
        }
      ]
    })) as { response?: string }

    synthesizedAnswer = synthResult.response || ''
  } else {
    synthesizedAnswer = 'Nenhuma informação correspondente foi encontrada no Cérebro com a sua permissão de acesso.'
  }

  // 4. Build Citations list
  const citations = rawChunks.map(r => ({
    title: r.title,
    collection: r.collection,
    visibility: r.visibility,
    relevance_score: r.score
  }))

  return c.json({
    query,
    scope_applied: agentKey.scope,
    allowed_visibility: allowedVisibility,
    answer: synthesizedAnswer,
    citations,
    raw_chunks: include_raw_chunks ? rawChunks : undefined
  })
})

// ── 2. Ingest Endpoint for AI Agents ─────────────────────────────
const ingestSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(50000),
  visibility: z.enum(['public', 'internal', 'restricted']).default('public'),
  category: z.string().optional().default('conhecimento')
})

brainRoutes.post('/v1/brain/ingest', async (c) => {
  const auth = await authenticateAgentKey(c)
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status as any)
  }

  const { agentKey } = auth
  const body = await c.req.json().catch(() => ({}))
  const parsed = ingestSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400)
  }

  const { title, content, visibility, category } = parsed.data
  const db = drizzle(c.env.DB, { schema })
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const r2Key = `brain/${agentKey.tenant_id}/${id}.txt`

  // Save content file to R2 storage
  await c.env.MEDIA.put(r2Key, content, {
    customMetadata: { title, visibility, agentKeyId: agentKey.id }
  })

  // Internal/Restricted content from regular agents requires admin approval
  const isAutoApproved = visibility === 'public' || agentKey.scope === 'full_admin'
  const approvalStatus = isAutoApproved ? 'approved' : 'pending_approval'
  const indexStatus = isAutoApproved ? 'indexed' : 'pending'

  await db.insert(schema.knowledge_base).values({
    id,
    tenant_id: agentKey.tenant_id,
    title,
    r2_key: r2Key,
    status: indexStatus,
    visibility,
    approval_status: approvalStatus,
    content_preview: content.slice(0, 300),
    source: `agent:${agentKey.name}`,
    chunk_count: 1,
    created_by: agentKey.name,
    created_at: now,
    updated_at: now
  })

  // If auto-approved, vectorization happens immediately
  if (isAutoApproved) {
    await upsertVector(c.env, id, { title, content, category, visibility }, 'knowledge_base')
  }

  return c.json({
    id,
    title,
    visibility,
    approval_status: approvalStatus,
    message: isAutoApproved
      ? 'Conhecimento ingerido e indexado com sucesso.'
      : 'Conhecimento gravado e enviado para a fila de aprovação humana no admin.'
  }, 201)
})

// ── 3. Admin API Key & Knowledge Approval Routes ─────────────────

// List Agent API Keys
brainRoutes.get('/admin/api-keys', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const keys = await db.query.agent_api_keys.findMany({
    orderBy: (keys, { desc }) => [desc(keys.created_at)]
  })

  const safeKeys = keys.map(k => ({
    id: k.id,
    name: k.name,
    prefix: k.key_prefix,
    scope: k.scope,
    status: k.status,
    created_by: k.created_by,
    created_at: k.created_at
  }))

  return c.json({ keys: safeKeys })
})

// Create Agent API Key
const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  scope: z.enum(['public_only', 'internal_access', 'full_admin']).default('public_only')
})

brainRoutes.post('/admin/api-keys', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = createKeySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400)
  }

  const { name, scope } = parsed.data
  const id = crypto.randomUUID()
  const randomBytes = new Uint8Array(16)
  crypto.getRandomValues(randomBytes)
  const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')

  const prefix = `ness_${scope.slice(0, 3)}`
  const rawSecret = `${prefix}_${randomHex}`
  const keyHash = await hashKey(rawSecret)
  const now = new Date().toISOString()

  const db = drizzle(c.env.DB, { schema })
  await db.insert(schema.agent_api_keys).values({
    id,
    tenant_id: 'ness',
    name,
    key_prefix: prefix,
    key_hash: keyHash,
    scope,
    status: 'active',
    created_by: 'admin',
    created_at: now
  })

  return c.json({
    id,
    name,
    scope,
    apiKey: rawSecret, // EXPOSED ONLY ONCE UPON CREATION
    message: 'Guarde esta chave em local seguro. Ela não poderá ser exibida novamente.'
  }, 201)
})

// Revoke Agent API Key
brainRoutes.delete('/admin/api-keys/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB, { schema })

  await db.update(schema.agent_api_keys)
    .set({ status: 'revoked' })
    .where(eq(schema.agent_api_keys.id, id))

  return c.json({ message: 'Chave de API revogada com sucesso.' })
})

// Pending Knowledge Ingestions for Approval
brainRoutes.get('/admin/knowledge/pending', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const pending = await db.query.knowledge_base.findMany({
    where: eq(schema.knowledge_base.approval_status, 'pending_approval'),
    orderBy: (kb, { desc }) => [desc(kb.created_at)]
  })

  return c.json({ pending })
})

// Approve Pending Knowledge
brainRoutes.post('/admin/knowledge/approve/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB, { schema })

  const item = await db.query.knowledge_base.findFirst({
    where: eq(schema.knowledge_base.id, id)
  })

  if (!item) {
    return c.json({ error: 'Item não encontrado' }, 404)
  }

  const now = new Date().toISOString()
  await db.update(schema.knowledge_base)
    .set({
      approval_status: 'approved',
      status: 'indexed',
      updated_at: now
    })
    .where(eq(schema.knowledge_base.id, id))

  // Index into Vectorize
  await upsertVector(c.env, id, {
    title: item.title,
    content: item.content_preview || item.title,
    visibility: item.visibility || 'public'
  }, 'knowledge_base')

  return c.json({ message: 'Conhecimento aprovado e indexado no Cérebro.' })
})

// Reject Pending Knowledge
brainRoutes.post('/admin/knowledge/reject/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB, { schema })

  await db.update(schema.knowledge_base)
    .set({
      approval_status: 'rejected',
      status: 'rejected',
      updated_at: new Date().toISOString()
    })
    .where(eq(schema.knowledge_base.id, id))

  return c.json({ message: 'Ingestão rejeitada.' })
})

export { brainRoutes }
