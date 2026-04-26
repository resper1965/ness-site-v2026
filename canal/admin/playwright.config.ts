import { defineConfig, devices } from '@playwright/test';

/**
 * Canal Admin — Playwright E2E Configuration
 * 
 * Two modes:
 * - LOCAL: Tests against Vite dev server (localhost:5173)
 * - PROD:  Tests against canal.ness.com.br (set PROD_URL env)
 */
const PROD_URL = process.env.PROD_URL || 'https://canal.ness.com.br';
const isCI = !!process.env.CI;
const baseURL = isCI ? PROD_URL : 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'html',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api-smoke',
      testMatch: /api\.spec\.ts/,
      use: { baseURL: PROD_URL },
    },
    {
      name: 'admin-ui',
      testMatch: /admin\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Only start dev server for local runs (not CI or API-only tests)
  ...(isCI ? {} : {
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  }),
});
