import { defineConfig, devices } from '@playwright/test'

// Runs against a production build: `yarn build` first, then `yarn test:e2e`.
// Always starts its own server so a stale `yarn serve`, a dev server or another
// worktree's server can't answer instead. Set APP_PORT to run worktrees in parallel.
const port = Number(process.env.APP_PORT ?? 3000)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `yarn serve -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
