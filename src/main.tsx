import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';

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
    </BrowserRouter>
  </StrictMode>,
);

