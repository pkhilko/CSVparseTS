import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Use global test functions like `describe` and `it`
    coverage: {
      reporter: ["text", "json", "html"], // Generate coverage reports
    },
  },
});
