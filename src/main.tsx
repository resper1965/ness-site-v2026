import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';

Sentry.init({
  dsn: "https://c22b0cc7a22b1d8fdcac903c88c1fdfb@o4509995422515200.ingest.us.sentry.io/4511552402030592",
  // To disable sending user data, uncomment the line below. For more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
  // dataCollection: { userInfo: false }
});

// Add this button component to your app to test Sentry's error tracking
function ErrorButton() {
  return (
    <button
      style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, background: 'red', color: 'white', padding: '10px' }}
      onClick={() => {
        throw new Error('This is your first error!');
      }}
    >
      Break the world
    </button>
  );
}

// Sync document lang attribute with i18n language for SEO and a11y
const syncLang = (lang: string) => {
  document.documentElement.lang = lang.split('-')[0];
};
syncLang(i18n.language);
i18n.on('languageChanged', syncLang);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ErrorButton />
    </BrowserRouter>
  </StrictMode>,
);

