import type { ReactNode } from 'react';
import BlueDot from '../BlueDot';
import { CabecalhoDeSecao } from '../Abertura';
import Glifo, { type Ator } from './Glifo';
import type { EscopoDoServico } from '../../data/solutionsData';

/**
 * Onde acaba a nossa parte: três zonas separadas por duas linhas, o runbook e o
 * contrato. A zona do meio é a que as listas "dentro" e "fora" deixavam sem
 * lugar — o que a ness. executa, mas só com a autorização do cliente. Os
 * marcadores no título dizem quem age em cada zona, os mesmos da escada.
 */
export default function Escopo({ escopo }: { escopo?: EscopoDoServico }) {
  if (!escopo?.dentro.length) return null;

  const zonas: { titulo: ReactNode; quem: string; atores: Ator[]; itens: string[]; tinta: string; limite?: string }[] = [
    {
      titulo: <>a ness<BlueDot /> executa</>,
      quem: 'Dentro do runbook, sem consulta.',
      atores: ['ia', 'time'],
      itens: escopo.dentro,
      tinta: 'bg-primary-container/5',
    },
    {
      titulo: 'com a sua autorização',
      quem: 'Passa pela governança combinada com você.',
      atores: ['time', 'voce'],
      itens: escopo.comAutorizacao,
      tinta: '',
      limite: 'limite do runbook',
    },
    {
      titulo: 'fica com você',
      quem: 'Fora do escopo do contrato.',
      atores: ['voce'],
      itens: escopo.fora,
      tinta: '',
      limite: 'limite do contrato',
    },
  ];

  return (
    <section id="escopo" className="mb-24">
      <CabecalhoDeSecao titulo="onde acaba a nossa parte">
        O runbook, combinado no onboarding, é a linha. O que está dentro dele a ness. executa sem pedir. O que passa dele
        espera a sua autorização.
      </CabecalhoDeSecao>

      {/* Os rótulos das linhas ficam em cima delas no desktop; no celular, dentro de cada zona. */}
      <div aria-hidden="true" className="hidden grid-cols-3 md:grid">
        {zonas.map((z) => (
          <span key={z.quem} className={z.limite ? 'border-l border-dashed border-white/25 pb-2.5 pl-3 text-[12.5px] text-on-surface-variant' : ''}>
            {z.limite}
          </span>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-3">
        {zonas.map((z, i) => (
          <div
            key={z.quem}
            className={`px-6 pb-7 pt-6 ${z.tinta} ${i ? 'border-t border-dashed border-white/25 md:border-l md:border-t-0' : ''}`}
          >
            {z.limite && <p className="mb-3 text-[12.5px] text-on-surface-variant md:hidden">{z.limite}</p>}
            <h3 className="mb-1 flex items-center gap-2 font-display text-[15px] font-medium text-white">
              <span className="inline-flex gap-1">
                {z.atores.map((ator) => <Glifo key={ator} ator={ator} />)}
              </span>
              {/* Num span só: solto no flex, cada pedaço do título virava item e
                  o gap separava o ponto da marca ("a ness . executa"). */}
              <span>{z.titulo}</span>
            </h3>
            <p className="mb-5 text-[13px] text-on-surface-variant">{z.quem}</p>
            <ul className="grid gap-2 text-[13.5px] leading-relaxed text-on-surface">
              {z.itens.map((item) => (
                <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-1.5 before:bg-on-surface-variant">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {escopo.naoPromete && <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-on-surface-variant">{escopo.naoPromete}</p>}
    </section>
  );
}
