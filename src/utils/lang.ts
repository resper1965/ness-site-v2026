export const IDIOMAS = ['pt', 'en', 'es'] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** pt não tem prefixo: é o idioma padrão e mora na raiz. */
export const IDIOMA_PADRAO: Idioma = 'pt';

/**
 * O idioma passa a viver na URL, não no localStorage.
 *
 * Enquanto morava no navegador, /solucoes em inglês e em português eram a
 * mesma URL — o Google via uma página só, em português, e as versões en/es
 * simplesmente não existiam para ele.
 */
export function idiomaDaRota(pathname: string): Idioma {
  const primeiro = pathname.split('/')[1];
  return (IDIOMAS as readonly string[]).includes(primeiro) && primeiro !== IDIOMA_PADRAO
    ? (primeiro as Idioma)
    : IDIOMA_PADRAO;
}

/** O caminho sem o prefixo de idioma, sempre começando com "/". */
export function rotaSemIdioma(pathname: string): string {
  const idioma = idiomaDaRota(pathname);
  if (idioma === IDIOMA_PADRAO) return pathname || '/';
  const resto = pathname.slice(idioma.length + 1);
  return resto || '/';
}

/** A mesma página no outro idioma — o que o seletor e o hreflang precisam. */
export function rotaNoIdioma(pathname: string, idioma: Idioma): string {
  const base = rotaSemIdioma(pathname);
  if (idioma === IDIOMA_PADRAO) return base;
  return base === '/' ? `/${idioma}` : `/${idioma}${base}`;
}
