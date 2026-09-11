import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import i18n from './i18n';
import { idiomaDaRota } from './utils/lang';

// O <html lang> sai do servidor como pt-BR; o cliente acompanha a troca.
const syncLang = (lang: string) => {
  document.documentElement.lang = lang.split('-')[0];
};
i18n.on('languageChanged', syncLang);

const hidratar = () =>
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });

// O HTML de /en e /es sai do servidor no idioma da rota. Hidratar com o i18n
// ainda em pt — o bundle en/es só chegava depois — fazia o primeiro render do
// cliente divergir do servidor (React #418, medido em produção em /en e /es).
const idioma = idiomaDaRota(window.location.pathname);
if (idioma === 'pt') hidratar();
else i18n.changeLanguage(idioma).finally(hidratar);

// ── Observabilidade fora do caminho crítico ───────────────────────────
// O SDK do Sentry (~70 kB gz) só é carregado depois do `load`, em idle,
// para não competir com o conteúdo pelo LCP. Amostragem baixa por padrão.
const loadSentry = () => {
  import('@sentry/react')
    .then(({ init }) => {
      init({
        dsn: 'https://c22b0cc7a22b1d8fdcac903c88c1fdfb@o4509995422515200.ingest.us.sentry.io/4511552402030592',
        sampleRate: 0.5,
        tracesSampleRate: 0.05,
        sendDefaultPii: false,
      });
    })
    .catch(() => { /* telemetria é opcional */ });
};

if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
        .requestIdleCallback(loadSentry, { timeout: 5000 });
    } else {
      setTimeout(loadSentry, 3000);
    }
  });
}
