/**
 * Canal CMS — Admin Routes Module
 * 
 * Endpoints protegidos para gerenciamento administrativo.
 * Todos requerem session ativa com role === 'admin'.
 * Migrated to Drizzle ORM.
 */

import { Hono, Context } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, sql, like, desc, and } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { Bindings } from '../index'

type Variables = {
  tenantId?: string;
  session?: { user: { role: string; email: string }; session: { activeOrganizationId?: string } };
}

type AdminEnv = { Bindings: Bindings; Variables: Variables }

function assertAdmin(c: Context<AdminEnv>): boolean {
  const session = c.get('session')
  return session?.user?.role === 'admin'
}

function getDb(c: Context<AdminEnv>) {
  return drizzle(c.env.DB, { schema })
}

const admin = new Hono<AdminEnv>()

// ── Organizations CRUD ──────────────────────────────────────────
admin.get('/organizations', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const db = getDb(c)
  const results = await db.select({
    ...schema.organization,
    memberCount: sql<number>`(SELECT COUNT(*) FROM "member" m WHERE m.organizationId = ${schema.organization.id})`,
  }).from(schema.organization).orderBy(desc(schema.organization.createdAt))
  return c.json(results)
})

admin.patch('/organizations/:id', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const id = c.req.param('id')
  const body = await c.req.json()
  const db = getDb(c)
  await db.update(schema.organization)
    .set({ metadata: JSON.stringify(body.metadata || {}) })
    .where(eq(schema.organization.id, id))
  return c.json({ success: true })
})

admin.delete('/organizations/:id', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const id = c.req.param('id')
  const db = getDb(c)
  await db.delete(schema.member).where(eq(schema.member.organizationId, id))
  await db.delete(schema.invitation).where(eq(schema.invitation.organizationId, id))
  await db.delete(schema.organization).where(eq(schema.organization.id, id))
  return c.json({ success: true })
})

// ── API Keys ────────────────────────────────────────────────────
admin.get('/api-keys/:orgId', async (c) => {
  const orgId = c.req.param('orgId')
  const db = getDb(c)
  const results = await db.select({
    id: schema.apikey.id,
    name: schema.apikey.name,
    createdAt: schema.apikey.createdAt,
    prefix: schema.apikey.prefix,
  }).from(schema.apikey)
    .where(like(schema.apikey.metadata, `%"orgId":"${orgId}"%`))
    .orderBy(desc(schema.apikey.createdAt))
  return c.json(results)
})

admin.delete('/api-keys/:id', async (c) => {
  const id = c.req.param('id')
  const db = getDb(c)
  await db.delete(schema.apikey).where(eq(schema.apikey.id, id))
  return c.json({ success: true })
})

// ── Forms, Chats, Leads ─────────────────────────────────────────
admin.get('/forms', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const db = getDb(c)
  const results = await db.select().from(schema.forms)
    .orderBy(desc(schema.forms.created_at)).limit(50)
  return c.json(results)
})

admin.get('/chats', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const db = getDb(c)
  const results = await db.select().from(schema.chats)
    .orderBy(desc(schema.chats.updated_at)).limit(50)
  return c.json(results)
})

admin.get('/leads', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const status = c.req.query('status')
  const db = getDb(c)
  const q = db.select().from(schema.leads).orderBy(desc(schema.leads.created_at)).limit(100)
  const results = status
    ? await q.where(eq(schema.leads.status, status))
    : await q
  return c.json(results)
})

admin.patch('/leads/:id', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const id = parseInt(c.req.param('id'), 10)
  const { status } = await c.req.json() as { status: string }
  const db = getDb(c)
  await db.update(schema.leads)
    .set({ status, updated_at: new Date().toISOString() })
    .where(eq(schema.leads.id, id))
  return c.json({ success: true })
})

admin.delete('/leads/:id', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const id = parseInt(c.req.param('id'), 10)
  const db = getDb(c)
  await db.delete(schema.leads).where(eq(schema.leads.id, id))
  return c.json({ success: true })
})

