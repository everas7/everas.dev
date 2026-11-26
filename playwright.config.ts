import { defineConfig, devices } from '@playwright/test'

// Runs against a production build: `yarn build` first, then `yarn test:e2e`.
export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'yarn serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
