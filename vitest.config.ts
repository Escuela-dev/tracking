import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./__tests__/setup.ts"],
    reporters: process.env.GITHUB_ACTIONS
      ? ["dot", "github-actions"]
      : ["default"],
  },
  plugins: [tsconfigPaths()],
});
