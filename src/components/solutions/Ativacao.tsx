import BlueDot, { NomeDeProduto } from '../BlueDot';

/**
 * As etapas até o serviço entrar no ar. É sequência de verdade, então leva
 * número; e a última não termina — é a operação, desenhada como linha aberta.
 * A duração não aparece: depende do ambiente e sai do diagnóstico.
 */
export default function Ativacao({ produto, etapas, nota }: { produto: string; etapas?: string[]; nota?: string }) {
  if (!etapas?.length) return null;

  return (
    <section id="ativacao" className="mb-24">
      <div className="mb-10 max-w-3xl space-y-3">
        <h2 className="font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
          como o <NomeDeProduto nome={produto} /> entra no ar<BlueDot />
        </h2>
        <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
          Por etapas, na ordem abaixo. A última não termina: é a operação.
        </p>
      </div>

      <ol className="grid lg:grid-cols-7">
        {etapas.map((etapa, i) => {
          const ultima = i === etapas.length - 1;
          return (
            <li
              key={etapa}
              className={`relative pb-6 pl-11 font-display text-[15px] font-medium leading-snug lg:pb-0 lg:pl-0 lg:pr-4 lg:pt-10 ${ultima ? 'text-primary-container' : 'text-white'}`}
            >
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-[11px] top-0 w-0.5 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[11px] lg:h-0.5 lg:w-auto ${ultima ? 'bg-linear-to-b from-primary-container to-transparent lg:bg-linear-to-r' : 'bg-surface-container-highest'}`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-primary-container text-[11px] font-semibold ${ultima ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'}`}
              >
                {i + 1}
              </span>
              {etapa}
            </li>
          );
        })}
      </ol>

      {nota && <p className="mt-8 max-w-3xl text-sm leading-relaxed text-on-surface-variant">{nota}</p>}
    </section>
  );
}
