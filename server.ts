import express from "express";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CANAL_WORKER_URL controla o modo de operação:
 *
 *   Não definida (padrão dev) → mocks locais — sem tocar produção
 *   Definida                  → proxy real para a URL configurada
 *
 * Para usar o Canal real em dev (consciente):
 *   CANAL_WORKER_URL=https://canal.ness.com.br npm run dev
 *
 * Para staging:
 *   CANAL_WORKER_URL=https://canal-staging.ness.com.br npm run dev
 */
const CANAL_URL = process.env.CANAL_WORKER_URL?.trim() || '';
const USE_MOCKS = !CANAL_URL;

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const app = express();
    app.use(express.json());
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    if (USE_MOCKS) {
      // ── MODO MOCK — sem chamadas ao Canal de produção ──────────
      const { registerMockHandlers } = await import('./src/mocks/handlers.js');
      registerMockHandlers(app);
    } else {
      // ── MODO PROXY — repassa para o Canal real ─────────────────
      console.log(`\n✅  Proxy Canal ativo → ${CANAL_URL}\n`);

      const proxyTo = async (
        upstreamPath: string,
        req: express.Request,
        res: express.Response
      ) => {
        try {
          const url = `${CANAL_URL}${upstreamPath}`;
          const upstream = await fetch(url, {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method)
              ? JSON.stringify(req.body)
              : undefined,
          });
          if (!upstream.ok) throw new Error(`Canal ${upstream.status}`);
          const data = await upstream.json();
          res.json(data);
        } catch (err) {
          console.error(`[proxy] ${upstreamPath}`, err);
          res.status(502).json({ error: 'Canal unavailable' });
        }
      };

      const proxyMultipartTo = async (
        upstreamPath: string,
        req: express.Request,
        res: express.Response
      ) => {
        try {
          const url = `${CANAL_URL}${upstreamPath}`;
          const headers: Record<string, string> = {};
          if (req.headers['content-type']) {
            headers['content-type'] = req.headers['content-type'] as string;
          }
          const upstream = await fetch(url, {
            method: req.method,
            headers,
            body: req as any,
          });
          if (!upstream.ok) throw new Error(`Canal ${upstream.status}`);
          const data = await upstream.json();
          res.json(data);
        } catch (err) {
          console.error(`[proxy] ${upstreamPath}`, err);
          res.status(502).json({ error: 'Canal unavailable' });
        }
      };

      const streamTo = async (
        upstreamPath: string,
        req: express.Request,
        res: express.Response
      ) => {
        try {
          const upstream = await fetch(`${CANAL_URL}${upstreamPath}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(req.headers['x-session-id']
                ? { 'x-session-id': req.headers['x-session-id'] as string }
                : {}),
            },
            body: JSON.stringify(req.body),
          });
          if (!upstream.ok) throw new Error('Canal unreachable');
          const contentType = upstream.headers.get('content-type');
          if (contentType) res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Transfer-Encoding', 'chunked');
          if (upstream.body) {
            const reader = upstream.body.getReader();
            const push = async () => {
              const { done, value } = await reader.read();
              if (done) { res.end(); return; }
              res.write(value);
              await push();
            };
            await push();
          } else {
            res.end(await upstream.text());
          }
        } catch {
          res.status(502).json({ reply: 'serviço temporariamente indisponível.' });
        }
      };

      app.get('/api/insights', (req, res) => proxyTo(`/api/insights?lang=${req.query.lang || 'pt'}`, req, res));
      app.get('/api/insights/:slug', (req, res) => proxyTo(`/api/insights/${req.params.slug}?lang=${req.query.lang || 'pt'}`, req, res));
      app.get('/api/cases', (req, res) => proxyTo(`/api/cases?lang=${req.query.lang || 'pt'}`, req, res));
      app.get('/api/cases/:slug', (req, res) => proxyTo(`/api/cases/${req.params.slug}?lang=${req.query.lang || 'pt'}`, req, res));
      app.get('/api/jobs', (req, res) => proxyTo(`/api/jobs?lang=${req.query.lang || 'pt'}`, req, res));
      app.get('/api/chatbot-config', (req, res) => proxyTo(`/api/chatbot-config?tenant=${req.query.tenant || 'ness'}`, req, res));
      app.post('/api/chat', (req, res) => streamTo('/api/chat', req, res));
      app.post('/api/submit-form', (req, res) => proxyTo('/api/forms', req, res));
      app.post('/api/newsletter', (req, res) => proxyTo('/api/newsletter', req, res));
      app.post('/api/whistleblower', (req, res) => proxyTo('/api/whistleblower', req, res));
      app.get('/api/automation/github/repos', (req, res) => proxyTo('/api/automation/github/repos', req, res));
      app.post('/api/automation/apply/:job_id', (req, res) => proxyMultipartTo(`/api/automation/apply/${req.params.job_id}`, req, res));
    }

    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      const mode = USE_MOCKS
        ? `⚠️  MODO MOCK (sem Canal) — dados locais de desenvolvimento`
        : `✅  MODO PROXY → ${CANAL_URL}`;
      console.log(`\n🚀  Dev server: http://localhost:${PORT}`);
      console.log(`    ${mode}\n`);
    });

  } else {
    // ── PRODUÇÃO ────────────────────────────────────────────────
    // Em produção, o Canal é acessado via CF Pages Functions (functions/api/[[route]].ts)
    // CANAL_WORKER_URL é obrigatória aqui
    if (!CANAL_URL) {
      console.error('❌  CANAL_WORKER_URL não definida em produção. Defina no painel do Cloudflare Pages.');
      process.exit(1);
    }

    const app = new Hono();

    const proxyHono = async (path: string, c: any) => {
      try {
        const response = await fetch(`${CANAL_URL}${path}`);
        const data = await response.json();
        return c.json(data);
      } catch {
        return c.json({ error: 'Failed to fetch' }, 500);
      }
    };

    app.get("/api/insights", (c) => proxyHono(`/api/insights?lang=${c.req.query('lang') || 'pt'}`, c));
    app.get("/api/insights/:slug", (c) => proxyHono(`/api/insights/${c.req.param('slug')}?lang=${c.req.query('lang') || 'pt'}`, c));
    app.get("/api/jobs", (c) => proxyHono(`/api/jobs?lang=${c.req.query('lang') || 'pt'}`, c));
    app.get("/api/cases", (c) => proxyHono(`/api/cases?lang=${c.req.query('lang') || 'pt'}`, c));
    app.get("/api/cases/:slug", (c) => proxyHono(`/api/cases/${c.req.param('slug')}?lang=${c.req.query('lang') || 'pt'}`, c));

    app.post("/api/submit-form", async (c) => {
      try {
        const body = await c.req.json();
        const response = await fetch(`${CANAL_URL}/api/forms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return c.json(data);
      } catch {
        return c.json({ error: "Failed to submit form" }, 500);
      }
    });

    app.post("/api/chat", async (c) => {
      try {
        const body = await c.req.json();
        const response = await fetch(`${CANAL_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Canal unreachable");
        const contentType = response.headers.get("content-type") || "text/plain";
        if (response.body) {
          return new Response(response.body as ReadableStream, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-cache",
              "Transfer-Encoding": "chunked",
            },
          });
        }
        return c.text(await response.text());
      } catch {
        return c.json({ reply: "desculpe, tive um problema. tente novamente em instantes." }, 502);
      }
    });

    app.post("/api/newsletter", async (c) => {
      try {
        const body = await c.req.json();
        const response = await fetch(`${CANAL_URL}/api/newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return c.json(data);
      } catch {
        return c.json({ error: "Failed to subscribe" }, 500);
      }
    });

    app.use("/assets/*", serveStatic({ root: "./dist" }));
    app.get("*", async (c) => {
      return c.html(
        await (await import("fs/promises")).readFile(
          path.join(process.cwd(), "dist/index.html"),
          "utf-8"
        )
      );
    });

    console.log(`🚀  Production server: http://localhost:${PORT} → ${CANAL_URL}`);
    serve({ fetch: app.fetch, port: PORT });
  }
}

startServer();
