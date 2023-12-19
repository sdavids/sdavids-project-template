// SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

// https://github.com/okonet/lint-staged#configuration

// noinspection JSUnusedGlobalSymbols
export default {
  '*.{cjs,js,mjs}': ['eslint'],
  '*.{cjs,css,html,js,json,mjs}': ['prettier --check'],
  '*.yaml': ['prettier --check', 'yamllint --strict'],
  '*.sh': ['shellcheck'],
  Dockerfile: ['hadolint --no-color'],
};
