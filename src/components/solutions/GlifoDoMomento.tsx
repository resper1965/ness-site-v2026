import type { ReactElement } from 'react';

/**
 * O glifo do momento (docs/ESTUDO-desktop-wow.md, C3): em cada coluna do
 * ciclo, o desenho do produto daquele momento, a 64 px no desktop e 48 px no
 * celular. Monocromático, traço de 1 px a 40 % de branco e um único acento
 * azul — o mesmo idioma dos diagramas da página de produto, reduzido. Sob o
 * mouse da coluna, o traço acende (`.coluna:hover .glifo .traco`).
 *
 * Os cinco desenhos:
 * - construir · n.devarch: os portões que o código atravessa; o acento já
 *   passou pelo último.
 * - operar · n.infraops e n.autoops: as três frentes, uma sobre a outra; o
 *   acento marca a que está sendo operada.
 * - proteger · n.secops: a escada de severidade, de P4 a P1; o acento está no
 *   degrau de cima.
 * - responder · n.cirt: as cinco células em volta da sala de guerra; o acento
 *   é a coordenação, no centro.
 * - comprovar · trustness.: o selo, com o traço da conferência dentro.
 *
 * `vector-effect="non-scaling-stroke"` mantém o traço em 1 px em qualquer
 * tamanho. Decorativo: quem lê por leitor de tela recebe o nome do estágio.
 */
export type Momento = 'construir' | 'operar' | 'proteger' | 'responder' | 'comprovar';

const T = { className: 'traco', fill: 'none', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const };

const DESENHO: Record<Momento, () => ReactElement> = {
  construir: () => (
    <>
      <path {...T} d="M4 40 H62" />
      <path {...T} d="M14 40 V26 H24 V40 M30 40 V26 H40 V40 M46 40 V26 H56 V40" />
      <circle className="acento" cx="51" cy="40" r="2.5" />
    </>
  ),
  operar: () => (
    <>
      <rect {...T} x="10" y="16" width="44" height="8" rx="1" />
      <rect {...T} x="10" y="28" width="44" height="8" rx="1" />
      <rect {...T} x="10" y="40" width="44" height="8" rx="1" />
      <circle className="acento" cx="17" cy="32" r="2.5" />
    </>
  ),
  proteger: () => (
    <>
      <path {...T} d="M4 52 H16 V42 H28 V32 H40 V22 H52 V12 H62" />
      <circle className="acento" cx="57" cy="12" r="2.5" />
    </>
  ),
  responder: () => (
    <>
      <path {...T} d="M32 32 L32 12 M32 32 L51 25.8 M32 32 L43.8 48.2 M32 32 L20.2 48.2 M32 32 L13 25.8" />
      <circle {...T} cx="32" cy="12" r="3.5" />
      <circle {...T} cx="51" cy="25.8" r="3.5" />
      <circle {...T} cx="43.8" cy="48.2" r="3.5" />
      <circle {...T} cx="20.2" cy="48.2" r="3.5" />
      <circle {...T} cx="13" cy="25.8" r="3.5" />
      <circle className="acento" cx="32" cy="32" r="3" />
    </>
  ),
  comprovar: () => (
    <>
      <circle {...T} cx="32" cy="32" r="18" />
      <path {...T} d="M23 33 L29 39 L41 25" />
      <circle className="acento" cx="32" cy="14" r="2.5" />
    </>
  ),
};

export default function GlifoDoMomento({ momento }: { momento: Momento }) {
  const Desenho = DESENHO[momento];
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="glifo mb-4 h-12 w-12 lg:h-16 lg:w-16">
      <Desenho />
    </svg>
  );
}
