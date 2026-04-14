import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono().basePath('/api');

app.get("/insights", async (c) => {
  const lang = c.req.query("lang") || "pt";
  try {
    const response = await fetch(`https://canal.ness.com.br/api/insights?lang=${lang}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch insights" }, 500);
  }
});

app.get("/jobs", async (c) => {
  const lang = c.req.query("lang") || "pt";
  try {
    const response = await fetch(`https://canal.ness.com.br/api/jobs?lang=${lang}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch jobs" }, 500);
  }
});

app.get("/cases", async (c) => {
  const lang = c.req.query("lang") || "pt";
  try {
    const response = await fetch(`https://canal.ness.com.br/api/cases?lang=${lang}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to fetch cases" }, 500);
  }
});

app.post("/submit-form", async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch("https://canal.ness.com.br/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to submit form" }, 500);
  }
});

app.post("/chat", async (c) => {
  let body: any = null;
  try {
    body = await c.req.json();
    const response = await fetch("https://canal.ness.com.br/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    // Generative UI mock fallback for Edge
    const userMessage = (body?.message || "").toLowerCase();
    
    let replyContent = "Mock Edge: A Gabi.OS está funcionando na Cloudflare e pronta para ajudar!";
    
    if (userMessage.includes("vaga") || userMessage.includes("trabalho") || userMessage.includes("job") || userMessage.includes("carreira")) {
      replyContent = JSON.stringify({
        type: "job-list",
        message: "Encontrei as seguintes oportunidades na Ness via Edge:",
        data: [
          { id: 1, title: "Desenvolvedor(a) Frontend Sênior", location: "Remoto / São Paulo", type: "tempo integral" },
          { id: 2, title: "Consultor(a) SAP", location: "Híbrido / SP", type: "tempo integral" },
          { id: 3, title: "Engenheiro(a) de Cibersegurança", location: "Remoto", type: "tempo integral" }
        ]
      });
    } else if (userMessage.includes("portfolio") || userMessage.includes("case") || userMessage.includes("projeto")) {
      replyContent = JSON.stringify({
        type: "portfolio-list",
        message: "Aqui estão alguns dos nossos cases de sucesso recentes (Served by Cloudflare):",
        data: [
          { id: 1, title: "Transformação Digital Bancária", sector: "Finanças", metric: "+40% eficiência" },
          { id: 2, title: "Migração Cloud Enterprise", sector: "Saúde", metric: "Zero Downtime" }
        ]
      });
    }
    return c.json({ reply: replyContent, isMock: true });
  }
});

export const onRequest = handle(app);