// ── Dashboard Stats & Activity ──────────────────────────────────
admin.get('/stats', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)

  const [leadsCount, formsCount, chatsCount, published, newLeads, newForms, posts, cases, jobs, users] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as c FROM leads').first<{c:number}>(),
    c.env.DB.prepare('SELECT COUNT(*) as c FROM forms').first<{c:number}>(),
    c.env.DB.prepare('SELECT COUNT(*) as c FROM chats').first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM entries WHERE status='published'").first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM leads WHERE status='new'").first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM forms WHERE status='new'").first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM entries e JOIN collections col ON e.collection_id = col.id WHERE col.slug = 'insights'").first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM entries e JOIN collections col ON e.collection_id = col.id WHERE col.slug = 'cases'").first<{c:number}>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM entries e JOIN collections col ON e.collection_id = col.id WHERE col.slug = 'jobs'").first<{c:number}>(),
    c.env.DB.prepare('SELECT COUNT(*) as c FROM user').first<{c:number}>(),
  ])

  const { results: weeklyLeads } = await c.env.DB.prepare(
    `SELECT DATE(created_at) as day, COUNT(*) as count 
     FROM leads WHERE created_at >= DATE('now', '-7 days') 
     GROUP BY DATE(created_at) ORDER BY day ASC`
  ).all()

  return c.json({
    totalLeads: leadsCount?.c || 0,
    newLeads: newLeads?.c || 0,
    totalForms: formsCount?.c || 0,
    newForms: newForms?.c || 0,
    totalChats: chatsCount?.c || 0,
    publishedEntries: published?.c || 0,
    totalPosts: posts?.c || 0,
    totalCases: cases?.c || 0,
    totalJobs: jobs?.c || 0,
    totalUsers: users?.c || 0,
    weeklyLeads: weeklyLeads || [],
  })
})

admin.get('/activity', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  // Complex UNION ALL — keep as raw SQL (semantic-preserving exception)
  const { results } = await c.env.DB.prepare(`
    SELECT 'lead' as type, name as title, source, status, created_at FROM leads
    UNION ALL
    SELECT 'form' as type, source as title, source, status, created_at FROM forms
    UNION ALL
    SELECT 'chat' as type, session_id as title, 'chatbot' as source, 'active' as status, updated_at as created_at FROM chats
    ORDER BY created_at DESC LIMIT 15
  `).all()
  return c.json(results || [])
})

// ── Newsletter Management ───────────────────────────────────────
admin.get('/newsletter-subscribers', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const db = getDb(c)
  const results = await db.select().from(schema.newsletter)
    .orderBy(desc(schema.newsletter.created_at))
  return c.json(results)
})

admin.post('/newsletter-subscribers', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const { email } = await c.req.json() as { email: string }
  if (!email || !email.includes('@')) return c.json({ error: 'Invalid email' }, 400)

  const db = getDb(c)
  const existing = await db.select({ id: schema.newsletter.id })
    .from(schema.newsletter)
    .where(eq(schema.newsletter.email, email))
    .limit(1)
  if (existing.length) return c.json({ success: true, id: existing[0].id })

  const result = await c.env.DB.prepare('INSERT INTO newsletter (email) VALUES (?)').bind(email).run()
  return c.json({ success: true, id: result.meta?.last_row_id })
})

admin.delete('/newsletter-subscribers/:id', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const id = parseInt(c.req.param('id'), 10)
  const db = getDb(c)
  await db.delete(schema.newsletter).where(eq(schema.newsletter.id, id))
  return c.json({ success: true })
})

