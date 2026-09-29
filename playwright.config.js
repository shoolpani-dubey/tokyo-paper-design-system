import { defineConfig, devices } from "@playwright/test";

// Pages are opened straight from disk (file://), so no server is needed.
// Set PLAYWRIGHT_CHANNEL=chrome to use an installed Chrome instead of
// Playwright's own Chromium (npx playwright install chromium).
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    ...devices["Desktop Chrome"],
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
});
