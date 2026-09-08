import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { registrarOrigem } from "../utils/origem";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Envia `page_view` ao GA4 em cada navegação da SPA.
 * O primeiro page_view vem do `gtag('config')` em /boot.js; aqui só as trocas
 * de rota. `window.gtag` existe desde o boot e enfileira até o SDK carregar.
 */
export default function Analytics() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  // A campanha aparece na primeira URL; o formulário é preenchido depois.
  useEffect(() => { registrarOrigem(); }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.gtag?.('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
