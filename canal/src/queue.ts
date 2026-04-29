import { EnvWithAI } from './ai/client'
import { upsertVector } from './vectorize-sync'

import { drizzle } from 'drizzle-orm/d1'
import { webhooks_targets, entries, knowledge_base } from './db/schema'
import * as schema from './db/schema'
import { eq } from 'drizzle-orm'

export interface QueueMessage {
  type: 'generate-draft' | 'audit-content' | 'translate' | 'vectorize-entry' | 'webhook-dispatch' | 'SCORE_CV' | 'SEND_NEWSLETTER' | 'SOCIAL_POST_DISPATCH' | 'vectorize-document'
  payload: any
}

export async function queueHandler(batch: MessageBatch<QueueMessage>, env: EnvWithAI & { DB: any; VECTORIZE: VectorizeIndex; MEDIA: R2Bucket }) {
  for (const message of batch.messages) {
    try {
      console.log(`[Queue] Processing message type: ${message.body.type}`)
      
      switch (message.body.type) {
        case 'vectorize-document': {
          const { id, tenantId, r2_key } = message.body.payload
          console.log(`[Queue] Vectorizing document ${id} [${tenantId}]`)
          try {
            // 1. Fetch text from R2
            const r2Obj = await env.MEDIA.get(r2_key)
            if (!r2Obj) throw new Error('File not found in R2: ' + r2_key)
            const textContent = await r2Obj.text()

            // 2. Chunking (naive 500 words split for MVP)
            const words = textContent.split(/\s+/)
            const chunks: string[] = []
            let currentChunk = []
            for (const word of words) {
              currentChunk.push(word)
              if (currentChunk.length >= 500) {
                chunks.push(currentChunk.join(' '))
                currentChunk = []
              }
            }
            if (currentChunk.length > 0) chunks.push(currentChunk.join(' '))

            // 3. Embed & Insert into Vectorize
            if (!env.VECTORIZE) throw new Error('Vectorize binding not found')
            
            const aiModel = '@cf/baai/bge-base-en-v1.5'
            const embeddingsObj = await env.AI.run(aiModel, {
              text: chunks
            })
            // data is Array of arrays
            const embeddings = (embeddingsObj as any).data
            
            const vectors = chunks.map((chunk, index) => ({
              id: `${id}-chunk-${index}`,
              values: embeddings[index],
              namespace: tenantId, // Using tenantId as namespace for strict isolation!
              metadata: {
                docId: id,
                tenantId: tenantId,
                text_chunk: chunk.substring(0, 5000) // Ensure below limits (Vectorize metadata limit)
              }
            }))

            await env.VECTORIZE.insert(vectors)
            
            // 4. Mark D1 as indexed
            const db = drizzle(env.DB)
            await db.update(schema.knowledge_base)
              .set({ status: 'indexed', chunk_count: chunks.length, updated_at: new Date().toISOString() })
              .where(eq(schema.knowledge_base.id, id))
              
            console.log(`[Queue] Document ${id} indexed with ${chunks.length} chunks.`)
          } catch (e) {
            console.error('[Queue] Vectorize document failed:', e)
            const db = drizzle(env.DB)
            await db.update(schema.knowledge_base)
              .set({ status: 'error', updated_at: new Date().toISOString() })
              .where(eq(schema.knowledge_base.id, id))
          }
          break
        }
        case 'vectorize-entry': {
          const { entryId, data, collectionSlug } = message.body.payload
          await upsertVector(env, entryId, data, collectionSlug)
          console.log(`[Queue] Vectorized entry-${entryId} [${collectionSlug}]`)
          break
        }
        case 'generate-draft':
          console.log('Generating draft for:', message.body.payload.topic)
          break;
        case 'translate': {
          const { entryId, data, targetLocale, tenantId } = message.body.payload
          console.log(`[Queue] Translating entry ${entryId} to ${targetLocale}`)
          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
              messages: [
                { role: 'system', content: `Você é um tradutor do Aegis. Formate a saída APENAS como JSON válido. Traduza o conteúdo do objeto abaixo para o idioma ${targetLocale}.` },
                { role: 'user', content: JSON.stringify(data) }
              ]
            })

            // Aqui você processaria o aiResponse.response, extrairia o JSON limpo e inseriria como nova entrada
            const jsonText = String(aiResponse.response).replace(/```json/g, '').replace(/```/g, '').trim()
            let parsedData = data
            try {
              parsedData = JSON.parse(jsonText)
            } catch (jsonErr) {
              console.warn('[Queue] Falha no parse do LLM JSON. Salvando raw string...', jsonText)
            }

            console.log(`[Queue] Translation ready. Inserting into D1...`)
            
            const db = drizzle(env.DB)
            const [originalRow] = await db.select().from(entries).where(eq(entries.id, entryId)).limit(1)

            if (originalRow) {
              const newId = crypto.randomUUID()
              await db.insert(entries).values({
                id: newId,
                tenant_id: originalRow.tenant_id,
                collection_id: originalRow.collection_id,
                data: typeof parsedData === 'string' ? parsedData : JSON.stringify(parsedData), // Save the translated JSON
                slug: originalRow.slug,
                locale: targetLocale,
                status: 'draft', // Saved as draft for review
                created_by: 'ai-worker',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              console.log(`[Queue] Saved Entry-${newId} for locale: ${targetLocale}`)
            }
          } catch (e) {
            console.error('[Queue] Translate falhou:', e)
          }
          break;
        }
        case 'SCORE_CV': {
          const { applicantId, fileKey } = message.body.payload;
          console.log(`[Queue] Scoring CV for applicant ${applicantId}`);
          
          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
              messages: [
                { role: 'system', content: 'You are a technical recruiter AI. Analyze this candidate application and return a strict JSON with "score" (0-100) and "summary" (short reason).' },
                { role: 'user', content: 'Attached resume: ' + fileKey }
              ]
            } as any);
            
            const jsonText = String(aiResponse.response).replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonText);
            
            await env.DB.prepare('UPDATE applicants SET ai_score = ?, ai_summary = ? WHERE id = ?').bind(result.score || 50, result.summary || 'Summary not provided', applicantId).run();
            console.log(`[Queue] Scored ${applicantId}: ${result.score}`);
          } catch(e) {
            console.error('[Queue] Scoring CV failed:', e);
          }
          break;
        }
        case 'SOCIAL_POST_DISPATCH': {
          const { postId, platform } = message.body.payload;
          console.log(`[Queue] Dispatching social post ${postId} to platform ${platform}`);
          // Simulate actual publishing delay and logic
          try {
            await new Promise(r => setTimeout(r, 1000));
            await env.DB.prepare('UPDATE social_posts SET status = ? WHERE id = ?').bind('published', postId).run();
            console.log(`[Queue] Successfully published post ${postId} to ${platform}`);
          } catch(e) {
            console.error('[Queue] Dispatching post failed:', e);
          }
          break;
        }
        case 'audit-content':
          console.log('Auditing content ID:', message.body.payload.entryId)
          break;
        case 'webhook-dispatch': {
          const { event, collectionSlug, entryId, tenantId, payloadData } = message.body.payload
          const db = drizzle(env.DB)
          const allTargets = await db.select().from(webhooks_targets).all()
          
          for (const target of allTargets) {
            if (target.active && target.events.includes(event) && (!target.tenant_id || target.tenant_id === tenantId)) {
              try {
                await fetch(target.url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(target.secret ? { 'x-webhook-secret': target.secret } : {})
                  },
                  body: JSON.stringify({
                    event,
                    collection: collectionSlug,
                    entry_id: entryId,
                    data: payloadData,
                    timestamp: new Date().toISOString()
                  })
                })
                console.log(`[Queue] Webhook fired to ${target.url}`)
              } catch (e) {
                console.error(`[Queue] Failed to fire webhook to ${target.url}:`, e)
              }
            }
          }
          break;
        }
        default:
          console.warn('Unknown message type:', message.body.type)
      }
      
      message.ack()
    } catch (err) {
      console.error(`[Queue] Error processing message (attempt ${message.attempts}):`, err)
      message.retry()
    }
  }
}
