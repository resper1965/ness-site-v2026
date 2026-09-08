import type { ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteLoaderData } from 'react-router';
import { LazyMotion, MotionConfig } from 'motion/react';

import './index.css';
import './i18n';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatLauncher from './components/ChatLauncher';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import SchemaOrg from './components/SchemaOrg';
import { ErrorBoundary as RenderErrorBoundary } from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import { BrandProvider, BRAND_DOMAINS, resolveBrand, type Brand } from './config/brand';
import { BRAND_DEFAULT_META, pageMeta } from './utils/meta';

/**
 * A marca sai do Host da requisição, no servidor, antes de qualquer render.
 * É isto que faz o HTML da edge já chegar com a cara do domínio certo.
 *
 * O `clientLoader` refaz a conta no navegador (mesma resposta, `location` é a
 * mesma origem) para a navegação interna não pagar uma ida ao servidor.
 */
type RootData = { brand: Brand; url: string; nonce: string };

/**
 * O canonical aponta sempre para o domínio de produção da marca, nunca para
 * a origem que serviu a resposta — é o que impede uma URL de preview de se
 * declarar canônica.
 */
function forPath(host: string, pathname: string, nonce: string): RootData {
  const brand = resolveBrand(host);
  return { brand, url: BRAND_DOMAINS[brand] + pathname, nonce };
}

export function loader({ request, context }: { request: Request; context: { nonce?: string } }): RootData {
  const url = new URL(request.url);
  return forPath(url.hostname, url.pathname, context.nonce ?? '');
}

export function clientLoader(): RootData {
  // O nonce só vale para o documento que o servidor emitiu; na navegação
  // interna não há script inline novo para autorizar.
  return forPath(window.location.hostname, window.location.pathname, '');
}

/**
 * Metadados por marca renderizados no servidor, para toda rota que não
 * declare os seus. Scrapers de LinkedIn e WhatsApp não executam JavaScript:
 * até aqui os três domínios compartilhavam o og: da ness, fixo no index.html.
 */
export function meta({ data, location }: { data?: RootData; location?: { pathname: string } }) {
  const brand = data?.brand ?? 'ness';
  return pageMeta(brand, location?.pathname ?? '/', BRAND_DEFAULT_META[brand]);
}

export const links = () => [
  { rel: 'preload', href: '/fonts/manrope-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
  { rel: 'preload', href: '/fonts/inter-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
];

export function Layout({ children }: { children: ReactNode }) {
  const nonce = (useRouteLoaderData('root') as RootData | undefined)?.nonce;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        {/* Preload do hero por marca e fila do gtag. Externo porque a CSP não
            permite script inline; síncrono porque o preload só vale antes do
            primeiro paint. */}
        <script src="/boot.js" nonce={nonce} />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Framer Motion é carregado sob demanda: o shell (navbar, footer, chat) usa
 * CSS puro, e as features de animação (`domMax`, necessário pelo `layout`
 * do portfólio) chegam num chunk separado depois do primeiro render.
 */
const loadMotionFeatures = () => import('motion/react').then((mod) => mod.domMax);

function Shell({ brand, children }: { brand: Brand; children: ReactNode }) {
  return (
    <BrandProvider value={brand}>
      <RenderErrorBoundary>
        <LazyMotion features={loadMotionFeatures}>
          <MotionConfig reducedMotion="user">
            <div className="min-h-screen">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-container text-on-primary-container px-4 py-2 z-50 rounded-lg font-bold">
                Pular para o conteúdo principal
              </a>
              <SchemaOrg type="organization" />
              <ScrollToTop />
              <Analytics />
              <Navbar />
              <ChatLauncher />
              <main id="main-content" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
            </div>
          </MotionConfig>
        </LazyMotion>
      </RenderErrorBoundary>
    </BrandProvider>
  );
}

export default function App({ loaderData }: { loaderData: RootData }) {
  return (
    <Shell brand={loaderData.brand}>
      <Outlet />
    </Shell>
  );
}

/**
 * Erro fora do alcance de uma rota — inclusive o 404 lançado por
 * `somente-ness`. Sem isto o React Router mostraria a tela crua dele.
 */
export function ErrorBoundary({ error }: { error: unknown }) {
  const data = useRouteLoaderData('root') as RootData | undefined;
  const brand = data?.brand ?? 'ness';

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Shell brand={brand}>
        <NotFound />
      </Shell>
    );
  }

  console.error(error);
  return (
    <Shell brand={brand}>
      <div className="min-h-screen flex items-center justify-center px-8 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">algo deu errado</h1>
          <p className="opacity-70">tente recarregar a página em instantes.</p>
        </div>
      </div>
    </Shell>
  );
}
