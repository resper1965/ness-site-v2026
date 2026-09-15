import { useMatches } from 'react-router';

/**
 * A rota atual pediu para ser servida sem o runtime do React Router?
 *
 * Quem pede declara `export const handle = { semJs: true }` no módulo da
 * rota. Três lugares precisam saber: o `Layout`, que não emite `<Scripts>`;
 * o `Shell`, que troca o widget do chat por um link; e o aviso de
 * privacidade, que ali é servido pelo servidor e respondido por formulário.
 */
export function useSemJs(): boolean {
  return useMatches().some((m) => (m.handle as { semJs?: boolean } | undefined)?.semJs);
}
