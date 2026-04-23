/**
 * seed-vectors.ts — Ingestão dos dados de solutionsData no Cloudflare Vectorize
 *
 * Uso: npx wrangler dev --test-scheduled  (depois curl POST)
 *   OU: via rota administrativa /api/admin/seed-vectors
 *
 * Lê as soluções da ness., chunka textos, gera embeddings via Workers AI
 * (@cf/baai/bge-base-en-v1.5) e insere no índice canal-vectors.
 */

export async function seedVectors(env: any) {
  const results: string[] = []

  const dbRes = await env.DB.prepare(`
    SELECT e.id, e.data as payload, e.slug 
    FROM entries e 
    JOIN collections c ON e.collection_id = c.id 
    WHERE c.slug IN ('solutions', 'insights', 'cases')
  `).all()
  const rows = dbRes.results as any[]

  if (!rows || rows.length === 0) {
     return ["⚠️ Nenhum dado encontrado no banco para indexar."]
  }

  for (const row of rows) {
    const payload = JSON.parse(row.payload || '{}')
    const text = `${payload.title || row.slug}\n${payload.desc || payload.content || ''}`
    
    // Gerar embedding via Workers AI
    const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [text]
    }) as any

    const vector = {
      id: `db-${row.id}`,
      values: embedding.data[0],
      metadata: {
        title: payload.title || row.slug,
        content: text.slice(0, 1000) // metadata cap
      }
    }

    await env.VECTORIZE.upsert([vector])
    results.push(`✅ db-${row.id} (${payload.title || row.slug})`)
  }

  return results
}
