import { Outlet } from 'react-router';
import { detectBrandFromHost } from '../config/brand';

/**
 * As soluções existem só na ness. Nos outros domínios a
 * resposta precisa ser 404 de verdade — um 200 com "não encontrado" é
 * soft-404 e o Google indexa.
 *
 * O `clientLoader` repete a checagem no navegador para a navegação interna
 * não pagar uma ida ao servidor só para descobrir a marca.
 */
function assertNess(host: string) {
  if (detectBrandFromHost(host) !== 'ness') {
    throw new Response('Not Found', { status: 404 });
  }
  return null;
}

export function loader({ request }: { request: Request }) {
  return assertNess(new URL(request.url).hostname);
}

export function clientLoader() {
  return assertNess(window.location.hostname);
}

export default function SomenteNess() {
  return <Outlet />;
}
