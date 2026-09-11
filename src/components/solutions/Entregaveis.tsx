import type { CSSProperties } from 'react';
import { CabecalhoDeSecao } from '../Abertura';
import type { Entregavel, Ritmo } from '../../data/solutionsData';

/**
 * O que chega até o cliente, e quando: um mês de operação visto do lado dele.
 * O ritmo de cada entregável decide a marca no calendário — filete para o
 * contínuo, losango para o mensal, tracejado para o que segue o ciclo de
 * auditoria dele. Notificação não tem data, acontece quando acontece: os
 * pontos são ilustrativos, e a página diz isso.
 */

const OCORRENCIAS: { dia: number; nivel?: 'P1' | 'P2' }[] = [
  { dia: 3 },
  { dia: 9, nivel: 'P2' },
  { dia: 11 },
  { dia: 18, nivel: 'P1' },
  { dia: 24 },
];
const TAMANHO = { P1: 'h-3 w-3', P2: 'h-2.5 w-2.5' };

// Uma linha fina a cada semana: 4 colunas de 25 %.
const SEMANAS: CSSProperties = {
  backgroundImage: 'linear-gradient(to right, rgba(218, 226, 253, 0.08) 1px, transparent 1px)',
  backgroundSize: '25% 100%',
};

function Marca({ ritmo }: { ritmo: Ritmo }) {
  switch (ritmo) {
    case 'continuo':
      return <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary-container/80" />;
    case 'ciclo':
      return <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-primary" />;
    case 'mensal':
      return <span className="absolute right-0.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-on-surface" />;
    case 'ocorrencia':
      return (
        <>
          {OCORRENCIAS.map((o) => (
            <span
              key={o.dia}
              className={`absolute top-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container ${o.nivel ? TAMANHO[o.nivel] : 'h-2 w-2'}`}
              style={{ left: `${((o.dia - 0.5) / 30) * 100}%` }}
            >
              {o.nivel && (
                <b className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 font-display text-[10.5px] font-medium text-on-surface">{o.nivel}</b>
              )}
            </span>
          ))}
        </>
      );
  }
}

export default function Entregaveis({ entregaveis }: { entregaveis?: Entregavel[] }) {
  if (!entregaveis?.length) return null;

  return (
    <section id="entregaveis" className="mb-24">
      <CabecalhoDeSecao titulo="o que chega até você, e quando">Um mês de operação, visto do seu lado.</CabecalhoDeSecao>

      <div className="border-t border-white/10">
        <div aria-hidden="true" className="grid gap-6 border-b border-white/10 py-3 md:grid-cols-[240px_minmax(0,1fr)]">
          <span className="hidden md:block" />
          <div className="grid grid-cols-4 text-[12px] text-on-surface-variant">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className="border-l border-white/10 pl-2">semana {s}</span>
            ))}
          </div>
        </div>
        <ul>
          {entregaveis.map((e) => (
            <li key={e.nome} className="grid items-center gap-2 border-b border-white/10 py-4 md:grid-cols-[240px_minmax(0,1fr)] md:gap-6">
              <div>
                <strong className="block font-display text-sm font-medium text-white">{e.nome}</strong>
                <span className="text-[12.5px] leading-relaxed text-on-surface-variant">{e.detalhe}</span>
              </div>
              <div aria-hidden="true" className="relative h-8" style={SEMANAS}>
                <Marca ritmo={e.ritmo} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-[13px] text-on-surface-variant">Os eventos no calendário são ilustrativos.</p>
    </section>
  );
}
