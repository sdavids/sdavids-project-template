// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import type { Configuration } from "lint-staged";

// https://github.com/okonet/lint-staged#configuration
export default {
  "*.{ts,tsx}": (stagedFiles) => [
    `prettier --check ${stagedFiles.join(" ")}`,
    `eslint ${stagedFiles.join(" ")}`,
    "tsc --project src/tsconfig.prod.json",
  ],
  "*.mts": (stagedFiles) => [
    `prettier --check ${stagedFiles.join(" ")}`,
    `eslint ${stagedFiles.join(" ")}`,
    "tsc --project tsconfig.prod.json",
  ],
  "*.{css,html,json}": ["prettier --check"],
  "*.yaml": ["prettier --check", "yamllint --strict"],
  "*.svg": [
    "prettier --config prettier.config.mts --plugin=@prettier/plugin-xml --check",
  ],
  "*.sh": [
    "shellcheck",
    "shfmt --diff --indent 2 --case-indent --binary-next-line --simplify",
  ],
  Dockerfile: ["hadolint --no-color"],
} as Configuration;
