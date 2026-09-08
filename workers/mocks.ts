import { Hono } from 'hono';
import { insightsMock } from '../src/mocks/fixtures/insights';
import { casesMock } from '../src/mocks/fixtures/cases';
import { jobsMock } from '../src/mocks/fixtures/jobs';
import type { ChatbotConfig } from '../src/types/canal';

/**
 * Respostas de mentira para desenvolvimento local: nenhum dado é gravado,
 * nenhum email sai, nenhum crédito de IA é gasto. Só é montado quando
 * `import.meta.env.DEV` é verdadeiro, então não entra no bundle de produção.
 */
const defaultChatbotConfig: ChatbotConfig = {
  bot_name: 'Gabi.OS [MOCK]',
  welcome_message: '👋 Modo desenvolvimento ativo. Nenhum dado é salvo, nenhum email enviado.',
  theme_color: '#f59e0b', // amber — indica visualmente que é mock
  enabled: 1,
};

const REPLY: Record<string, (msg: string) => string> = {
  pt: (m) => `Olá! Sou a Gabi em **modo desenvolvimento** 🛠️\n\nSua mensagem foi: "${m}"\n\nNeste ambiente nenhum dado é salvo, nenhum email é enviado e nenhum crédito de IA é consumido.`,
  en: (m) => `Hi! I'm Gabi in **development mode** 🛠️\n\nYour message was: "${m}"\n\nIn this environment no data is saved, no emails are sent and no AI credits are consumed.`,
  es: (m) => `¡Hola! Soy Gabi en **modo desarrollo** 🛠️\n\nTu mensaje fue: "${m}"\n\nEn este entorno no se guardan datos, no se envían correos y no se consumen créditos de IA.`,
};

export const mocks = new Hono().basePath('/api');

mocks.get('/insights', (c) => c.json(insightsMock));

mocks.get('/insights/:slug', (c) => {
  const insight = insightsMock.find((i) => i.slug === c.req.param('slug'));
  if (!insight) return c.json({ error: 'Not found' }, 404);
  return c.json({
    ...insight,
    body: `# ${insight.title}\n\n${insight.desc}\n\n> Artigo de demonstração do modo mock.\n`,
  });
});

mocks.get('/cases', (c) => c.json(casesMock));

mocks.get('/cases/:slug', (c) => {
  const item = casesMock.find((x) => x.slug === c.req.param('slug'));
  return item ? c.json(item) : c.json({ error: 'Not found' }, 404);
});

mocks.get('/jobs', (c) => c.json(jobsMock));

mocks.get('/chatbot-config', (c) => c.json(defaultChatbotConfig));

mocks.post('/chat', async (c) => {
  type ChatBody = { locale?: string; messages?: { content: string }[] };
  const body: ChatBody = await c.req.json<ChatBody>().catch(() => ({}));
  const reply = (REPLY[body.locale ?? 'pt'] ?? REPLY.pt)(body.messages?.at(-1)?.content ?? '');

  // Stream palavra a palavra, para o widget exercitar o caminho de streaming.
  const words = reply.split(' ');
  const stream = new ReadableStream({
    async pull(controller) {
      const word = words.shift();
      if (word === undefined) return controller.close();
      controller.enqueue(new TextEncoder().encode(word + ' '));
      await new Promise((r) => setTimeout(r, 40));
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Mock': 'true' },
  });
});

mocks.post('/submit-form', (c) => c.json({ success: true, message: '[MOCK] Formulário recebido (não persistido em dev).' }));
mocks.post('/newsletter', (c) => c.json({ success: true, message: '[MOCK] Inscrição registrada (não persistida em dev).' }));
mocks.post('/whistleblower', (c) => c.json({ case_code: 'MOCK-CASE-99X88Y', message: '[MOCK] Denúncia registrada com sucesso (mock).' }));
mocks.get('/automation/github/repos', (c) => c.json([]));
mocks.post('/automation/apply/:job_id', (c) => c.json({ success: true, applicant_id: 'mock-applicant-123', message: '[MOCK] Candidatura enviada com sucesso (mock).' }));
