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
    // coverage: {
    //   provider: "v8",
    //   // you can include other reporters, but 'json-summary' is required, json is recommended
    //   reporter: ["text", "json-summary", "json"],
    //   // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
    //   reportOnFailure: true,
    // },
  },
  plugins: [tsconfigPaths()],
});
