/**
 * Centralized API configuration.
 * Update VITE_CANAL_BASE_URL in .env to point to the correct environment.
 *
 * Dev:        https://canal.ness.workers.dev
 * Production: https://api.ness.com.br  (update when domain is confirmed)
 */
export const CANAL_BASE =
  import.meta.env.VITE_CANAL_BASE_URL ?? 'https://canal.ness.workers.dev';
