import { createContext, useContext } from 'react';

export type Brand = 'ness' | 'trustness' | 'forense';

const KNOWN: Brand[] = ['ness', 'trustness', 'forense'];

/**
 * Resolves the brand from a hostname. Pure — serve para o navegador
 * (window.location.hostname) e para o servidor (cabeçalho Host), que é o
 * que permite um único deploy servir os 3 domínios com HTML já correto:
 *   ness.com.br       → 'ness'
 *   trustness.com.br  → 'trustness'
 *   forense.io        → 'forense'
 */
export function detectBrandFromHost(host: string | null | undefined): Brand {
  if (!host) return 'ness';
  if (host.includes('trustness')) return 'trustness';
  if (host.includes('forense')) return 'forense';
  return 'ness';
}

/**
 * Marca efetiva de uma requisição. VITE_BRAND sobrescreve para dev local
 * (.env), onde o host é sempre localhost e as três marcas cairiam em ness.
 */
export function resolveBrand(host: string | null | undefined): Brand {
  const env = import.meta.env.VITE_BRAND as Brand | undefined;
  if (env && KNOWN.includes(env)) return env;
  return detectBrandFromHost(host);
}

/**
 * A marca vem por contexto, não por constante de módulo.
 *
 * Uma constante avaliada na importação lê `window` — que no servidor não
 * existe, fazendo as três marcas renderizarem como ness. Como o valor
 * varia por requisição, ele precisa descer pela árvore React.
 */
const BrandContext = createContext<Brand>('ness');

export const BrandProvider = BrandContext.Provider;

export function useBrand(): Brand {
  return useContext(BrandContext);
}

export const BRAND_LABELS: Record<Brand, string> = {
  ness: 'ness.',
  trustness: 'trustness.',
  forense: 'forense.io',
};

/**
 * O sufixo do <title>. "IT Company" descreve a ness., a empresa — não as
 * sub-marcas: "trustness. IT Company" e "forense.io IT Company" descrevem
 * errado o que cada uma é. O guia de marca também pede a marca isolada, sem
 * descritor corporativo colado nela.
 */
export const BRAND_TITLE_SUFFIX: Record<Brand, string> = {
  ness: 'ness. IT Company',
  trustness: 'trustness.',
  forense: 'forense.io',
};

/** O nome do site em og:site_name — a marca, sempre isolada. */
export const BRAND_SITE_NAME: Record<Brand, string> = BRAND_LABELS;

export const BRAND_DOMAINS: Record<Brand, string> = {
  ness: 'https://ness.com.br',
  trustness: 'https://trustness.com.br',
  forense: 'https://forense.io',
};
