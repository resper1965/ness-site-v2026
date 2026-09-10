import BlueDot from '../BlueDot';
import type { Entregavel } from '../../data/solutionsData';

/**
 * Seção 3 — o que chega na mesa de quem contrata, e quando.
 *
 * Lista de definição: o artefato é o termo, a cadência é a definição. É a
 * estrutura que o conteúdo tem, e dá ao leitor de tela o par correto.
 */
export default function Entregaveis({ entregaveis }: { entregaveis?: Entregavel[] }) {
  if (!entregaveis?.length) return null;

  return (
    <section id="entregaveis" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que você recebe<BlueDot />
      </h3>
      <dl className="divide-y divide-white/5 border-y border-white/5">
        {entregaveis.map((e) => (
          <div key={e.item} className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <dt className="font-display text-lg font-medium text-white md:flex-1">{e.item}</dt>
            <dd className="text-[11px] uppercase tracking-widest text-primary-container md:w-56 md:shrink-0">
              {e.cadencia}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
