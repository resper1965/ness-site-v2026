import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Env = {
  Bindings: {
    CANAL_WORKER_URL: string;
    DB: any;
    VECTORIZE: any;
    AI: any;
    CANAL_KV: any;
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_AI_GATEWAY_ID?: string;
    WHISTLEBLOWER_SECRET?: string;
  };
};

const app = new Hono<Env>().basePath('/api');

// ── Cache na edge para leituras públicas ───────────────────────────
// Evita uma consulta ao D1 por visitante: a resposta fica 5 min na edge e
// pode ser servida obsoleta por até 1 h enquanto revalida em background.
const PUBLIC_CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600';

async function withEdgeCache(c: { req: { raw: Request } }, produce: () => Promise<Response>): Promise<Response> {
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(c.req.raw.url, { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await produce();
  if (res.ok) {
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', PUBLIC_CACHE);
    await cache.put(key, out.clone());
    return out;
  }
  return res;
}

// ── Helper: Gerador de Códigos de Caso (Compliance) ────────────────
function generateCaseCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  for (let i = 0; i < 12; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

// ── public chatbot config ──────────────────────────────────────────
app.get('/chatbot-config', async (c) => {
  const tenantId = c.req.query('tenant') || 'ness';
  try {
    const config = await c.env.DB.prepare(
      `SELECT bot_name, avatar_url, welcome_message, theme_color, enabled 
       FROM chatbot_config 
       WHERE tenant_id = ? 
       LIMIT 1`
    ).bind(tenantId).first();
    c.header('Cache-Control', 'public, max-age=60');
    return c.json(config || { bot_name: 'Gabi.OS', welcome_message: 'Olá! Como posso ajudar?', theme_color: '#00ade8', enabled: 1 });
  } catch {
    return c.json({ bot_name: 'Gabi.OS', welcome_message: 'Olá! Como posso ajudar?', theme_color: '#00ade8', enabled: 1 });
  }
});

// ── public insights (blog) ─────────────────────────────────────────
app.get('/insights', (c) => withEdgeCache(c, async () => {
  const lang = c.req.query('lang') || 'pt';
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT e.id, e.locale as lang, e.slug,
              json_extract(e.data, '$.title') as title,
              json_extract(e.data, '$.tag') as tag,
              json_extract(e.data, '$.icon') as icon,
              json_extract(e.data, '$.date') as date,
              json_extract(e.data, '$.desc') as desc,
              json_extract(e.data, '$.featured') as featured
       FROM entries e
       JOIN collections col ON e.collection_id = col.id
       WHERE col.slug = 'insights' AND e.locale = ? AND e.status = 'published'
       ORDER BY date DESC`
    ).bind(lang).all();
    return c.json(results);
  } catch {
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
}));

app.get('/insights/:slug', (c) => withEdgeCache(c, async () => {
  const lang = c.req.query('lang') || 'pt';
  const slug = c.req.param('slug');
  try {
    const result = await c.env.DB.prepare(
      `SELECT e.id, e.locale as lang, e.slug,
              json_extract(e.data, '$.title') as title,
              json_extract(e.data, '$.tag') as tag,
              json_extract(e.data, '$.icon') as icon,
              json_extract(e.data, '$.date') as date,
              json_extract(e.data, '$.desc') as desc,
              json_extract(e.data, '$.body') as body,
              json_extract(e.data, '$.featured') as featured
       FROM entries e
       JOIN collections col ON e.collection_id = col.id
       WHERE col.slug = 'insights' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
       LIMIT 1`
    ).bind(slug, lang).first();
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(result);
  } catch {
    return c.json({ error: 'Failed to fetch insight' }, 500);
  }
}));

// ── public cases (portfolio) ───────────────────────────────────────
app.get('/cases', (c) => withEdgeCache(c, async () => {
  const lang = c.req.query('lang') || 'pt';
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT e.id, e.locale as lang, e.slug,
              json_extract(e.data, '$.client') as client,
              json_extract(e.data, '$.category') as category,
              json_extract(e.data, '$.project') as project,
              json_extract(e.data, '$.result') as result,
              json_extract(e.data, '$.desc') as desc,
              json_extract(e.data, '$.stats') as stats,
              json_extract(e.data, '$.image') as image,
              json_extract(e.data, '$.featured') as featured
       FROM entries e
       JOIN collections col ON e.collection_id = col.id
       WHERE col.slug = 'cases' AND e.locale = ? AND e.status = 'published'
       ORDER BY featured DESC, e.id ASC`
    ).bind(lang).all();
    return c.json(results);
  } catch {
    return c.json({ error: 'Failed to fetch cases' }, 500);
  }
}));

app.get('/cases/:slug', (c) => withEdgeCache(c, async () => {
  const lang = c.req.query('lang') || 'pt';
  const slug = c.req.param('slug');
  try {
    const result = await c.env.DB.prepare(
      `SELECT e.id, e.locale as lang, e.slug,
              json_extract(e.data, '$.client') as client,
              json_extract(e.data, '$.category') as category,
              json_extract(e.data, '$.project') as project,
              json_extract(e.data, '$.result') as result,
              json_extract(e.data, '$.desc') as desc,
              json_extract(e.data, '$.stats') as stats,
              json_extract(e.data, '$.image') as image,
              json_extract(e.data, '$.featured') as featured
       FROM entries e
       JOIN collections col ON e.collection_id = col.id
       WHERE col.slug = 'cases' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
       LIMIT 1`
    ).bind(slug, lang).first();
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(result);
  } catch {
    return c.json({ error: 'Failed to fetch case' }, 500);
  }
}));

// ── public jobs (ATS) ──────────────────────────────────────────────
app.get('/jobs', async (c) => {
  const lang = c.req.query('lang') || 'pt';
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT e.id, e.locale as lang,
              json_extract(e.data, '$.title') as title,
              json_extract(e.data, '$.vertical') as vertical,
              json_extract(e.data, '$.location') as location,
              json_extract(e.data, '$.type') as type,
              json_extract(e.data, '$.desc') as desc,
              json_extract(e.data, '$.requirements') as requirements
       FROM entries e
       JOIN collections col ON e.collection_id = col.id
       WHERE col.slug = 'jobs' AND e.locale = ? AND e.status = 'published'
       ORDER BY e.created_at ASC`
    ).bind(lang).all();
    const items = (results as any[]).map(j => ({
      ...j,
      requirements: (() => { try { return typeof j.requirements === 'string' ? JSON.parse(j.requirements) : j.requirements; } catch { return []; } })()
    }));
    return c.json(items);
  } catch {
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// ── public form submissions ────────────────────────────────────────
app.post('/submit-form', async (c) => {
  try {
    const body = await c.req.json();
    const { type, ...payload } = body;
    await c.env.DB.prepare(
      "INSERT INTO forms (payload, source, status) VALUES (?, ?, 'new')"
    ).bind(JSON.stringify(payload), type || 'contact').run();
    return c.json({ success: true, message: 'Formulário registrado.' });
  } catch {
    return c.json({ error: 'Failed to submit form' }, 500);
  }
});

app.post('/newsletter', async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email || !email.includes('@')) return c.json({ error: 'Invalid email' }, 400);

    const existing = await c.env.DB.prepare("SELECT id FROM newsletter WHERE email = ? LIMIT 1").bind(email).first();
    if (existing) return c.json({ success: true });

    await c.env.DB.prepare("INSERT INTO newsletter (email) VALUES (?)").bind(email).run();
    return c.json({ success: true });
  } catch {
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

// ── whistleblower / canal de denúncias ──────────────────────────────
app.post('/whistleblower', async (c) => {
  try {
    const body = await c.req.json();
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const caseCode = generateCaseCode();

    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const masterKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(c.env.WHISTLEBLOWER_SECRET || 'fallback-local-dev-secret-key-12345'),
      'HKDF',
      false,
      ['deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: encoder.encode(caseCode),
        info: encoder.encode(body.tenant_id || 'ness'),
      },
      masterKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      encoder.encode(JSON.stringify({
        description: body.description,
        category: body.category,
        evidence: body.evidence,
        submitted_at: now,
      }))
    );

    const encryptedPayload = JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    await c.env.DB.prepare(
      `INSERT INTO whistleblower_cases 
       (id, tenant_id, case_code, encrypted_payload, category, status, sla_deadline, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 'new', ?, ?, ?)`
    ).bind(id, body.tenant_id || 'ness', caseCode, encryptedPayload, body.category, deadline.toISOString(), now, now).run();

    return c.json({ case_code: caseCode, message: 'Report submitted anonymously. Use this code to check status.' });
  } catch {
    return c.json({ error: 'Failed to submit whistleblower report' }, 500);
  }
});

app.get('/whistleblower/:code', async (c) => {
  const code = c.req.param('code');
  try {
    const kase = await c.env.DB.prepare(
      "SELECT case_code, status, category, created_at FROM whistleblower_cases WHERE case_code = ? LIMIT 1"
    ).bind(code).first();
    if (!kase) return c.json({ error: 'Case not found' }, 404);
    return c.json(kase);
  } catch {
    return c.json({ error: 'Failed to fetch whistleblower case' }, 500);
  }
});

app.post('/whistleblower/:code/followup', async (c) => {
  const code = c.req.param('code');
  try {
    const body = await c.req.json();
    const kase = await c.env.DB.prepare(
      "SELECT officer_notes FROM whistleblower_cases WHERE case_code = ? LIMIT 1"
    ).bind(code).first() as { officer_notes?: string } | null;

    if (!kase) return c.json({ error: 'Case not found' }, 404);

    const notes = kase.officer_notes 
      ? `${kase.officer_notes}\n---\n[Follow-up ${new Date().toISOString()}]: ${body.message}` 
      : `[Follow-up ${new Date().toISOString()}]: ${body.message}`;

    await c.env.DB.prepare(
      "UPDATE whistleblower_cases SET officer_notes = ?, updated_at = ? WHERE case_code = ?"
    ).bind(notes, new Date().toISOString(), code).run();

    return c.json({ success: true });
  } catch {
    return c.json({ error: 'Failed to submit followup' }, 500);
  }
});

// ── chatbot csat feedback ──────────────────────────────────────────
app.post('/chat/csat', async (c) => {
  try {
    const body = await c.req.json();
    const sessionId = c.req.header('x-session-id');
    const score = body.csat_score;
    if (!sessionId || typeof score !== 'number') {
      return c.json({ error: 'Missing session_id or csat_score' }, 400);
    }
    await c.env.DB.prepare("UPDATE chat_sessions SET csat_score = ? WHERE id = ?").bind(score, sessionId).run();
    return c.json({ success: true });
  } catch {
    return c.json({ error: 'Failed to record feedback' }, 500);
  }
});

// ── agentic AI chatbot (Gabi Agent + Cognitive Memory) ──────────────
app.post('/chat', async (c) => {
  const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';

  // Simple IP rate-limiting via KV
  try {
    const limitKey = `rl:${clientIp}`;
    const current = await c.env.CANAL_KV.get(limitKey);
    if (current && parseInt(current) > 20) {
      return new Response('Muitas requisições. Aguarde um minuto.', { status: 429 });
    }
    const val = current ? parseInt(current) + 1 : 1;
    await c.env.CANAL_KV.put(limitKey, val.toString(), { expirationTtl: 60 });
  } catch {}

  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Payload JSON inválido' }, 400);
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const locale = typeof body?.locale === 'string' ? body.locale : 'pt';
  const pagesVisited = Array.isArray(body?.pagesVisited) ? body.pagesVisited : [];

  if (messages.length === 0) {
    return c.json({ error: 'Mensagem não fornecida' }, 400);
  }

  const lastMessage = messages[messages.length - 1]?.content || '';
  const lang = locale === 'en' ? 'English' : locale === 'es' ? 'Spanish' : 'Portuguese';

  // 1. Embedding generator & semantic Vectorize RAG
  let ragContext = '';
  try {
    const queryEmbedding = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [lastMessage]
    }) as { data: number[][] };

    const vectorResults = await c.env.VECTORIZE.query(queryEmbedding.data[0], {
      topK: 3,
      returnMetadata: 'all'
    });

    ragContext = vectorResults.matches
      .map((m: any) => m.metadata?.content || '')
      .join('\n\n---\n\n').trim();
  } catch {}

  // Fallback to SQLite solutions if Vectorize fails/returns empty
  if (!ragContext) {
    try {
      const fallback = await c.env.DB.prepare(`
        SELECT json_extract(e.data, '$.title') as title,
               json_extract(e.data, '$.desc') as desc
        FROM entries e
        JOIN collections col ON e.collection_id = col.id
        WHERE col.slug = 'solutions' AND e.locale = ? AND e.status = 'published'
        LIMIT 5
      `).bind(locale || 'pt').all();
      ragContext = fallback.results.map((r: any) => `${r.title}\n${r.desc}`).join('\n\n---\n\n');
    } catch {}
  }

  // 2. Cognitive Memory (Option A) — Dynamic prompt modifiers based on user history
  let toneMod = 'Elegante, discreta, de extrema confiança e DIRETA. Levemente sarcástica e bem-humorada.';
  let dynamicContextFocus = '';

  if (Array.isArray(pagesVisited) && pagesVisited.length > 0) {
    const lastPage = pagesVisited[pagesVisited.length - 1];
    if (lastPage.includes('/forense') || lastPage.includes('/cirt')) {
      toneMod = 'Altamente técnica, focada em resiliência cibernética, precisa e com tom de urgência calmo e seguro.';
      dynamicContextFocus = '\nO usuário está atualmente na seção de Resposta a Incidentes (Forense/n.cirt), mostre conhecimento de contenção de ameaças e perícia digital.';
    } else if (lastPage.includes('/trustness') || lastPage.includes('/compliance') || lastPage.includes('/dpo')) {
      toneMod = 'Séria, corporativa, focada em GRC, privacidade, auditoria, conformidade e governança de dados.';
      dynamicContextFocus = '\nO usuário está na seção de GRC (Trustness), mostre conhecimento de conformidade regulatória e privacidade (LGPD).';
    }
  }

  const systemPrompt = `Você é a Gabi, Secretária Executiva e concierge de alto nível da ness.

[SUA PERSONALIDADE]
${toneMod}
Responda sempre em no máximo 2-3 frases curtas. Sem bullet points, sem listas, sem dissertações.

[SEU CONHECIMENTO]
Você conhece bem o ecossistema ness.:
- ness. (serviços corporativos e engenharia de software de alta performance, fundada em 1991)
- trustness. (GRC, compliance, privacidade, LGPD e governança)
- forense.io / n.cirt (cibersegurança, investigação digital e resposta a incidentes)
${dynamicContextFocus}

[SUA REGRA DE OURO — NUNCA QUEBRE ISSO]
Você é INTELIGENTE, mas NÃO é consultora gratuita.
- Demonstre domínio do assunto com 1 frase precisa.
- Na frase seguinte, redirecione: sugira que o time comercial ou de engenharia aprofunde o tema.
- Convide o usuário a deixar seu contato de forma natural (nome, email ou telefone) para agendarmos uma conversa.
- NUNCA explique processos inteiros nem de diagnósticos de segurança.

IMPORTANTE: O idioma configurado é ${lang}. Responda SEMPRE em ${lang}.

[INCIDENTES CRÍTICOS — SLA-0]
Se o usuário estiver relatando um ataque AGORA (ransomware, vazamento, sistema fora do ar):
- Desative o sarcasmo completamente.
- Oriente-o a clicar no botão vermelho "Reportar Incidente" na tela imediatamente.
- Pergunte somente o escopo do impacto.

--- CONTEXTO DOS SERVIÇOS ---
${ragContext}
--- FIM ---`;

  const accountId = c.env.CLOUDFLARE_ACCOUNT_ID;
  const gatewayId = c.env.CLOUDFLARE_AI_GATEWAY_ID || 'ness-gateway';
  const sessionId = c.req.header('x-session-id') || `gabi-${Date.now()}`;

  // Tools definitions
  const tools = [
    {
      type: "function",
      function: {
        name: "obter_solucoes",
        description: "Busca informações sobre as soluções, tecnologias e competências de engenharia de software oferecidas pela ness.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Termo de busca (ex: react, hono, cloudflare, microsserviços)" }
          },
          required: ["query"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "obter_vagas_carreira",
        description: "Busca as vagas abertas atualmente no time de tecnologia e engenharia da ness.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "registrar_lead",
        description: "Salva as informações de contato fornecidas pelo cliente (nome, email ou telefone) para que o time comercial retorne o contato.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nome do cliente" },
            contact: { type: "string", description: "Email ou telefone de contato" },
            intent: { type: "string", description: "Interesse ou assunto de interesse" }
          },
          required: ["name", "contact"]
        }
      }
    }
  ];

  const executeTool = async (name: string, args: any) => {
    if (name === 'obter_solucoes') {
      const query = args.query || '';
      try {
        const rows = await c.env.DB.prepare(`
          SELECT json_extract(e.data, '$.title') as title, json_extract(e.data, '$.desc') as desc 
          FROM entries e JOIN collections col ON e.collection_id = col.id
          WHERE col.slug = 'solutions' AND (e.slug LIKE ? OR e.data LIKE ?) LIMIT 3
        `).bind(`%${query}%`, `%${query}%`).all();
        return JSON.stringify(rows.results);
      } catch { return 'Nenhuma solução encontrada.'; }
    }
    if (name === 'obter_vagas_carreira') {
      try {
        const rows = await c.env.DB.prepare(`
          SELECT json_extract(e.data, '$.title') as title, json_extract(e.data, '$.location') as location 
          FROM entries e JOIN collections col ON e.collection_id = col.id
          WHERE col.slug = 'jobs' AND e.status = 'published' LIMIT 5
        `).all();
        return JSON.stringify(rows.results);
      } catch { return 'Nenhuma vaga em aberto encontrada.'; }
    }
    if (name === 'registrar_lead') {
      const { name: lName, contact, intent } = args;
      try {
        await c.env.DB.prepare(`
          INSERT INTO leads (name, contact, source, intent, urgency) 
          VALUES (?, ?, 'chatbot', ?, 'media')
        `).bind(lName, contact, intent || 'Contato via Gabi Agente').run();
        return JSON.stringify({ success: true, message: "Lead registrado com sucesso!" });
      } catch { return JSON.stringify({ error: "Falha ao registrar lead." }); }
    }
    return 'Ferramenta não reconhecida.';
  };

  let currentMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  try {
    const gatewayOptions = accountId ? {
      gateway: {
        id: gatewayId,
        skipCache: false
      }
    } : {};

    const runInference = async (msgs: any) => {
      return await c.env.AI.run(
        '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        {
          messages: msgs,
          tools: tools,
          tool_choice: 'auto'
        },
        gatewayOptions
      );
    };

    let aiResponse = await runInference(currentMessages);

    if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
      currentMessages.push({ role: 'assistant', content: aiResponse.content || '', tool_calls: aiResponse.tool_calls });
      for (const call of aiResponse.tool_calls) {
        const result = await executeTool(call.function.name, call.function.arguments);
        currentMessages.push({
          role: 'tool',
          name: call.function.name,
          tool_call_id: call.id,
          content: result
        });
      }
      aiResponse = await runInference(currentMessages);
    }

    // Async background session persistence
    c.executionCtx.waitUntil((async () => {
      try {
        await c.env.DB.prepare(
          "INSERT INTO chat_sessions (id, tenant_id, locale, turn_count, created_at, status) VALUES (?, 'ness', ?, ?, CURRENT_TIMESTAMP, 'active') ON CONFLICT(id) DO UPDATE SET turn_count = excluded.turn_count, ended_at = CURRENT_TIMESTAMP"
        ).bind(sessionId, locale || 'pt', messages.length).run();

        await c.env.DB.prepare("DELETE FROM chat_messages WHERE session_id = ?").bind(sessionId).run();
        for (const msg of messages) {
          await c.env.DB.prepare(
            "INSERT INTO chat_messages (session_id, role, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
          ).bind(sessionId, msg.role, msg.content).run();
        }
      } catch (err) {
        console.error("[chat log error]", err);
      }
    })());

    const textReply = aiResponse.response || aiResponse.choices?.[0]?.message?.content || aiResponse.content || 'desculpe, tive um problema ao formular a resposta.';
    return c.text(textReply);

  } catch (err) {
    console.error("[chat error]", err);
    return new Response('não foi possível conectar ao assistente. tente novamente em instantes.', { status: 500 });
  }
});

export const onRequest = handle(app);
