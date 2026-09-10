/**
 * Os três atores da operação e o marcador de cada um. É o mesmo em todos os
 * diagramas da página — fluxo, escada de severidade, fronteira —, e é isso que
 * dispensa legenda: o leitor aprende o marcador uma vez.
 */
export type Ator = 'ia' | 'time' | 'voce';

export const NOME_DO_ATOR: Record<Ator, string> = {
  ia: 'AIOps',
  time: 'time de segurança',
  voce: 'você',
};

const FORMA: Record<Ator, string> = {
  ia: 'bg-primary-container',
  time: 'border-2 border-primary',
  voce: 'bg-on-surface',
};

export default function Glifo({ ator }: { ator: Ator }) {
  return <span aria-hidden="true" className={`inline-block h-3 w-3 shrink-0 rounded-full ${FORMA[ator]}`} />;
}
