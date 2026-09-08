import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';
import { BrandProvider, detectBrand } from './config/brand';

// Sync document lang attribute with i18n language for SEO and a11y
const syncLang = (lang: string) => {
  document.documentElement.lang = lang.split('-')[0];
};
syncLang(i18n.language);
i18n.on('languageChanged', syncLang);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandProvider value={detectBrand()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BrandProvider>
  </StrictMode>,
);

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
