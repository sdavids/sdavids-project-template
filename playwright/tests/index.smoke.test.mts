// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/test";

test.describe("index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have a title", async ({ page }) => {
    await expect(page).toHaveTitle("sdavids-project-template");
  });
});
