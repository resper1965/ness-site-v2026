import { EnvWithAI } from './ai/client'
import { upsertVector } from './vectorize-sync'

export interface QueueMessage {
  type: 'generate-draft' | 'audit-content' | 'translate' | 'vectorize-entry'
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
        case 'audit-content':
          console.log('Auditing content ID:', message.body.payload.entryId)
          break;
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
