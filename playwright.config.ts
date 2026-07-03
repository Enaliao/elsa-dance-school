import { defineConfig, devices } from "@playwright/test";

const e2ePort = process.env.E2E_PORT || "3100";
const e2eHost = process.env.E2E_HOST || "127.0.0.1";
const e2eBaseURL = `http://${e2eHost}:${e2ePort}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: e2eBaseURL,
    trace: "on-first-retry"
  },
  webServer: {
    command: `npx next dev --hostname ${e2eHost} --port ${e2ePort}`,
    env: {
      ...process.env,
      NEXT_DIST_DIR: ".next-e2e",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || ""
    },
    url: e2eBaseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] }
    }
  ]
});
