import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.test' });

const port = process.env.PORT || '8001';
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2, // Limit to 2 workers to avoid overwhelming server
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && ENV_FILE_OPTION="--env-file=.env.test" SERVICE_URL=${baseURL} PORT=${port} npm start`,
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
