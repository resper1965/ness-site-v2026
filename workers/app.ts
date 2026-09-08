import type { ExecutionContext } from 'hono';
import { createRequestHandler } from 'react-router';
import api, { type Bindings } from './api';
import { robots } from './robots';
import { sitemap } from './sitemap';

/**
 * O Worker único que serve os três domínios: HTML renderizado na edge,
 * a API, robots.txt e sitemap.xml. Os assets estáticos são servidos pelo
 * runtime antes de o código rodar (Workers Static Assets).
 */
const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

/**
 * O que o Pages aplicava por `public/_headers`. Aquele arquivo continua
 * valendo para os assets estáticos, mas não alcança uma resposta gerada
 * pelo Worker — o HTML precisa receber os cabeçalhos aqui.
 */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/**
 * O React Router injeta os dados de hidratação num script inline. Em vez de
 * abrir a CSP com 'unsafe-inline', cada resposta ganha um nonce: o mesmo
 * valor vai no cabeçalho e nas tags que o servidor emitiu.
 */
const csp = (nonce: string) =>
  `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://*.ness.com.br https://*.r2.dev https://images.unsplash.com https://ui-avatars.com https://www.googletagmanager.com https://*.google-analytics.com; connect-src 'self' https://canal.ness.com.br https://cloudflareinsights.com https://*.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.ingest.us.sentry.io; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`;

/**
 * Rotas espelho: as duas grafias existiam e respondiam 200, servindo o mesmo
 * conteúdo em duas URLs — conteúdo duplicado, com o Google escolhendo qual
 * indexar. Agora a versão em inglês redireciona para a canônica em português.
 */
const ESPELHOS: Record<string, string> = {
  '/contact': '/contato',
  '/about': '/sobre',
  '/portfólio': '/portfolio',
};

/**
 * 301 permanente antes de qualquer render: `www` para o domínio raiz e as
 * rotas espelho para a canônica. Sem isto, www continuaria servindo conteúdo
 * próprio — e serviu o site antigo enquanto só o domínio raiz tinha rota.
 */
function redirecionar(url: URL): Response | null {
  const paraApex = url.hostname.startsWith('www.');
  const espelho = ESPELHOS[decodeURIComponent(url.pathname)];
  if (!paraApex && !espelho) return null;

  const destino = new URL(url.toString());
  if (paraApex) destino.hostname = url.hostname.slice(4);
  if (espelho) destino.pathname = espelho;

  return new Response(null, {
    status: 301,
    headers: { Location: destino.toString(), 'Cache-Control': 'public, max-age=3600' },
  });
}

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const redirecionamento = redirecionar(url);
    if (redirecionamento) return redirecionamento;

    if (url.pathname === '/robots.txt') return robots(request);
    if (url.pathname === '/sitemap.xml') return sitemap(request, env);

    if (url.pathname.startsWith('/api/')) {
      // Em dev, as respostas vêm de fixtures — nenhuma chamada sai da máquina,
      // nenhum crédito de IA é gasto. Para exercitar a API de verdade,
      // `npm run build && npm run preview`, que roda contra o D1 local.
      if (import.meta.env.DEV) {
        const { mocks } = await import('./mocks');
        return mocks.fetch(request, env, ctx);
      }
      return api.fetch(request, env, ctx);
    }

    const nonce = crypto.randomUUID().replace(/-/g, '');
    const response = await requestHandler(request, { cloudflare: { env, ctx }, nonce });
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }
    response.headers.set('Content-Security-Policy', csp(nonce));
    return response;
  },
};
