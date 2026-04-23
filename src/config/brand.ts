export type Brand = 'ness' | 'trustness' | 'forense';

const KNOWN: Brand[] = ['ness', 'trustness', 'forense'];

/**
 * Detects the active brand at runtime from the current hostname.
 * This allows a single CF Pages deployment to serve all 3 domains:
 *   ness.com.br       → 'ness'
 *   trustness.com.br  → 'trustness'
 *   forense.io        → 'forense'
 *
 * VITE_BRAND overrides detection for local dev (set in .env).
 */
export function detectBrand(): Brand {
  const env = import.meta.env.VITE_BRAND as Brand | undefined;
  if (env && KNOWN.includes(env)) return env;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('trustness')) return 'trustness';
    if (host.includes('forense')) return 'forense';
  }
  return 'ness';
}

export const BRAND: Brand = detectBrand();

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
