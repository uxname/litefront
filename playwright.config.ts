import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
config({ quiet: true });

/* The app port comes from `.env` (PORT), same value `npm run start:prod` binds.
   Keeping both in one place stops baseURL and webServer.url drifting apart. */
const port = Number(process.env.PORT) || 3000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail if a `test.only` was left in the source. Always on, not `!!process.env.CI`:
     this project has no CI, so the pre-push hook IS the gate — and a stray
     `test.only` would silently shrink the whole E2E suite to one test while
     `verify:push` still reported success. */
  forbidOnly: true,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.VITE_BASE_URL || `http://localhost:${port}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Block the PWA service worker so page.route() can intercept network
       requests (the SW otherwise handles fetches before Playwright sees them). */
    serviceWorkers: "block",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: {
    command: "VITE_MOCK_AUTH=true npm run build:vite && npm run start:prod",
    url: `http://localhost:${port}`,
    /* Never reuse. Same reasoning as `forbidOnly` above: with no CI this hook IS
       the gate, and any unrelated process squatting on the port would silently
       become the system under test — the whole suite then passes or fails
       against the wrong app. */
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
