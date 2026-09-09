import BlueDot from '../BlueDot';
import type { OnboardingStep, OperacaoDoServico } from '../../data/solutionsData';

/**
 * Seção 4 — quem opera, como o turno passa o bastão, e em quanto tempo entra
 * no ar. A linha do tempo de ativação fecha a seção porque responde a última
 * dessas perguntas.
 */
export default function Operacao({
  operacao,
  onboarding,
}: {
  operacao?: OperacaoDoServico;
  onboarding?: OnboardingStep[];
}) {
  const campos = operacao
    ? [
        { rotulo: 'cobertura', valor: operacao.cobertura },
        { rotulo: 'passagem de plantão', valor: operacao.passagemDePlantao },
        { rotulo: 'escalação', valor: operacao.escalacao },
        { rotulo: 'tempo de ativação', valor: operacao.tempoDeAtivacao },
      ].filter((c) => c.valor)
    : [];

  // Objeto presente mas todo em branco não basta: sem campo com valor e sem
  // onboarding, não há o que mostrar — some a seção em vez do título órfão.
  if (!campos.length && !onboarding?.length) return null;

  return (
    <section id="operacao" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        como a operação roda<BlueDot />
      </h3>

      {campos.length > 0 && (
        <dl className="mb-16 grid gap-8 md:grid-cols-2">
          {campos.map((c) => (
            <div key={c.rotulo} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
              <dt className="mb-3 text-[11px] font-medium uppercase tracking-widest text-primary-container">
                {c.rotulo}
              </dt>
              <dd className="text-sm leading-relaxed text-on-surface">{c.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {onboarding?.length ? (
        <ol className="grid gap-8 md:grid-cols-4">
          {onboarding.map((p) => (
            <li key={p.step}>
              <span className="font-mono text-sm text-primary-container">{p.step}</span>
              <h4 className="mt-3 font-display text-base font-medium tracking-tight text-white">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{p.desc}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
