import { defineConfig, devices } from '@playwright/test';

/**
 * E2E do site público contra o build local (vite preview).
 * Uso: npm run build && npm run test:e2e:site
 * Não toca produção — o config padrão (playwright.config.ts) é o do canal.
 */
export default defineConfig({
  testDir: './tests/site',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.SITE_BASE_URL || 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    // Em ambientes com Chromium pré-instalado (sem `playwright install`), aponte PW_CHROMIUM_PATH.
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : undefined,
  },
  webServer: process.env.SITE_BASE_URL
    ? undefined
    : {
        command: 'npx vite preview --port 4173 --host 127.0.0.1',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
