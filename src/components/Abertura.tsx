import type { ReactNode } from 'react';
import BlueDot from './BlueDot';
import ComMarcas from './ComMarcas';
import HeroPicture from './HeroPicture';
import type { Brand } from '../config/brand';

/** Texto que chega como string ganha as marcas desenhadas; o resto passa como veio. */
const comMarcas = (conteudo: ReactNode) => (typeof conteudo === 'string' ? <ComMarcas>{conteudo}</ComMarcas> : conteudo);

// A foto se funde no fundo da seção que vem depois — sem isso, aparece emenda.
const BASE = {
  lowest: { fundo: 'bg-surface-container-lowest', veu: 'from-surface-container-lowest/20 via-surface-container-lowest/75 to-surface-container-lowest' },
  surface: { fundo: 'bg-surface', veu: 'from-surface/20 via-surface/75 to-surface' },
};

/**
 * A abertura das páginas: centralizada, com a marca, uma frase que promete, o
 * texto de apoio e as ações. Quando a página tem, a foto da marca ocupa a
 * largura inteira por trás — e aí a abertura é uma seção própria, fora do
 * container da página.
 *
 * O tamanho passou por duas voltas em 10/09: a 88 px a home era grosseira; a
 * 32 px, pequena demais. Ficou no piso da faixa Display do brandbook: 48 px,
 * e 56 px na home (`destaque`).
 */
export default function Abertura({
  marca,
  titulo,
  children,
  acoes,
  fundo,
  base = 'lowest',
  destaque = false,
}: {
  marca?: ReactNode;
  titulo: ReactNode;
  children: ReactNode;
  acoes?: ReactNode;
  fundo?: Brand;
  base?: keyof typeof BASE;
  destaque?: boolean;
}) {
  const conteudo = (
    <div className="relative mx-auto grid max-w-3xl justify-items-center gap-5 text-center">
      {marca && <p className="marca text-lg text-white">{marca}</p>}
      <h1
        className={`text-balance font-display font-medium leading-[1.1] tracking-tight text-white ${
          destaque ? 'text-[34px] sm:text-[44px] lg:text-[56px]' : 'text-[32px] sm:text-[40px] lg:text-[48px]'
        }`}
      >
        {titulo}<BlueDot />
      </h1>
      <p className="max-w-[58ch] text-base leading-relaxed text-on-surface-variant md:text-lg">{comMarcas(children)}</p>
      {acoes && <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-3">{acoes}</div>}
    </div>
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

/** Título de seção a 24 px, com o ponto azul, e o texto que o apresenta. */
export function CabecalhoDeSecao({ id, titulo, children }: { id?: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-10 max-w-[62ch]">
      <h2 id={id} className="text-balance font-display text-2xl font-medium lowercase tracking-tight text-white">
        {titulo}<BlueDot />
      </h2>
      {children && <div className="mt-3 space-y-3 text-base leading-relaxed text-on-surface-variant">{comMarcas(children)}</div>}
    </div>
  );
}

/** Ação principal e link secundário, no mesmo tamanho contido (44 px de alvo). */
export const BOTAO =
  'inline-flex h-11 items-center rounded-full bg-primary-container px-6 font-display text-sm font-medium text-on-primary transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,173,232,0.25)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest';

export const LINK =
  'inline-block py-1 font-display text-sm font-medium text-white underline decoration-white/25 underline-offset-[5px] transition-colors hover:decoration-primary-container';
