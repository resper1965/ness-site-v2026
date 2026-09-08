/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND?: string
  readonly VITE_API_URL?: string
  /** Sitekey pública do Turnstile. Ausente = verificação desligada. */
  readonly VITE_TURNSTILE_SITEKEY?: string
  /** Token público do Cloudflare Web Analytics. Ausente = sem medição de campo. */
  readonly VITE_CF_BEACON_TOKEN?: string
  // outros envs
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
