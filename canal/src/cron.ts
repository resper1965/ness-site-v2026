export async function cronHandler(event: ScheduledEvent, env: any) {
  console.log(`[Cron] Triggered at ${event.scheduledTime}`)
  
  try {
    // Busca até 50 posts 'published' para auditoria periódica.
    // Lógica simplificada: na vida real, basear em updatedAt < X meses
    const postsToAudit = await env.DB.prepare(
      `SELECT id, slug FROM entries WHERE status = 'published' LIMIT 50`
    ).all()
    
    if (postsToAudit.results && postsToAudit.results.length > 0) {
      console.log(`[Cron] Enqueueing ${postsToAudit.results.length} entries for audit.`)
      
      for (const entry of postsToAudit.results) {
        await env.QUEUE.send({
          type: 'audit-content',
          payload: { entryId: entry.id }
        })
      }
    }
  } catch (err) {
    console.error('[Cron] Error during scheduled execution:', err)
  }
}
