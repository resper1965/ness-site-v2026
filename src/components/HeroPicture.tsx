import React from "react";

type HeroBrand = 'ness' | 'trustness' | 'forense';

interface HeroPictureProps {
  brand: HeroBrand;
  /** Opacidade final da foto sobre o fundo escuro (0–1). */
  opacity?: number;
  /** A imagem da home é o candidato a LCP: marca como prioridade alta. */
  priority?: boolean;
  grayscale?: boolean;
}

/**
 * Foto de fundo do hero, self-host, em AVIF/WebP com 3 larguras.
 * Substitui a imagem do Unsplash (175–520 kB) por 11–66 kB conforme a tela.
 */
export default function HeroPicture({ brand, opacity = 0.6, priority = false, grayscale = false }: HeroPictureProps) {
  const base = `/img/hero-${brand}`;
  const widths = [640, 1024, 1600];
  const srcset = (ext: string) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes="100vw" />
      <source type="image/webp" srcSet={srcset('webp')} sizes="100vw" />
      <img
        src={`${base}-1024.webp`}
        srcSet={srcset('webp')}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        width={1600}
        height={1000}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ opacity }}
        className={`w-full h-full object-cover ${priority ? '' : 'anim-fade-in'} ${grayscale ? 'grayscale' : ''}`}
      />
    </picture>
  );
}
