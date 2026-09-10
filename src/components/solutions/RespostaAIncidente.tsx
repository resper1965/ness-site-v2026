import BlueDot from '../BlueDot';
import type { NivelDeSeveridade, WorkflowStep } from '../../data/solutionsData';

/**
 * Seção 1 — "o que acontece quando alguma coisa acontece".
 *
 * É o hero de conteúdo da página: publica o modelo de severidade, que é a
 * informação que o comprador não consegue nos concorrentes. Enquanto a ficha
 * do produto não volta (ver docs/FICHA-runbook-por-produto.md), cai para o
 * `workflow`, que diz a mesma coisa com menos precisão e já está publicado.
 *
 * Tabela de verdade, não grade de divs: é uma matriz de nível × resposta, e
 * leitor de tela precisa do cabeçalho de linha e de coluna para navegá-la.
 */
export default function RespostaAIncidente({
  severidade,
  workflow,
}: {
  severidade?: NivelDeSeveridade[];
  workflow?: WorkflowStep[];
}) {
  const temSeveridade = Boolean(severidade?.length);
  if (!temSeveridade && !workflow?.length) return null;

  return (
    <section id="resposta" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que acontece quando alguma coisa acontece<BlueDot />
      </h3>

      {temSeveridade ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-on-surface-variant">
                <th scope="col" className="py-4 pr-6 font-medium">nível</th>
                <th scope="col" className="py-4 pr-6 font-medium">o que é</th>
                <th scope="col" className="py-4 pr-6 font-medium">quem age</th>
                <th scope="col" className="py-4 pr-6 font-medium">em que ordem</th>
                <th scope="col" className="py-4 font-medium">você recebe</th>
              </tr>
            </thead>
            <tbody>
              {severidade!.map((n) => (
                <tr key={n.nivel} className="border-b border-white/5 align-top">
                  <th scope="row" className="py-6 pr-6 font-display text-lg font-medium text-primary-container">
                    {n.nivel}
                  </th>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-white">{n.exemploConcreto}</td>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-on-surface-variant">{n.quemAge}</td>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-on-surface-variant">{n.quando}</td>
                  <td className="py-6 text-sm leading-relaxed text-on-surface-variant">{n.voceRecebe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ol className="grid gap-6 md:grid-cols-3">
          {workflow!.map((w) => (
            <li key={w.step} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
              <span className="font-mono text-sm text-primary-container">{w.step}</span>
              <h4 className="mt-4 font-display text-lg font-medium leading-snug tracking-tight text-white">
                {w.name}
              </h4>
              {w.desc && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{w.desc}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
