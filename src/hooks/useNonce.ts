import { useRouteLoaderData } from 'react-router';

/**
 * O nonce da CSP daquela resposta. Vem do Worker pelo loader da raiz — todo
 * `<script>` emitido pelo servidor precisa dele, ou a CSP o bloqueia.
 */
export function useNonce(): string | undefined {
  const data = useRouteLoaderData('root') as { nonce?: string } | undefined;
  return data?.nonce || undefined;
}
