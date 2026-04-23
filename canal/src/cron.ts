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

    // ── Compliance Automation (Ouvidoria SLA LGPD) ──────────────────
    // Varredura de tickets de denúncia/titulares próximos ao vencimento legal
    const formsSLA = await env.DB.prepare(
      `SELECT id FROM forms WHERE created_at <= datetime('now', '-10 days')`
    ).all().catch(() => ({ results: [] }))

    if (formsSLA.results && formsSLA.results.length > 0 && env.SLACK_WEBHOOK_URL) {
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
