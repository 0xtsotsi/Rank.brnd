import { defineConfig, devices } from '@playwright/test';
import { defineConfig as defineBddConfig } from 'playwright-bdd';

/**
 * Playwright Configuration
 * See https://playwright.dev/docs/test-configuration.
 *
 * Test Organization:
 * - tests/fixtures/ - Reusable test fixtures (auth, supabase, etc.)
 * - tests/utils/ - Helper functions and selectors
 * - tests/mocks/ - Mock data and API handlers
 * - tests/*.spec.ts - E2E test files
 * - tests/unit/ - Unit test files
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list'],
  ],

  // Shared settings for all tests
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Capture logs on failure
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Start dev server before running tests
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directories
  outputDir: 'test-results',

  // Global setup and teardown
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
});
