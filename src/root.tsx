import { useMemo, type ReactNode } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useMatches, useRouteLoaderData } from 'react-router';
import { LazyMotion, MotionConfig } from 'motion/react';

import './index.css';
import i18n, { ensureLanguage } from './i18n';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatLauncher from './components/ChatLauncher';
import AvisoDeConsentimento from './components/AvisoDeConsentimento';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import SchemaOrg from './components/SchemaOrg';
import { ErrorBoundary as RenderErrorBoundary } from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import Breadcrumbs from './components/Breadcrumbs';
import ProfundidadeDeRolagem from './components/ProfundidadeDeRolagem';
import { BrandProvider, BRAND_DOMAINS, resolveBrand, type Brand } from './config/brand';
import { BRAND_DEFAULT_META, pageMeta } from './utils/meta';
import { IDIOMA_PADRAO, idiomaDaRota, rotaSemIdioma, type Idioma } from './utils/lang';

/**
 * A marca sai do Host da requisição, no servidor, antes de qualquer render.
 * É isto que faz o HTML da edge já chegar com a cara do domínio certo.
 *
 * O `clientLoader` refaz a conta no navegador (mesma resposta, `location` é a
 * mesma origem) para a navegação interna não pagar uma ida ao servidor.
 */
type RootData = { brand: Brand; url: string; nonce: string; lang: Idioma; pathnameCompleto: string };

/**
 * O canonical aponta sempre para o domínio de produção da marca, nunca para
 * a origem que serviu a resposta — é o que impede uma URL de preview de se
 * declarar canônica.
 */
function forPath(host: string, pathname: string, nonce: string): RootData {
  const brand = resolveBrand(host);
  return { brand, url: BRAND_DOMAINS[brand] + pathname, nonce, lang: idiomaDaRota(pathname), pathnameCompleto: pathname };
}

export async function loader({ request, context }: { request: Request; context: { nonce?: string } }): Promise<RootData> {
  const url = new URL(request.url);
  const dados = forPath(url.hostname, url.pathname, context.nonce ?? '');
  // Sem os recursos carregados, a página sairia com as chaves cruas.
  await ensureLanguage(dados.lang);
  return dados;
}

export async function clientLoader(): Promise<RootData> {
  // O nonce só vale para o documento que o servidor emitiu; na navegação
  // interna não há script inline novo para autorizar.
  const dados = forPath(window.location.hostname, window.location.pathname, '');
  await ensureLanguage(dados.lang);
  return dados;
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
  { rel: 'preload', href: '/fonts/montserrat-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
  { rel: 'preload', href: '/fonts/inter-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
];

/**
 * O hero é o candidato a LCP. O preload sai no HTML do servidor, que sabe a
 * marca e a rota, e o preload scanner o encontra na primeira passada — sem
 * depender de nenhum script carregar antes. Chegou a sair quando o desenho
 * delicado tirou as fotos; voltou com elas.
 */
function PreloadDoHero({ brand, pathname }: { brand: Brand; pathname: string }) {
  if (rotaSemIdioma(pathname) !== '/') return null;
  const base = `/img/hero-${brand}`;
  return (
    <link
      rel="preload"
      as="image"
      type="image/avif"
      fetchPriority="high"
      imageSrcSet={`${base}-640.avif 640w, ${base}-1024.avif 1024w, ${base}-1600.avif 1600w`}
      imageSizes="100vw"
    />
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const dados = useRouteLoaderData('root') as RootData | undefined;
  const lang = dados?.lang ?? IDIOMA_PADRAO;
  const nonce = dados?.nonce;
  // Rota marcada com `semJs` não recebe o runtime do React Router: o HTML sai
  // completo do servidor e nenhum módulo desce. O que ainda precisa de
  // comportamento vem de /reforco.js (frente 2, tarefa 2).
  const semJs = useMatches().some((m) => (m.handle as { semJs?: boolean } | undefined)?.semJs);

  return (
    <html lang={lang === 'pt' ? 'pt-BR' : lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        {dados ? <PreloadDoHero brand={dados.brand} pathname={dados.pathnameCompleto} /> : null}
      </head>
      <body>
        {children}
        {semJs ? (
          <>
            {/* Medição e navegação nas rotas sem hidratação. `defer` para não
                disputar a primeira pintura; as regras de pré-carregamento são
                do navegador, e onde não houver suporte a navegação é a normal. */}
            <script defer nonce={nonce} src="/reforco.js" />
            <script
              type="speculationrules"
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  prerender: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }],
                }),
              }}
            />
          </>
        ) : (
          <>
            <ScrollRestoration nonce={nonce} />
            <Scripts nonce={nonce} />
          </>
        )}
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
  const { t } = useTranslation();
  // Mesma checagem do Layout: a rota sem JS não hidrata, então o widget do
  // chat (uma ilha React) nunca abriria. Ali o botão vira link para o
  // contato, com o mesmo alvo de toque e o mesmo evento de conversão.
  const semJsShell = useMatches().some((m) => (m.handle as { semJs?: boolean } | undefined)?.semJs);
  return (
    <BrandProvider value={brand}>
      <RenderErrorBoundary>
        <LazyMotion features={loadMotionFeatures}>
          <MotionConfig reducedMotion="user">
            <div className="min-h-screen">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-primary-container focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-on-primary focus:outline-none focus:ring-2 focus:ring-white">
                {t('a11y.skip', 'pular para o conteúdo principal')}
              </a>
              <SchemaOrg type="organization" />
              <ScrollToTop />
              <Analytics />
              <ProfundidadeDeRolagem />
              <Navbar />
              {semJsShell ? (
                <a
                  href="/contato?ref=chat"
                  data-evento="cta_click"
                  data-cta="chat_sem_js"
                  className="fixed bottom-6 right-6 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-container/25 bg-surface-container-low px-5 py-3 font-display text-sm font-medium text-white shadow-xl shadow-black/30 md:bottom-8 md:right-8"
                >
                  {t('chatbot.open', 'falar com a Gabi')}
                </a>
              ) : (
                <ChatLauncher />
              )}
              <AvisoDeConsentimento />
              <main id="main-content" tabIndex={-1} className="outline-none">
                <Breadcrumbs semTrilhaVisivel />
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
  /**
   * No servidor as requisições dividem o mesmo isolate: trocar o idioma da
   * instância global faria uma resposta em espanhol vazar para quem pediu
   * português. Cada render do servidor recebe um clone; o navegador, que
   * atende um usuário só, segue com a instância única.
   */
  const instancia = useMemo(() => {
    if (typeof window === 'undefined') {
      return i18n.cloneInstance({ lng: loaderData.lang });
    }
    if (!i18n.language.startsWith(loaderData.lang)) {
      void i18n.changeLanguage(loaderData.lang);
    }
    return i18n;
  }, [loaderData.lang]);

  return (
    <I18nextProvider i18n={instancia}>
      <Shell brand={loaderData.brand}>
        <Outlet />
      </Shell>
    </I18nextProvider>
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
      <ErroGenerico />
    </Shell>
  );
}

function ErroGenerico() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center px-8 text-center">
      <div>
        <h1 className="text-3xl font-medium mb-4">{t('a11y.error_title', 'algo deu errado')}</h1>
        <p className="text-on-surface-variant">{t('a11y.error_text', 'tente recarregar a página em instantes.')}</p>
      </div>
    </div>
  );
}
