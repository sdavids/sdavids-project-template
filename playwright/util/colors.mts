// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { expect as baseExpect } from "@playwright/test";

import type {
  Expect,
  ExpectMatcherState,
  Locator,
  MatcherReturnType,
} from "@playwright/test";

export const expect: Expect<{
  toHaveColor(
    this: ExpectMatcherState,
    locator: Locator,
    expected: string | RegExp,
    options?: {
      timeout?: number;
    },
  ): Promise<MatcherReturnType>;
  toHaveBackgroundColor(
    this: ExpectMatcherState,
    locator: Locator,
    expected: string | RegExp,
    options?: {
      timeout?: number;
    },
  ): Promise<MatcherReturnType>;
}> = baseExpect.extend({
  async toHaveColor(
    locator: Locator,
    expected: string | RegExp,
    options?: {
      timeout?: number;
    },
  ): Promise<MatcherReturnType> {
    const assertionName = "toHaveColor";
    let pass = false;
    let matcherResult = null;
    try {
      // eslint-disable-next-line playwright/no-standalone-expect
      await baseExpect(locator).toHaveCSS("color", expected, options);
      pass = true;
    } catch (e) {
      // @ts-expect-error api uses any
      ({ matcherResult } = e);
    }
    const message = pass
      ? () =>
          // eslint-disable-next-line no-undefined
          `${this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot })}\n\n` +
          // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
          `Locator: ${locator}\n` +
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Expected: not ${this.utils.printExpected(expected)}\n${matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : ""}`
      : () =>
          // eslint-disable-next-line no-undefined
          `${this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot })}\n\n` +
          // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
          `Locator: ${locator}\n` +
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Expected: ${this.utils.printExpected(expected)}\n${matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : ""}`;
    return {
      message,
      pass,
      name: assertionName,
      expected,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      actual: matcherResult?.actual,
    };
  },
  async toHaveBackgroundColor(
    locator: Locator,
    expected: string | RegExp,
    options?: {
      timeout?: number;
    },
  ): Promise<MatcherReturnType> {
    const assertionName = "toHaveBackgroundColor";
    let pass = false;
    let matcherResult = null;
    try {
      // eslint-disable-next-line playwright/no-standalone-expect
      await baseExpect(locator).toHaveCSS(
        "background-color",
        expected,
        options,
      );
      pass = true;
    } catch (e) {
      // @ts-expect-error api uses any
      ({ matcherResult } = e);
    }
    const message = pass
      ? () =>
          // eslint-disable-next-line no-undefined
          `${this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot })}\n\n` +
          // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
          `Locator: ${locator}\n` +
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Expected: not ${this.utils.printExpected(expected)}\n${matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : ""}`
      : () =>
          // eslint-disable-next-line no-undefined
          `${this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot })}\n\n` +
          // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
          `Locator: ${locator}\n` +
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Expected: ${this.utils.printExpected(expected)}\n${matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : ""}`;
    return {
      message,
      pass,
      name: assertionName,
      expected,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      actual: matcherResult?.actual,
    };
  },
});
