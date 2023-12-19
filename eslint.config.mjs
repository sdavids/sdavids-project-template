// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import globals from "globals";
import js from "@eslint/js";
import json from "@eslint/json";
import css from "@eslint/css";
import compat from "eslint-plugin-compat";
import { configs as dependConfigs } from "eslint-plugin-depend";
import { flatConfigs as importConfigs } from "eslint-plugin-import-x";

// https://eslint.org/docs/latest/use/configure/configuration-files
export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    name: "global/report-unused",
  },
  {
    files: ["**/*.json"],
    ignores: [
      ".devcontainer/devcontainer.json",
      ".devcontainer/devcontainer-lock.json",
    ],
    language: "json/json",
    plugins: {
      json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
    name: "eslint/json/recommended",
  },
  {
    files: [".devcontainer/devcontainer.json"],
    language: "json/jsonc",
    plugins: {
      json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
    name: "eslint/jsonc/recommended",
  },
  {
    files: ["**/*.css"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      ...css.configs.recommended.rules,
      // https://github.com/eslint/css/pull/177
      "css/no-invalid-properties": "off",
      // "css/no-invalid-properties": [
      //   "error",
      //   {
      //     allowUnknownVariables: true,
      //   },
      // ],
      "css/prefer-logical-properties": "error",
      // https://github.com/eslint/css/issues/193
      // "css/relative-font-units": [
      //   "error",
      //   {
      //     allowUnits: ["rem"],
      //   },
      // ],
      "css/use-baseline": [
        "error",
        {
          // align with js config below and
          // esbuild_target in build.sh and
          // compilerOptions.target and .lib in jsconfig.json
          available: 2022,
        },
      ],
    },
    name: "eslint/css/recommended",
  },
  {
    files: ["**/*.{js,mjs}"],
    ...js.configs.all,
    name: "eslint/js/all",
  },
  {
    files: ["src/j/*.js", "src/j/**/*.js"],
    ...compat.configs["flat/recommended"],
    name: "eslint/browser-compat",
  },
  importConfigs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    rules: {
      "import-x/exports-last": "error",
      "import-x/extensions": ["error", "ignorePackages"],
      "import-x/first": "error",
      "import-x/group-exports": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-absolute-path": "error",
      "import-x/no-deprecated": "error",
      "import-x/no-empty-named-blocks": "error",
      "import-x/no-mutable-exports": "error",
      "import-x/no-named-as-default": "error",
      "import-x/no-named-as-default-member": "error",
      "import-x/no-named-default": "error",
      "import-x/no-namespace": "error",
      "import-x/no-self-import": "error",
      "import-x/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
      "import-x/no-useless-path-segments": "error",
      "import-x/order": "error",
    },
    name: "eslint/js/import",
  },
  dependConfigs["flat/recommended"],
  {
    files: ["**/*.{js,mjs}"],
    rules: {
      "capitalized-comments": "off",
      "func-names": ["error", "always", { generators: "as-needed" }],
      "id-length": "off",
      "line-comment-position": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "multiline-comment-style": "off",
      "no-continue": "off",
      "no-inline-comments": "off",
      "no-magic-numbers": "off",
      "no-param-reassign": "off",
      "no-plusplus": "off",
      "no-shadow": "off",
      "no-ternary": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-warning-comments": "off",
      "one-var": "off",
      "prefer-destructuring": ["error", { object: true, array: false }],
      radix: "off",
      "sort-keys": "off",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "sort-vars": "off",
    },
    name: "sdavids/js/defaults",
  },
  {
    files: ["src/j/*.js", "src/j/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        // align with css config above and
        // esbuild_target in build.sh and
        // compilerOptions.target and .lib in jsconfig.json
        ecmaVersion: 2022,
      },
    },
    rules: {
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      "import-x/no-nodejs-modules": "error",
    },
    name: "sdavids/js/browser",
  },
  {
    files: ["*.mjs", ".husky/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
      },
    },
    rules: {
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
    name: "sdavids/js/node",
  },
];
