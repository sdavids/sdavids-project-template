// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import type { Config } from "prettier";

// https://prettier.io/docs/en/options.html
export default {
  // https://github.com/prettier/plugin-xml#configuration
  xmlQuoteAttributes: "double",
  xmlSortAttributesByKey: true,
  xmlWhitespaceSensitivity: "ignore",
} as Config;
