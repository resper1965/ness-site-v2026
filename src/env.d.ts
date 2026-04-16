/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND?: string
  readonly VITE_API_URL?: string
  // outros envs
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
