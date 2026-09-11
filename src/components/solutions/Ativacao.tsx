import { NomeDeProduto } from '../BlueDot';
import { CabecalhoDeSecao } from '../Abertura';

/**
 * As etapas até o serviço entrar no ar. É sequência de verdade, então leva
 * número; e a última não termina — é a operação, desenhada como linha aberta.
 * A duração não aparece: depende do ambiente e sai do diagnóstico.
 */
export default function Ativacao({ produto, etapas, nota }: { produto: string; etapas?: string[]; nota?: string }) {
  if (!etapas?.length) return null;

  return (
    <section id="ativacao" className="mb-24">
      <CabecalhoDeSecao titulo={<>como o <NomeDeProduto nome={produto} /> entra no ar</>}>
        Por etapas, na ordem abaixo. A última não termina: é a operação.
      </CabecalhoDeSecao>

      <ol className="grid lg:grid-cols-7">
        {etapas.map((etapa, i) => {
          const ultima = i === etapas.length - 1;
          return (
            <li
              key={etapa}
              className={`relative pb-5 pl-9 font-display text-[13.5px] font-medium leading-snug lg:pb-0 lg:pl-0 lg:pr-4 lg:pt-8 ${ultima ? 'text-primary-container' : 'text-white'}`}
            >
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-[9px] top-0 w-px lg:bottom-auto lg:left-0 lg:right-0 lg:top-[9px] lg:h-px lg:w-auto ${ultima ? 'bg-linear-to-b from-primary-container to-transparent lg:bg-linear-to-r' : 'bg-white/20'}`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 z-10 grid h-[19px] w-[19px] place-items-center rounded-full border border-primary-container text-[10.5px] ${ultima ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'}`}
              >
                {i + 1}
              </span>
              {etapa}
            </li>
          );
        })}
      </ol>

      {nota && <p className="mt-7 max-w-3xl text-[13px] leading-relaxed text-on-surface-variant">{nota}</p>}
    </section>
  );
}
