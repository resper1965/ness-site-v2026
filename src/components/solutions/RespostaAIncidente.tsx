import BlueDot from '../BlueDot';
import Glifo, { NOME_DO_ATOR, type Ator } from './Glifo';
import type { NivelDeSeveridade, WorkflowStep } from '../../data/solutionsData';

/**
 * "O que acontece quando alguma coisa acontece", em dois desenhos.
 *
 * Com a ficha do produto: a escada de severidade. Cada nível tem uma coluna por
 * ator, e o preenchimento cai com a severidade — em P4 o time nem entra. É o
 * que a tabela de cinco colunas dizia em prosa; e no celular a tabela cortava
 * as colunas, enquanto aqui cada nível vira bloco.
 *
 * Sem a ficha: o `workflow` de três passos, que já está publicado. Os títulos
 * têm nível diferente porque os dois desenhos vivem em páginas diferentes: no
 * novo, o h1 é a promessa e as seções são h2; no antigo, há o h2 do subtítulo
 * e elas descem para h3.
 */

const ATORES: Ator[] = ['ia', 'time', 'voce'];

// Um tom por nível, do mais grave ao mais leve.
const TINTA = {
  time: ['bg-primary/20', 'bg-primary/10', 'bg-primary/5', 'bg-primary/5'],
  voce: ['bg-on-surface/15', 'bg-on-surface/10', 'bg-on-surface/5', 'bg-on-surface/5'],
};
const tom = (lista: string[], i: number) => lista[Math.min(i, lista.length - 1)];

const COLUNAS = 'md:grid-cols-[minmax(0,1.15fr)_minmax(0,3fr)]';

function Escada({ niveis }: { niveis: NivelDeSeveridade[] }) {
  return (
    <div className="grid gap-2">
      <div aria-hidden="true" className={`hidden gap-2 border-b border-white/10 pb-3 font-display text-sm font-medium md:grid ${COLUNAS}`}>
        <span className="text-on-surface-variant">nível</span>
        <div className="grid grid-cols-3 gap-2">
          {ATORES.map((ator) => (
            <span key={ator} className="flex items-center gap-2.5 px-5 text-on-surface">
              <Glifo ator={ator} />
              {NOME_DO_ATOR[ator]}
            </span>
          ))}
        </div>
      </div>

      {niveis.map((n, i) => {
        const celulas: { ator: Ator; tinta: string; texto: string; quando?: string }[] = [
          { ator: 'ia', tinta: 'bg-primary-container/15', texto: n.agentes },
          n.time
            ? { ator: 'time', tinta: tom(TINTA.time, i), texto: n.time }
            : { ator: 'time', tinta: 'border border-dashed border-surface-container-highest text-on-surface-variant', texto: 'Não precisa entrar.' },
          { ator: 'voce', tinta: tom(TINTA.voce, i), texto: n.voce.recebe, quando: n.voce.quando },
        ];
        return (
          <article key={n.nivel} className={`grid gap-2 border-t border-white/10 pt-6 md:border-t-0 md:pt-0 ${COLUNAS}`}>
            <div className="pb-2 md:py-5 md:pr-5">
              <span className="font-display text-3xl font-semibold leading-none tracking-tight text-primary-container">{n.nivel}</span>
              <h3 className="mb-1.5 mt-2.5 font-display text-[17px] font-medium leading-snug text-white">{n.nome}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">{n.exemplo}</p>
              <p className="mt-3 text-[13.5px] text-on-surface">
                <span className="mr-1.5 text-on-surface-variant">ordem</span>
                {n.ordem}
              </p>
            </div>
            <dl className="grid gap-2 md:grid-cols-3">
              {celulas.map((c) => (
                <div key={c.ator} className={`rounded-xl p-4 text-[14.5px] leading-normal text-on-surface md:p-5 ${c.tinta}`}>
                  <dt className="mb-1.5 flex items-center gap-2 font-display text-[13.5px] font-medium text-on-surface-variant md:sr-only">
                    <Glifo ator={c.ator} />
                    {NOME_DO_ATOR[c.ator]}
                  </dt>
                  <dd>
                    {c.quando && <span className="mb-1.5 block font-display text-[13.5px] font-semibold text-white">{c.quando}</span>}
                    {c.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        );
      })}
    </div>
  );
}

export default function RespostaAIncidente({
  severidade,
  workflow,
}: {
  severidade?: NivelDeSeveridade[];
  workflow?: WorkflowStep[];
}) {
  if (severidade?.length) {
    return (
      <section id="resposta" className="mb-24">
        <div className="mb-10 max-w-3xl space-y-3">
          <h2 className="font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
            quem age em cada nível de severidade<BlueDot />
          </h2>
          <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
            Quanto mais grave o evento, mais gente entra e mais cedo você fica sabendo. Os prazos de cada nível ficam na
            proposta; aqui está a ordem das coisas.
          </p>
        </div>
        <Escada niveis={severidade} />
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
          A cadeia de quem é acionado em cada nível sai do onboarding: você define os responsáveis, e a operação segue
          essa matriz.
        </p>
      </section>
    );
  }

  if (!workflow?.length) return null;

  return (
    <section id="resposta" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que acontece quando alguma coisa acontece<BlueDot />
      </h3>
      <ol className="grid gap-6 md:grid-cols-3">
        {workflow.map((w) => (
          <li key={w.step} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
            <span className="font-mono text-sm text-primary-container">{w.step}</span>
            <h4 className="mt-4 font-display text-lg font-medium leading-snug tracking-tight text-white">{w.name}</h4>
            {w.desc && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{w.desc}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
