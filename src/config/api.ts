/**
 * Centralized API configuration.
 *
 * Leave VITE_CANAL_BASE_URL unset for both local dev and CF Pages production.
 * Relative /api/* calls are handled by:
 *   - Dev:        Express proxy in server.ts
 *   - Production: CF Pages Functions in functions/api/[[route]].ts
 *
 * Only set VITE_CANAL_BASE_URL if you need the browser to call the canal
 * Worker directly (requires CORS to be configured on the Worker).
 */
export const CANAL_BASE = import.meta.env.VITE_CANAL_BASE_URL ?? '';
