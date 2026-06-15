import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Env = {
  Bindings: {
    CANAL_WORKER_URL: string;
  };
};

const app = new Hono<Env>().basePath('/api');

app.get('/insights', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const response = await fetch(`${canal}/api/insights?lang=${lang}`);
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

app.get('/insights/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  const slug = c.req.param('slug');
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const response = await fetch(`${canal}/api/insights/${slug}?lang=${lang}`);
    if (!response.ok) return c.json({ error: 'Not found' }, response.status as 404 | 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to fetch insight' }, 500);
  }
});

app.get('/jobs', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const response = await fetch(`${canal}/api/jobs?lang=${lang}`);
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

app.get('/cases', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const response = await fetch(`${canal}/api/cases?lang=${lang}`);
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to fetch cases' }, 500);
  }
});

app.get('/cases/:slug', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  const slug = c.req.param('slug');
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const response = await fetch(`${canal}/api/cases/${slug}?lang=${lang}`);
    if (!response.ok) return c.json({ error: 'Not found' }, response.status as 404 | 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to fetch case' }, 500);
  }
});

app.post('/submit-form', async (c) => {
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const body = await c.req.json();
    const response = await fetch(`${canal}/api/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502);
    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: 'Failed to submit form' }, 500)
  }
})

app.post('/whistleblower', async (c) => {
  const canal = c.env.CANAL_WORKER_URL
  try {
    const body = await c.req.json()
    const response = await fetch(`${canal}/api/whistleblower`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502)
    const data = await response.json()
    return c.json(data)
  } catch {
    return c.json({ error: 'Failed to submit whistleblower report' }, 500)
  }
})

app.post('/automation/apply/:job_id', async (c) => {
  const job_id = c.req.param('job_id')
  const canal = c.env.CANAL_WORKER_URL
  try {
    const response = await fetch(`${canal}/api/automation/apply/${job_id}`, {
      method: 'POST',
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    })
    if (!response.ok) return c.json({ error: 'Canal unavailable' }, 502)
    const data = await response.json()
    return c.json(data)
  } catch {
    return c.json({ error: 'Failed to submit application' }, 500)
  }
})

app.post('/chat', async (c) => {
  const canal = c.env.CANAL_WORKER_URL;
  try {
    const body = await c.req.json();
    const upstream = await fetch(`${canal}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      const msg = 'serviço temporariamente indisponível.';
      return new Response(msg, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    // Pipe the text stream from the canal directly to the client
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    const msg = 'não foi possível conectar ao assistente. tente novamente em instantes.';
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
});

export const onRequest = handle(app);
