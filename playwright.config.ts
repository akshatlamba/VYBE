import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3001",
    channel: "chrome",
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
});
