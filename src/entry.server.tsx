import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter, isRouteErrorResponse, type EntryContext } from 'react-router';
import { isbot } from 'isbot';

/**
 * Render no workerd: `renderToReadableStream` (Web Streams) em vez do
 * `renderToPipeableStream` do Node, que não existe aqui.
 *
 * Para humanos a resposta começa a sair no shell; para bots esperamos o
 * documento inteiro, porque scraper não espera stream.
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: { nonce?: string },
): Promise<Response> {
  let didError = false;

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} nonce={loadContext.nonce} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        didError = true;
        console.error(error);
      },
    },
  );

  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
  return new Response(body, {
    headers: responseHeaders,
    status: didError ? 500 : responseStatusCode,
  });
}

/**
 * O que vai para o log de erro — e o que não vai.
 *
 * Varredura de robô procurando WordPress produz dezenas de 404 por minuto.
 * Registrados como erro de aplicação, eles enterram o erro de verdade: em
 * quatro minutos de produção foram treze linhas, e nenhuma era defeito nosso.
 *
 * 404 de rota inexistente vira uma linha curta e identificável, para dar para
 * contar quais URLs antigas ainda recebem tráfego. O resto continua erro.
 */
export function handleError(erro: unknown, { request }: { request: Request }): void {
  if (request.signal.aborted) return;

  if (isRouteErrorResponse(erro) && erro.status === 404) {
    console.log(`[404] ${new URL(request.url).pathname}`);
    return;
  }

  console.error(erro);
}
