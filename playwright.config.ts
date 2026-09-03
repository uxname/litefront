import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
config({ quiet: true });

/* E2E runs the app on a port of its own, never the dev port from `.env`. Two
   failures come from sharing that port: whatever else is listening gets tested
   instead of the app, or — once reuse is off — an ordinary `npm run start:dev`
   blocks the pre-push gate. Override with E2E_PORT if 3100 is taken too. */
const e2ePort = Number(process.env.E2E_PORT) || 3100;
const e2eBaseURL = `http://localhost:${e2ePort}`;

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
    baseURL: e2eBaseURL,

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
    /* VITE_BASE_URL is baked into the bundle at build time (OIDC redirects read
       it), so the build and the server have to agree on the E2E port. */
    command: `VITE_MOCK_AUTH=true VITE_BASE_URL=${e2eBaseURL} npm run build:vite && PORT=${e2ePort} npm run start:prod`,
    url: e2eBaseURL,
    /* Never reuse. Same reasoning as `forbidOnly` above: with no CI this hook IS
       the gate, and a stranger on the port would silently become the system
       under test — the suite then passes or fails against the wrong app. */
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
