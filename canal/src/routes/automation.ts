import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { 
  newsletter, applicants, social_posts, comunicados, brand_assets 
} from '../db/schema';
import { nanoid } from 'nanoid';
import { Bindings } from '../index';

export const automationRoute = new Hono<{ Bindings: Bindings }>();

// 1. Newsletter Subs (Public)
const subscribeSchema = z.object({
  email: z.string().email(),
  tenant_id: z.string().optional()
});

automationRoute.post('/newsletter/subscribe', zValidator('json', subscribeSchema), async (c) => {
  const { email, tenant_id } = c.req.valid('json');
  const db = drizzle(c.env.DB);
  
  // Create token
  const token = nanoid(32);
  const t_id = tenant_id || 'default';
  
  try {
    await db.insert(newsletter).values({
      email,
      tenant_id: t_id,
      token,
      confirmed_at: null,
      created_at: new Date().toISOString()
    });

    // TODO: Trigger Email Delivery (Double opt-in link) via Queue or Resend
    // For now we just return success
    
    return c.json({ success: true, message: 'Confirme seu email na sua caixa postal.' }, 201);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email já cadastrado.' }, 400);
    }
    return c.json({ error: 'Internal error' }, 500);
  }
});

// 2. Newsletter Verify (Public)
automationRoute.get('/newsletter/verify', async (c) => {
  const token = c.req.query('token');
  if (!token) return c.json({ error: 'Token missing' }, 400);
  
  const db = drizzle(c.env.DB);
  const result = await db.update(newsletter)
    .set({ confirmed_at: new Date().toISOString() })
    .where(eq(newsletter.token, token))
    .returning();
    
  if (result.length === 0) {
    return c.json({ error: 'Token inválido ou não encontrado' }, 404);
  }
  
  return c.text('Inscrição confirmada com sucesso! Você já pode fechar esta janela.');
});

// 3. Unsubscribe (Public)
automationRoute.get('/newsletter/unsubscribe', async (c) => {
  const token = c.req.query('token');
  if (!token) return c.json({ error: 'Token missing' }, 400);
  
  const db = drizzle(c.env.DB);
  await db.delete(newsletter).where(eq(newsletter.token, token));
  
  return c.text('Inscrição cancelada com sucesso.');
});

// 4. Job Applications (Public)
// Requires a multipart form containing name, email, linkedin_url, and file (PDF)
automationRoute.post('/apply/:job_id', async (c) => {
  const job_id = c.req.param('job_id');
  const body = await c.req.parseBody();
  const name = body['name'] as string;
  const email = body['email'] as string;
  const linkedin_url = body['linkedin_url'] as string;
  const file = body['file'] as File;
  
  if (!name || !email || !file) {
    return c.json({ error: 'Name, email and file are required' }, 400);
  }
  
  const id = nanoid(12);
  const fileKey = `resumes/${job_id}/${id}-${file.name}`;
  
  // Upload to R2
  await c.env.MEDIA.put(fileKey, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });
  
  const db = drizzle(c.env.DB);
  await db.insert(applicants).values({
    id,
    tenant_id: 'default',
    job_id,
    name,
    email,
    linkedin_url,
    resume_r2_key: fileKey,
    status: 'new',
    created_at: new Date().toISOString()
  });
  
  // Try sending to Queue for Async AI Scoring if QUEUE binding exists, else silently continue
  try {
    if (c.env.QUEUE) {
      await c.env.QUEUE.send({ type: 'SCORE_CV', payload: { applicantId: id, fileKey: fileKey } });
    }
  } catch (e) {
    console.error("Queue send failed:", e);
  }

  return c.json({ success: true, applicant_id: id }, 201);
});

// 5. Admin - Social Posts & Newsletter (Requires Authentication)
// (Usually we check for Admin Role using middleware, but we'll mount this securely in index.ts)
automationRoute.get('/social', async (c) => {
  const db = drizzle(c.env.DB);
  const q = await db.select().from(social_posts).all();
  return c.json({ data: q });
});

automationRoute.post('/social', zValidator('json', z.object({
  id: z.string().optional(),
  platform: z.string(),
  content: z.string(),
  scheduled_at: z.string().optional()
})), async (c) => {
  const body = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const id = body.id || nanoid();
  
  await db.insert(social_posts).values({
    id,
    tenant_id: 'default',
    platform: body.platform,
    content: body.content,
    scheduled_at: body.scheduled_at,
    status: body.scheduled_at ? 'scheduled' : 'draft',
    created_at: new Date().toISOString()
  });
  return c.json({ success: true, id });
});

automationRoute.get('/comunicados', async (c) => {
  const db = drizzle(c.env.DB);
  const q = await db.select().from(comunicados).all();
  return c.json({ data: q });
});

export default automationRoute;
