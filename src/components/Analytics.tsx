import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { registrarOrigem } from "../utils/origem";
import { evento } from "../utils/eventos";

/**
 * Envia `page_view` a cada navegação da SPA.
 *
 * O primeiro carregamento é contado pelo próprio Zaraz; aqui só as trocas de
 * rota, que ele não enxerga porque não há nova requisição de documento.
 */
export default function Analytics() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  // A campanha aparece na primeira URL; o formulário é preenchido depois.
  useEffect(() => { registrarOrigem(); }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    evento('page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
