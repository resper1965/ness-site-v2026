import { Fragment } from 'react';
import BlueDot from '../BlueDot';
import { CabecalhoDeSecao } from '../Abertura';
import type { OnboardingStep, OperacaoDoServico } from '../../data/solutionsData';

/**
 * Quando alguém precisa ser acionado. Com a ficha do produto: a cadeia de
 * acionamento ao lado de um caso de exemplo — o caso é como o turno passa, e
 * mostrar o objeto diz mais que o parágrafo que o descrevia. Sem a ficha: os
 * passos de onboarding que o produto já publica.
 */
export default function Operacao({
  operacao,
  onboarding,
}: {
  operacao?: OperacaoDoServico;
  onboarding?: OnboardingStep[];
}) {
  if (operacao?.escalacao.length) return <Escalacao operacao={operacao} />;
  if (!onboarding?.length) return null;

  return (
    <section id="operacao" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        como a operação roda<BlueDot />
      </h3>
      <ol className="grid gap-8 md:grid-cols-4">
        {onboarding.map((p) => (
          <li key={p.step}>
            <span className="font-mono text-sm text-primary-container">{p.step}</span>
            <h4 className="mt-3 font-display text-base font-medium tracking-tight text-white">{p.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{p.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Escalacao({ operacao }: { operacao: OperacaoDoServico }) {
  const { escalacao, caso } = operacao;

  return (
    <section id="operacao" className="mb-24">
      <CabecalhoDeSecao titulo="quando alguém precisa ser acionado">
        Você tem um canal de mensageria direto com a operação. Quem é chamado, e em que ordem, foi decidido antes, no
        onboarding.
      </CabecalhoDeSecao>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <ol>
          {escalacao.map((passo, i) => {
            // O último passo é o desvio — só acontece se o contato não responder —,
            // então o traço que leva a ele e o marcador dele são tracejados.
            const desvio = i === escalacao.length - 1;
            return (
              <li key={passo.titulo} className={`relative pl-8 ${desvio ? '' : 'pb-6'}`}>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 h-[9px] w-[9px] rounded-full border bg-surface-container-lowest ${desvio ? 'border-dashed border-on-surface-variant' : 'border-primary-container'}`}
                />
                {!desvio && (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1 top-5 border-l border-white/20 ${i === escalacao.length - 2 ? 'border-dashed' : ''}`}
                  />
                )}
                <strong className="block font-display text-sm font-medium text-white">{passo.titulo}</strong>
                <p className="mt-1 max-w-[52ch] text-[13.5px] leading-relaxed text-on-surface-variant">{passo.texto}</p>
              </li>
            );
          })}
        </ol>

        <aside aria-label="Exemplo de caso" className="rounded-2xl border border-white/10 p-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
            <strong className="font-display text-sm font-medium text-white">um caso, por dentro</strong>
            <span className="font-display text-[12.5px] font-medium text-primary-container">{caso.severidade}</span>
          </div>
          <dl className="mt-4 grid grid-cols-[9em_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[13px] leading-relaxed">
            {caso.campos.map((c) => (
              <Fragment key={c.rotulo}>
                <dt className="text-on-surface-variant">{c.rotulo}</dt>
                <dd className="text-on-surface">{c.valor}</dd>
              </Fragment>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-on-surface-variant">{caso.nota}</p>
          <p className="mt-2 text-[12px] text-on-surface-variant/80">Exemplo ilustrativo.</p>
        </aside>
      </div>
    </section>
  );
}
