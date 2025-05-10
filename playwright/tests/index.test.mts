// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "../util/colors.mts";

test.describe("index - a11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toStrictEqual([]);
  });

  test("should have a stable aria tree", async ({ page }) => {
    await expect(page.getByRole("main")).toMatchAriaSnapshot(`
      - main:
        - heading "sdavids-project-template" [level=1]
    `);
  });
});

test.describe("index - light mode", () => {
  test.use({ colorScheme: "light" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have dark heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "sdavids-project-template" }),
    ).toHaveColor("rgb(0, 0, 0)");
  });

  test("should have light background", async ({ page }) => {
    await expect(page.locator("body")).toHaveBackgroundColor(
      "rgb(255, 255, 255)",
    );
  });
});

test.describe("index - dark mode", () => {
  test.use({ colorScheme: "dark" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have light heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "sdavids-project-template" }),
    ).toHaveColor("rgb(255, 255, 255)");
  });

  test("should have dark background", async ({ page }) => {
    await expect(page.locator("body")).toHaveBackgroundColor("rgb(0, 0, 0)");
  });
});
