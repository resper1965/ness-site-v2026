import type { ReactNode } from 'react';
import BlueDot from './BlueDot';
import ComMarcas from './ComMarcas';
import HeroPicture from './HeroPicture';
import type { Brand } from '../config/brand';
import { atrasoDoTitulo, sequencia } from '../utils/movimento';

/** Texto que chega como string ganha as marcas desenhadas; o resto passa como veio. */
const comMarcas = (conteudo: ReactNode) => (typeof conteudo === 'string' ? <ComMarcas>{conteudo}</ComMarcas> : conteudo);

// A foto se funde no fundo da seção que vem depois — sem isso, aparece emenda.
const BASE = {
  lowest: { fundo: 'bg-surface-container-lowest', veu: 'from-surface-container-lowest/20 via-surface-container-lowest/75 to-surface-container-lowest' },
  surface: { fundo: 'bg-surface', veu: 'from-surface/20 via-surface/75 to-surface' },
};

/**
 * O título sobe palavra por palavra de trás de uma linha invisível: cada
 * palavra é um `inline-block` com `overflow: hidden`, e o texto dentro vem de
 * `translateY(110%)`. O espaço fica ENTRE os blocos, não dentro, senão o
 * navegador não encontra onde quebrar a linha. Sem JavaScript e sem a
 * preferência de movimento, é só texto.
 */
function Palavras({ texto }: { texto: string }) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  return (
    <>
      {palavras.map((palavra, i) => (
        <span key={`${i}-${palavra}`}>
          {i > 0 && ' '}
          <span className="palavra" style={sequencia(i)}>
            <span>{palavra}</span>
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * A abertura das páginas: centralizada, com a marca, uma frase que promete, o
 * texto de apoio e as ações. Quando a página tem, a foto da marca ocupa a
 * largura inteira por trás — e aí a abertura é uma seção própria, fora do
 * container da página.
 *
 * O tamanho passou por duas voltas em 10/09: a 88 px a home era grosseira; a
 * 32 px, pequena demais. Ficou no piso da faixa Display do brandbook: 48 px,
 * e 56 px na home (`destaque`).
 *
 * Ela se compõe em 1,1 s (docs/PLAN-movimento.md, 4.1): a marca entra, o
 * título sobe palavra por palavra, o ponto azul pousa por último, e o lede e
 * as ações fecham a sequência.
 */
export default function Abertura({
  marca,
  titulo,
  children,
  acoes,
  fundo,
  base = 'lowest',
  destaque = false,
  aoLado,
  abaixo,
}: {
  marca?: ReactNode;
  titulo: ReactNode;
  children: ReactNode;
  acoes?: ReactNode;
  fundo?: Brand;
  base?: keyof typeof BASE;
  destaque?: boolean;
  /** O segundo plano da primeira tela: a linha da empresa, à direita a partir
   *  de 1024 px e abaixo do texto no celular (C2). */
  aoLado?: ReactNode;
  /** O que fecha a coluna de texto, abaixo das ações — a faixa de presença. */
  abaixo?: ReactNode;
}) {
  const palavras = typeof titulo === 'string' ? titulo.split(/\s+/).filter(Boolean).length : 0;
  const pouso = atrasoDoTitulo(palavras);

  // Com o segundo plano, a abertura deixa de ser um bloco centrado: o texto
  // encosta à esquerda nas colunas 1–7 e a linha ocupa as 8–12. Sem ele, é
  // exatamente a abertura de antes — centrada, em 768 px.
  const texto = (
    <div
      className={
        aoLado
          ? 'grid justify-items-start gap-5 text-left lg:col-span-7'
          : 'relative mx-auto grid max-w-3xl justify-items-center gap-5 text-center'
      }
    >
      {marca && <p className="marca entra text-lg text-white" style={sequencia(0)}>{marca}</p>}
      <h1
        /* A escala é fluida por token (C1): parte do tamanho que o celular já
           tinha e cresce com a tela, sem degrau por breakpoint. */
        className={`text-balance font-display font-medium leading-[1.1] tracking-tight text-white ${
          destaque ? 'text-abertura' : 'text-abertura-sm'
        } ${palavras ? '' : 'entra'}`}
      >
        {typeof titulo === 'string' ? <Palavras texto={titulo} /> : titulo}
        <span className="pousa" style={sequencia(0, `${pouso}ms`)}><BlueDot /></span>
      </h1>
      <p className="entra max-w-[58ch] text-base leading-relaxed text-on-surface-variant md:text-lg" style={sequencia(0, `${pouso + 120}ms`)}>
        {comMarcas(children)}
      </p>
      {acoes && (
        <div
          className={`entra flex flex-wrap items-center gap-x-6 gap-y-3 pt-3 ${aoLado ? 'justify-start' : 'justify-center'}`}
          style={sequencia(1, `${pouso + 120}ms`)}
        >
          {acoes}
        </div>
      )}
      {abaixo && (
        <div className="entra pt-4" style={sequencia(2, `${pouso + 120}ms`)}>
          {abaixo}
        </div>
      )}
    </div>
  );

  // Sem o segundo plano, a abertura é exatamente a de antes. Com ele, vira a
  // mesma grade de doze colunas do resto do site (C1): texto nas sete
  // primeiras, linha nas cinco últimas. No celular a linha cai para baixo do
  // texto, que é o que a spec descreve.
  const conteudo = aoLado ? (
    <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
      {texto}
      <div className="entra lg:col-span-5" style={sequencia(3, `${pouso + 120}ms`)}>
        {aoLado}
      </div>
    </div>
  ) : (
    texto
  );

  if (!fundo) return <div className="mb-20">{conteudo}</div>;

  return (
    <section
      className={`relative isolate flex items-center overflow-hidden px-8 pb-24 pt-36 md:pt-40 ${BASE[base].fundo} ${
        destaque ? 'min-h-[84vh]' : 'min-h-[70vh]'
      }`}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <HeroPicture brand={fundo} opacity={fundo === 'ness' ? 0.55 : 0.4} priority grayscale={fundo !== 'ness'} />
        <div className={`absolute inset-0 bg-linear-to-b ${BASE[base].veu}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,173,232,0.14),transparent_65%)]" />
      </div>
      <div className="w-full">{conteudo}</div>
    </section>
  );
}

/** Título de seção a 24 px, com o ponto azul, e o texto que o apresenta. Revela-se ao entrar na tela. */
export function CabecalhoDeSecao({ id, titulo, children }: { id?: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="revela mb-10 max-w-[62ch]">
      <h2 id={id} className="text-balance font-display text-secao font-medium lowercase tracking-tight text-white">
        {titulo}<BlueDot />
      </h2>
      {children && <div className="mt-3 space-y-3 text-base leading-relaxed text-on-surface-variant">{comMarcas(children)}</div>}
    </div>
  );
}

/** Ação principal e link secundário, no mesmo tamanho contido (44 px de alvo).
 *  O botão sobe 1 px e um reflexo passa uma vez; o link engrossa o sublinhado. */
export const BOTAO =
  'reflexo inline-flex h-11 items-center rounded-full bg-primary-container px-6 font-display text-sm font-medium text-on-primary transition-all hover:-translate-y-px hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,173,232,0.25)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest';

export const LINK =
  'link-vivo inline-block py-1 font-display text-sm font-medium text-white underline decoration-white/25 underline-offset-[5px] hover:decoration-primary-container';
