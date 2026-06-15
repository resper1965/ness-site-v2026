/**
 * Mock Handlers — Dev Local
 *
 * Registra rotas Express que simulam o Canal CMS sem tocar produção.
 * Ativado automaticamente quando CANAL_WORKER_URL não está definida.
 *
 * Nenhum dado é persistido. Nenhum email é enviado. Nenhum AI é chamado.
 */

import type { Express, Request, Response } from 'express';
import { insightsMock } from './fixtures/insights';
import { casesMock } from './fixtures/cases';
import { jobsMock } from './fixtures/jobs';
import type { ChatbotConfig } from '../types/canal';

const MOCK_BANNER = '⚠️  [MOCK]';

const defaultChatbotConfig: ChatbotConfig = {
  bot_name: 'Gabi.OS [MOCK]',
  welcome_message: '👋 Modo desenvolvimento ativo. Nenhum dado é salvo, nenhum email enviado.',
  theme_color: '#f59e0b', // amber — indica visualmente que é mock
  enabled: 1,
};

export function registerMockHandlers(app: Express): void {
  console.log(`\n${MOCK_BANNER} Handlers de mock registrados. Nenhuma chamada irá para canal.ness.com.br\n`);

  // ── GET /api/insights ─────────────────────────────────────────
  app.get('/api/insights', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} GET /api/insights`);
    // Retorna todos independente do lang (só temos PT em mock)
    res.json(insightsMock);
  });

  // ── GET /api/insights/:slug ───────────────────────────────────
  app.get('/api/insights/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    console.log(`${MOCK_BANNER} GET /api/insights/${slug}`);
    const insight = insightsMock.find((i) => i.slug === slug);
    if (!insight) return res.status(404).json({ error: 'Not found' });
    // Adiciona body mock
    return res.json({
      ...insight,
      body: `# ${insight.title}\n\n${insight.desc}\n\n> Este é um artigo de demonstração gerado pelo modo mock de desenvolvimento.\n\n## Seção de exemplo\n\nConteúdo completo disponível apenas no Canal de produção.\n`,
    });
  });

  // ── GET /api/cases ────────────────────────────────────────────
  app.get('/api/cases', (_req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} GET /api/cases`);
    res.json(casesMock);
  });

  // ── GET /api/cases/:slug ──────────────────────────────────────
  app.get('/api/cases/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    console.log(`${MOCK_BANNER} GET /api/cases/${slug}`);
    const caseItem = casesMock.find((c) => c.slug === slug);
    if (!caseItem) return res.status(404).json({ error: 'Not found' });
    return res.json(caseItem);
  });

  // ── GET /api/jobs ─────────────────────────────────────────────
  app.get('/api/jobs', (_req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} GET /api/jobs`);
    res.json(jobsMock);
  });

  // ── GET /api/chatbot-config ───────────────────────────────────
  app.get('/api/chatbot-config', (_req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} GET /api/chatbot-config`);
    res.json(defaultChatbotConfig);
  });

  // ── POST /api/chat ────────────────────────────────────────────
  // Simula streaming sem chamar Workers AI, sem extrair leads, sem emails
  app.post('/api/chat', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} POST /api/chat (streaming simulado)`);

    const locale: string = req.body?.locale || 'pt';
    const lastMessage: string = req.body?.messages?.at(-1)?.content || '';

    const replyByLocale: Record<string, string> = {
      pt: `Olá! Sou a Gabi em **modo desenvolvimento** 🛠️\n\nSua mensagem foi: "${lastMessage}"\n\nNeste ambiente nenhum dado é salvo, nenhum email é enviado e nenhum crédito de IA é consumido. Em produção você verá a Gabi real respondendo com contexto RAG da ness.`,
      en: `Hi! I'm Gabi in **development mode** 🛠️\n\nYour message was: "${lastMessage}"\n\nIn this environment no data is saved, no emails are sent and no AI credits are consumed.`,
      es: `¡Hola! Soy Gabi en **modo desarrollo** 🛠️\n\nTu mensaje fue: "${lastMessage}"\n\nEn este entorno no se guardan datos, no se envían correos y no se consumen créditos de IA.`,
    };

    const reply = replyByLocale[locale] ?? replyByLocale['pt'];

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Mock', 'true');

    // Simula o stream palavra por palavra
    const words = reply.split(' ');
    let i = 0;
    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        res.end();
        return;
      }
      res.write(words[i++] + ' ');
    }, 60);
  });

  // ── POST /api/submit-form ──────────────────────────────────────
  app.post('/api/submit-form', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} POST /api/submit-form`, req.body?.type);
    // Simula sucesso sem gravar nada
    res.json({ success: true, message: '[MOCK] Formulário recebido (não persistido em dev).' });
  });

  // ── POST /api/newsletter ───────────────────────────────────────
  app.post('/api/newsletter', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} POST /api/newsletter email=${req.body?.email}`);
    res.json({ success: true, message: '[MOCK] Inscrição registrada (não persistida em dev).' });
  });

  // ── POST /api/whistleblower ───────────────────────────────────
  app.post('/api/whistleblower', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} POST /api/whistleblower category=${req.body?.category}`);
    res.json({ case_code: 'MOCK-CASE-99X88Y', message: '[MOCK] Denúncia registrada com sucesso (mock).' });
  });

  // ── GET /api/automation/github/repos ──────────────────────────
  app.get('/api/automation/github/repos', (_req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} GET /api/automation/github/repos`);
    res.json([]); // Portfolio usa isso — retorna vazio em dev
  });

  // ── POST /api/automation/apply/:job_id ─────────────────────────
  app.post('/api/automation/apply/:job_id', (req: Request, res: Response) => {
    console.log(`${MOCK_BANNER} POST /api/automation/apply/${(req as any).params?.job_id}`);
    res.json({ success: true, applicant_id: 'mock-applicant-123', message: '[MOCK] Candidatura enviada com sucesso (mock).' });
  });
}
