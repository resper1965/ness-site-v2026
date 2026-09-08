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
 * Detecção no navegador. VITE_BRAND sobrescreve para dev local (.env).
 */
export function detectBrand(): Brand {
  const env = import.meta.env.VITE_BRAND as Brand | undefined;
  if (env && KNOWN.includes(env)) return env;

  if (typeof window !== 'undefined') {
    return detectBrandFromHost(window.location.hostname);
  }
  return 'ness';
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

export const BRAND_DOMAINS: Record<Brand, string> = {
  ness: 'https://ness.com.br',
  trustness: 'https://trustness.com.br',
  forense: 'https://forense.io',
};
