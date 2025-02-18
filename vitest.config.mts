import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    workspace: [
      {
        extends: true, // Inherit options from root config
        test: {
          globals: true,
          name: "frontend",
          include: ["__tests__/frontend/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },
      {
        extends: true, // Inherit options from root config
        test: {
          globals: true,
          name: "backend",
          include: ["__tests__/backend/**/*.{test,spec}.{ts,js}"],
          environment: "node",
        },
      },
    ],
    setupFiles: ["./__tests__/setupTests.ts"], // Global test setup
  },
});
