import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:5173", channel: "chrome" },
  webServer: [
    {
      command: "npm run dev -w @brightplan/desktop -- --port 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "python3 -m http.server 8082 --bind 127.0.0.1 --directory apps/mobile/dist-web",
      url: "http://127.0.0.1:8082",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "python3 -m http.server 6007 --bind 127.0.0.1 --directory apps/desktop/storybook-static",
      url: "http://127.0.0.1:6007",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
