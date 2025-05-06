// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest";

import { assertNonNullish } from "@src/lib/utils.ts";

describe("assertNonNullish", () => {
  it("throws on null", () => {
    const message = "fail";

    expect(() => assertNonNullish(message, null)).toThrow(message);
  });

  it("does not throw on non-null", () => {
    expect(() => assertNonNullish("should not fail", "")).not.toThrow();
  });
});
