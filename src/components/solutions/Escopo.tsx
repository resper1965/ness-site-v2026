import { Check, Minus } from 'lucide-react';
import BlueDot from '../BlueDot';
import type { EscopoDoServico } from '../../data/solutionsData';

/**
 * Seção 2 — até onde vai a responsabilidade.
 *
 * A coluna "fora" não é ressalva jurídica: é o que faz um CISO acreditar na
 * coluna "dentro". As duas listas têm o mesmo peso visual de propósito.
 */
export default function Escopo({ escopo }: { escopo?: EscopoDoServico }) {
  if (!escopo?.dentro?.length && !escopo?.fora?.length && !escopo?.fronteira) return null;

  const colunas = [
    { titulo: 'dentro', itens: escopo?.dentro ?? [], Icone: Check, cor: 'text-primary-container' },
    { titulo: 'fora', itens: escopo?.fora ?? [], Icone: Minus, cor: 'text-on-surface-variant/60' },
  ].filter((c) => c.itens.length);

  return (
    <section id="escopo" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que está no escopo — e o que não está<BlueDot />
      </h3>
      <div className="grid gap-8 md:grid-cols-2">
        {colunas.map(({ titulo, itens, Icone, cor }) => (
          <div key={titulo} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
            <h4 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
              {titulo}
            </h4>
            <ul className="space-y-4">
              {itens.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-on-surface">
                  <Icone size={16} className={`mt-0.5 shrink-0 ${cor}`} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {escopo?.fronteira && (
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
          <span className="mr-2 text-[11px] font-medium uppercase tracking-widest text-primary-container">
            onde acaba a nossa parte
          </span>
          {escopo.fronteira}
        </p>
      )}
    </section>
  );
}
