import BlueDot from '../BlueDot';
import { CabecalhoDeSecao } from '../Abertura';
import Glifo, { NOME_DO_ATOR, type Ator } from './Glifo';
import type { NivelDeSeveridade, WorkflowStep } from '../../data/solutionsData';

/**
 * "O que acontece quando alguma coisa acontece", em dois desenhos.
 *
 * Com a ficha do produto: a escada de severidade. Cada nível tem uma coluna por
 * ator, e um filete de 2 px diz quanto cada um entra — cheio no P1, nada para o
 * time no P4. O filete substituiu os blocos cheios do primeiro desenho: mesma
 * informação, traço mais delicado. No celular, cada nível vira bloco.
 *
 * Sem a ficha: o `workflow` de três passos, que já está publicado. Os títulos
 * têm nível diferente porque os dois desenhos vivem em páginas diferentes: no
 * novo, o h1 é a promessa e as seções são h2; no antigo, há o h2 do subtítulo
 * e elas descem para h3.
 */

const ATORES: Ator[] = ['ia', 'time', 'voce'];

// Quanto cada ator entra, do nível mais grave ao mais leve (em %).
const MEDIDA = { time: [100, 66, 33, 33], voce: [100, 66, 33, 15] };
const COR: Record<Ator, string> = { ia: 'bg-primary-container', time: 'bg-primary', voce: 'bg-on-surface' };
const medida = (lista: number[], i: number) => lista[Math.min(i, lista.length - 1)];

const COLUNAS = 'md:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)]';

function Filete({ ator, valor }: { ator: Ator; valor: number }) {
  return (
    <div aria-hidden="true" className="relative mb-3 h-0.5 rounded-full bg-white/10">
      <span className={`absolute inset-y-0 left-0 rounded-full ${COR[ator]}`} style={{ width: `${valor}%` }} />
    </div>
  );
}

function Escada({ niveis }: { niveis: NivelDeSeveridade[] }) {
  return (
    <div>
      <div aria-hidden="true" className={`hidden gap-x-2 border-b border-white/20 pb-3 font-display text-[12.5px] font-medium text-on-surface-variant md:grid ${COLUNAS}`}>
        <span>nível</span>
        <div className="grid grid-cols-3 gap-x-2">
          {ATORES.map((ator) => (
            <span key={ator} className="flex items-center gap-2 px-4">
              <Glifo ator={ator} />
              {NOME_DO_ATOR[ator]}
            </span>
          ))}
        </div>
      </div>

      {niveis.map((n, i) => {
        const celulas: { ator: Ator; valor: number; texto: string; quando?: string }[] = [
          { ator: 'ia', valor: 100, texto: n.aiops },
          { ator: 'time', valor: n.time ? medida(MEDIDA.time, i) : 0, texto: n.time ?? 'Não precisa entrar.' },
          { ator: 'voce', valor: medida(MEDIDA.voce, i), texto: n.voce.recebe, quando: n.voce.quando },
        ];
        return (
          <article key={n.nivel} className={`grid gap-4 border-b border-white/10 py-6 md:gap-x-2 ${COLUNAS}`}>
            <div className="md:pr-4">
              <h3 className="font-display text-sm font-medium text-white">
                <span className="mr-2 text-primary-container">{n.nivel}</span>
                {n.nome}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant">{n.exemplo}</p>
              <p className="mt-1.5 text-[12.5px] text-on-surface-variant">ordem: {n.ordem}</p>
            </div>
            <dl className="grid gap-4 md:grid-cols-3 md:gap-x-2">
              {celulas.map((c) => (
                <div key={c.ator} className={`text-[13.5px] leading-relaxed md:px-4 ${c.valor ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  <dt className="mb-1.5 flex items-center gap-2 font-display text-[12.5px] font-medium text-on-surface-variant md:sr-only">
                    <Glifo ator={c.ator} />
                    {NOME_DO_ATOR[c.ator]}
                  </dt>
                  <dd>
                    <Filete ator={c.ator} valor={c.valor} />
                    {c.quando && <span className="block font-display text-[12.5px] font-medium text-white">{c.quando}</span>}
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
        <CabecalhoDeSecao titulo="quem age em cada nível de severidade">
          Quanto mais grave o evento, mais gente entra e mais cedo você fica sabendo. O filete mostra quanto cada um entra
          no nível; os prazos ficam na proposta.
        </CabecalhoDeSecao>
        <Escada niveis={severidade} />
        <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-on-surface-variant">
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