admin.post('/newsletters/send', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)

  const { subject, preheader, body } = await c.req.json() as { subject: string; preheader: string; body: string }
  if (!subject || !body) return c.json({ error: 'Subject and body required' }, 400)

  const db = getDb(c)
  const subs = await db.select({ email: schema.newsletter.email }).from(schema.newsletter)
  if (!subs.length) return c.json({ error: 'No subscribers' }, 400)

  const emails = subs.map(s => s.email).filter(Boolean)

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#0A0A0A;padding:32px 40px;">
        <span style="font-family:Montserrat,sans-serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">ness<span style="color:#00ADE8;">.</span></span>
      </div>
      <div style="padding:40px;">
        ${preheader ? `<p style="font-size:0;color:transparent;display:none;">${preheader}</p>` : ''}
        <h1 style="font-size:22px;color:#111;margin:0 0 24px;">${subject}</h1>
        <div style="font-size:14px;line-height:1.8;color:#333;white-space:pre-wrap;">${body.replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</div>
      </div>
      <div style="background:#F8F9FA;padding:20px 40px;border-top:1px solid #eee;">
        <p style="font-size:11px;color:#999;margin:0;">ness. · canal.ness.com.br</p>
      </div>
    </div>
  `

  if (!c.env.RESEND_API_KEY) return c.json({ error: 'Resend API key not configured' }, 500)

  let sentCount = 0
  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'ness. <newsletter@canal.ness.com.br>', to: batch, subject, html }),
      })
      sentCount += batch.length
    } catch (err) { console.error('[newsletter] batch send error:', err) }
  }

  return c.json({ success: true, sent: sentCount })
})

// ── AI Settings (KV-backed) ────────────────────────────────────
admin.get('/ai-settings', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const raw = await c.env.CANAL_KV.get('ai-config')
  if (raw) return c.json(JSON.parse(raw))
  return c.json({ enabled: true, tone: 'executivo', customPrompt: '' })
})

admin.put('/ai-settings', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const config = await c.req.json()
  await c.env.CANAL_KV.put('ai-config', JSON.stringify(config))
  return c.json({ success: true })
})

admin.get('/ai-stats', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const db = getDb(c)
  const [totalChats, totalLeads, recentChats] = await Promise.all([
    db.select({ c: sql<number>`COUNT(*)` }).from(schema.chats),
    db.select({ c: sql<number>`COUNT(*)` }).from(schema.leads).where(eq(schema.leads.source, 'chatbot')),
    db.select({ c: sql<number>`COUNT(*)` }).from(schema.chats)
      .where(sql`${schema.chats.updated_at} >= DATE('now', '-7 days')`),
  ])
  return c.json({
    totalChats: totalChats[0]?.c || 0,
    totalLeads: totalLeads[0]?.c || 0,
    recentChats: recentChats[0]?.c || 0,
  })
})

// ── Communications (unified inbox) ─────────────────────────────
admin.get('/communications', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  // Complex UNION ALL — keep as raw SQL
  const { results } = await c.env.DB.prepare(`
    SELECT 'form' as type, id, payload as data, source as title, source, status, created_at FROM forms
    UNION ALL
    SELECT 'lead' as type, id, json_object('name',name,'contact',contact,'intent',intent,'urgency',urgency) as data, name as title, source, status, created_at FROM leads
    ORDER BY created_at DESC LIMIT 100
  `).all()
  return c.json(results || [])
})

admin.post('/communications/forward', async (c) => {
  if (!assertAdmin(c)) return c.json({ error: 'Forbidden' }, 403)
  const session = c.get('session')
  const { messageId, messageType, to } = await c.req.json() as { messageId: number; messageType: string; to: string }
  if (!to || !to.includes('@')) return c.json({ error: 'Invalid email' }, 400)

  const db = getDb(c)
  let content = ''
  let subject = ''
  if (messageType === 'form') {
    const rows = await db.select().from(schema.forms).where(eq(schema.forms.id, messageId)).limit(1)
    if (rows[0]) { content = JSON.stringify(rows[0], null, 2); subject = `[Canal] Formulário #${messageId}` }
  } else if (messageType === 'lead') {
    const rows = await db.select().from(schema.leads).where(eq(schema.leads.id, messageId)).limit(1)
    if (rows[0]) { content = JSON.stringify(rows[0], null, 2); subject = `[Canal] Lead: ${rows[0].name}` }
  }

  if (!content) return c.json({ error: 'Message not found' }, 404)
  if (!c.env.RESEND_API_KEY) return c.json({ error: 'Resend not configured' }, 500)

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Canal CMS <canal@canal.ness.com.br>',
      to: [to],
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;">${subject}</h2>
        <p style="font-size:12px;color:#888;">Encaminhado por ${session?.user?.email} via Canal CMS</p>
        <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:12px;overflow-x:auto;">${content.replace(/</g,'&lt;')}</pre>
      </div>`,
    }),
  })

  return c.json({ success: true })
})

export { admin }
