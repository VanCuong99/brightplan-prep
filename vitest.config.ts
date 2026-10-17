import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: { dedupe: ["react", "react-dom"] },
  test: {
    environment: "jsdom",
    setupFiles: ["./apps/desktop/src/test-setup.ts"],
    include: [
      "shared/**/*.test.ts",
      "exercises/**/*.test.ts",
      "apps/desktop/src/**/*.test.tsx",
    ],
  },
});
