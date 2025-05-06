// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

import type { ViteUserConfig } from "vitest/config";

// https://vitest.dev/config/
const config: ViteUserConfig = defineConfig({
  test: {
    include: ["vitest/**/*.test.mts"],
    exclude: [],
    environment: "happy-dom",
    setupFiles: ["vitest/vitest-setup.mts"],
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
    alias: {
      "@src": resolve(import.meta.dirname, "./src"),
    },
  },
});

export default config;
