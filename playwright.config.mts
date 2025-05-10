// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import os from "node:os";
import { resolve } from "node:path";
import { access } from "fs/promises";
import { defineConfig, devices } from "@playwright/test";

import type { PlaywrightTestConfig, Project } from "playwright/types/test";

const baseUrl = process.env["PLAYWRIGHT_BASE_URL"] ?? "http://localhost:3000";
const isCi = Boolean(process.env["CI"]);
const isGitPushHook = Boolean(process.env["GIT_PUSH_HOOK"]);
const shouldRunBuild = Boolean(process.env["PW_RUN_BUILD"]);

// https://playwright.dev/docs/test-configuration
const projects: Project[] = [
  {
    name: "smoke",
    use: { ...devices["Desktop Chrome"], channel: "chromium" },
    testMatch: "**/*.smoke.test.mts",
  },
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], channel: "chromium" },
    testIgnore: "**/*.smoke.test.mts",
  },
  {
    name: "chromium-mobile",
    // https://endoflife.date/pixel
    use: { ...devices["Pixel 7"], channel: "chromium" },
    testIgnore: "**/*.smoke.test.mts",
  },
  {
    name: "chromium-mobile-landscape",
    // https://endoflife.date/pixel
    use: { ...devices["Pixel 7 landscape"], channel: "chromium" },
    testIgnore: "**/*.smoke.test.mts",
  },
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
    testIgnore: "**/*.smoke.test.mts",
  },
];

// https://endoflife.date/macos
const lastSupportedMacOsVersion = 22;
if (os.platform() === "darwin") {
  const release = os.release();
  const major = release.split(/\./u, 1).at(0);
  if (major !== release) {
    const m = Number(major);
    if (!isNaN(m) && m >= lastSupportedMacOsVersion) {
      projects.push({
        name: "safari",
        use: { ...devices["Desktop Safari"] },
        testIgnore: "**/*.smoke.test.mts",
      });
      projects.push({
        name: "safari-mobile",
        // https://endoflife.date/iphone
        use: { ...devices["iPhone 11"] },
        testIgnore: "**/*.smoke.test.mts",
      });
      projects.push({
        name: "safari-mobile-landscape",
        // https://endoflife.date/iphone
        use: { ...devices["iPhone 11 landscape"] },
        testIgnore: "**/*.smoke.test.mts",
      });
    }
  }
}

const cfg: PlaywrightTestConfig = {
  outputDir: ".playwright",
  testDir: "playwright/tests",
  fullyParallel: true,
  reporter: isCi
    ? "github"
    : [["html", { outputFolder: "reports/playwright" }]],
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  use: {
    baseURL: baseUrl,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "on-first-retry",
  },
  projects,
};

if (isCi) {
  cfg.workers = 1;
}

const shouldStartWebServer = isCi || isGitPushHook;
if (shouldStartWebServer) {
  let command = "node --run preview";
  if (shouldRunBuild) {
    command = `node --run build && ${command}`;
  } else {
    const distDir = resolve(import.meta.dirname, "dist");
    try {
      await access(distDir);
    } catch {
      console.error(`${distDir} does not exist - execute 'node --run build'`);
      process.exit(1);
    }
  }
  cfg.webServer = {
    command,
    url: `http://${isGitPushHook ? "localhost" : "127.0.0.1"}:3000`,
    reuseExistingServer: false,
  };
}

const config: PlaywrightTestConfig = defineConfig(cfg);

export default config;
