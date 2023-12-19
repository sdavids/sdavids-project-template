// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

// https://github.com/okonet/lint-staged#configuration

/** @type {import('lint-staged').Configuration} */
export default {
  "*.{js,mjs}": ["eslint --max-warnings 0"],
  "src/j/**/*.js": [() => "tsc --project jsconfig.prod.json"],
  "*.{css,html,js,json,mjs,yaml}": ["prettier --check"],
  "*.yaml": ["yamllint --strict"],
  "*.sh": [
    "shellcheck",
    "shfmt --diff --indent 2 --case-indent --binary-next-line --simplify",
  ],
  Dockerfile: ["hadolint"],
};
