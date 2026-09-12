import { Link } from 'react-router-dom';
import BlueDot from './BlueDot';
import { sequencia } from '../utils/movimento';

export type PontoDaLinha = {
  /** O momento: "antes", "todo dia", "quando é preciso provar". */
  quando: string;
  /** Nome de marca, quando o ponto é uma empresa do ecossistema. */
  marca?: string;
  texto: string;
  href?: string;
  /** Domínio de outra marca: sai como <a>, não como rota interna. */
  externo?: boolean;
};

/**
 * A linha da empresa (spec, seção 4): o ciclo inteiro numa coluna só, por
 * tempo, com um ponto por momento. Cada ponto leva à página correspondente.
 *
 * O filete é um SVG inline, esticado por `preserveAspectRatio="none"` para
 * acompanhar a altura da lista. Os marcadores de 9 px e os rótulos são HTML:
 * o ponto azul da marca é um `<span>` e não sobrevive dentro de `<svg>`, e
 * alinhar texto HTML a marcador SVG quebra quando a escala da fonte muda —
 * que é exatamente o que a escala fluida passou a fazer.
 *
 * Sem JavaScript, é uma lista de links. Os marcadores pousam em sequência ao
 * entrar na tela (`pousa-na-vista`, PLAN-movimento 4.3).
 */
export default function LinhaDaEmpresa({ titulo, pontos }: { titulo: string; pontos: PontoDaLinha[] }) {
  return (
    <figure className="relative w-full max-w-sm text-left">
      <figcaption className="mb-6 font-display text-nome font-medium lowercase text-white">
        {titulo}
        <BlueDot />
      </figcaption>

      <div className="relative">
        {/* O filete que liga os momentos. Decorativo: quem lê por leitor de
            tela recebe a lista, que já diz a ordem. */}
        {/* O filete, no idioma que o resto do site usa: um elemento de 1 px com
            `bg-white/20`, igual ao da cadeia de custódia e ao da régua da
            auditoria.

            Foi SVG em três tentativas, e nas três a medição no navegador dava
            certo — traço centrado, 1 px de espessura, caixa de 2×164 sobre uma
            lista de 188 — e a captura mostrava nada. Medida boa com resultado
            invisível três vezes é sinal de que o problema não está onde eu
            estava olhando; o caminho barato é usar o que já funciona duas
            seções abaixo, na mesma página. */}
        <span
          aria-hidden="true"
          className="absolute left-1 top-2 h-[calc(100%-1.5rem)] w-px bg-white/20"
        />

        <ol className="grid gap-6">
          {pontos.map((ponto, i) => {
            const rotulo = (
              <>
                <span className="block text-[12.5px] text-on-surface-variant">{ponto.quando}</span>
                {ponto.marca && (
                  <span className="marca mt-1 block text-nome text-white transition-colors group-hover:text-primary">
                    {ponto.marca.replace(/\.$|\.io$/, '')}
                    <BlueDot />
                    {ponto.marca.endsWith('.io') ? 'io' : ''}
                  </span>
                )}
                <span className="mt-1 block text-resumo leading-relaxed text-on-surface-variant">{ponto.texto}</span>
              </>
            );

            return (
              <li key={ponto.quando} className="relative pl-7">
                <span
                  aria-hidden="true"
                  className="marcador pousa-na-vista absolute left-0 top-1 h-[9px] w-[9px] rounded-full border border-primary-container bg-surface"
                  style={sequencia(i)}
                />
                {ponto.href ? (
                  ponto.externo ? (
                    <a href={ponto.href} className="group block transition-transform duration-[250ms] hover:translate-x-0.5">
                      {rotulo}
                    </a>
                  ) : (
                    <Link to={ponto.href} viewTransition className="group block transition-transform duration-[250ms] hover:translate-x-0.5">
                      {rotulo}
                    </Link>
                  )
                ) : (
                  <div className="group block">{rotulo}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}

/**
 * A faixa de presença global, só na home da ness. (spec, seção 4). O texto diz
 * sempre "clientes atendidos" — nunca "escritórios" nem "operação em" —, e os
 * seis países vêm das chaves que já existiam e até agora não eram usadas.
 * O marcador em mira de 7 px é decorativo.
 */
export function FaixaDePresenca({ rotulo, lugares }: { rotulo: string; lugares: string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-on-surface-variant">
      <span aria-hidden="true" className="inline-block h-[7px] w-[7px] rounded-full border border-primary-container" />
      <span>{rotulo}</span>
      <span aria-hidden="true" className="text-white/20">·</span>
      {lugares.map((lugar, i) => (
        <span key={lugar}>
          {lugar}
          {i < lugares.length - 1 && <span aria-hidden="true" className="pl-2 text-white/20">·</span>}
        </span>
      ))}
    </p>
  );
}
