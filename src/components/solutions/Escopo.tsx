import type { ReactNode } from 'react';
import BlueDot from '../BlueDot';
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
      tinta: 'bg-primary-container/10',
    },
    {
      titulo: 'com a sua autorização',
      quem: 'Passa pela governança combinada com você.',
      atores: ['time', 'voce'],
      itens: escopo.comAutorizacao,
      tinta: 'bg-primary/5',
      limite: 'limite do runbook',
    },
    {
      titulo: 'fica com você',
      quem: 'Fora do escopo do contrato.',
      atores: ['voce'],
      itens: escopo.fora,
      tinta: 'bg-on-surface/5',
      limite: 'limite do contrato',
    },
  ];

  return (
    <section id="escopo" className="mb-24">
      <div className="mb-10 max-w-3xl space-y-3">
        <h2 className="font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
          onde acaba a nossa parte<BlueDot />
        </h2>
        <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
          O runbook, combinado no onboarding, é a linha. O que está dentro dele a ness. executa sem pedir. O que passa dele
          espera a sua autorização.
        </p>
      </div>

      {/* Os rótulos das linhas ficam em cima delas no desktop; no celular, dentro de cada zona. */}
      <div aria-hidden="true" className="hidden grid-cols-3 md:grid">
        {zonas.map((z) => (
          <span key={z.quem} className={z.limite ? 'border-l-2 border-dashed border-surface-container-highest pb-2.5 pl-3 text-[13px] text-on-surface-variant' : ''}>
            {z.limite}
          </span>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-2xl md:grid-cols-3">
        {zonas.map((z, i) => (
          <div
            key={z.quem}
            className={`px-6 pb-8 pt-7 ${z.tinta} ${i ? 'border-t-2 border-dashed border-surface-container-highest md:border-l-2 md:border-t-0' : ''}`}
          >
            {z.limite && <p className="-mt-2 mb-4 text-[13px] text-on-surface-variant md:hidden">{z.limite}</p>}
            <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-medium text-white">
              <span className="inline-flex gap-1">
                {z.atores.map((ator) => <Glifo key={ator} ator={ator} />)}
              </span>
              {/* Num span só: solto no flex, cada pedaço do título virava item e
                  o gap separava o ponto da marca ("a ness . executa"). */}
              <span>{z.titulo}</span>
            </h3>
            <p className="mb-5 text-[13.5px] text-on-surface-variant">{z.quem}</p>
            <ul className="grid gap-2.5 text-[14.5px] leading-normal text-on-surface">
              {z.itens.map((item) => (
                <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-1.5 before:bg-on-surface-variant">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {escopo.naoPromete && <p className="mt-5 max-w-3xl text-sm leading-relaxed text-on-surface-variant">{escopo.naoPromete}</p>}
    </section>
  );
}
