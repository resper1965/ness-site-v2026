import { EnvWithAI } from './ai/client'
import { upsertVector } from './vectorize-sync'

import { drizzle } from 'drizzle-orm/d1'
import { webhooks_targets, entries } from './db/schema'
import { eq } from 'drizzle-orm'

export interface QueueMessage {
  type: 'generate-draft' | 'audit-content' | 'translate' | 'vectorize-entry' | 'webhook-dispatch' | 'SCORE_CV' | 'SEND_NEWSLETTER'
  payload: any
}

export async function queueHandler(batch: MessageBatch<QueueMessage>, env: EnvWithAI & { DB: any; VECTORIZE: VectorizeIndex }) {
  for (const message of batch.messages) {
    try {
      console.log(`[Queue] Processing message type: ${message.body.type}`)
      
      switch (message.body.type) {
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
