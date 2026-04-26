import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { entries, forms } from './db/schema'

export async function cronHandler(event: ScheduledEvent, env: any) {
  console.log(`[Cron] Triggered at ${event.scheduledTime}`)
  const db = drizzle(env.DB)

  try {
    // Audit published entries periodically
    const postsToAudit = await db.select({ id: entries.id, slug: entries.slug })
      .from(entries)
      .where(eq(entries.status, 'published'))
      .limit(50)

    if (postsToAudit.length > 0) {
      console.log(`[Cron] Enqueueing ${postsToAudit.length} entries for audit.`)
      for (const entry of postsToAudit) {
        await env.QUEUE.send({ type: 'audit-content', payload: { entryId: entry.id } })
      }
    }

    // Compliance SLA — forms older than 10 days
    const formsSLA = await env.DB.prepare(
      `SELECT id FROM forms WHERE created_at <= datetime('now', '-10 days')`
    ).all().catch(() => ({ results: [] }))

    if (formsSLA.results?.length > 0 && env.SLACK_WEBHOOK_URL) {
      console.log(`[Cron] SLA Compliance Alert: ${formsSLA.results.length} forms pending`)
      await fetch(env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `⚖️ *ALERTA COMPLIANCE (SLA LGPD)*\nExistem ${formsSLA.results.length} solicitações/denúncias no sistema que superaram 10 dias de ociosidade. Ação do DPO requerida imediatamente.`
        })
      }).catch(() => {})
    }

  } catch (err) {
    console.error('[Cron] Error during scheduled execution:', err)
  }
}
