// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import globals from "globals";
import js from "@eslint/js";
import json from "@eslint/json";
import css from "@eslint/css";
import tseslint, { configs } from "typescript-eslint";
import { configs as dependConfigs } from "eslint-plugin-depend";
import { flatConfigs as importConfigs } from "eslint-plugin-import-x";
import eslintReact from "@eslint-react/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

// https://eslint.org/docs/latest/use/configure/configuration-files
const cfg: FlatConfig.ConfigArray = tseslint.config(
  {
    ignores: [
      "dist",
      "package-lock.json",
      ".devcontainer/devcontainer-lock.json",
    ],
    name: "global/ignores",
  },
  {
    files: ["**/*.json"],
    ignores: [".devcontainer/devcontainer.json"],
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
      "css/use-baseline": [
        "error",
        {
          // align with js config below,
          // compilerOptions.target and .lib in src/tsconfig.json, and
          // browserslist-config-baseline.baselineYear in package.json
          available: 2022,
        },
      ],
      "css/use-layers": "error",
    },
    name: "eslint/css/recommended",
  },
  importConfigs.recommended,
  importConfigs.typescript,
  {
    files: ["**/*.{mts,ts}"],
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
    name: "eslint/ts/import",
  },
  {
    files: ["**/*.{mts,ts,tsx}"],
    ...js.configs.all,
    name: "eslint/ts/all",
  },
  {
    files: ["**/*.{mts,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    name: "eslint/ts/checked",
  },
  configs.strictTypeChecked,
  configs.stylisticTypeChecked,
  {
    files: ["**/*.css", "**/*.json"],
    extends: [configs.disableTypeChecked],
  },
  dependConfigs["flat/recommended"],
  {
    files: ["lint-staged.config.mts"],
    rules: {
      "depend/ban-dependencies": ["error", { allowed: ["lint-staged"] }],
    },
    name: "eslint/depend/allowed",
  },
  {
    files: ["src/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    settings: {
      react: {
        version: "19",
      },
    },
    name: "eslint/ts/react-version",
  },
  {
    files: ["src/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-type-checked"],
    name: "eslint/ts/react",
  },
  {
    files: ["src/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ...reactRefresh.configs.vite,
    name: "eslint/ts/react-refresh",
  },
  {
    files: ["src/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "jsx-a11y/lang": "error",
      "jsx-a11y/no-aria-hidden-on-focusable": "error",
      "jsx-a11y/prefer-tag-over-role": "error",
    },
    name: "eslint/ts/react-jsxA11y",
  },
  {
    files: ["**/*.{mts,ts,tsx}"],
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
    name: "sdavids/defaults/js",
  },
  {
    files: ["**/*.{mts,ts,tsx}"],
    rules: {
      "class-methods-use-this": "off",
      "@typescript-eslint/class-methods-use-this": "error",
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": "error",
      "init-declarations": "off",
      "@typescript-eslint/init-declarations": "off",
      "no-implied-eval": "off",
      "@typescript-eslint/no-implied-eval": "error",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "no-duplicate-imports": "off",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": "error",
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",
      "prefer-destructuring": "off",
      "@typescript-eslint/prefer-destructuring": "error",
      "prefer-promise-reject-errors": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "error",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "consistent-return": "off",
      "no-invalid-this": "off",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
    },
    name: "sdavids/ts/defaults",
  },
  {
    files: ["src/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        // align with css config above,
        // compilerOptions.target and .lib in src/tsconfig.json, and
        // browserslist-config-baseline.baselineYear in package.json
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
      "no-undefined": "off",
    },
    name: "sdavids/ts/browser",
  },
  {
    files: ["*.mts"],
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
      "no-console": "off",
    },
    name: "sdavids/ts/node",
  },
);

export default cfg;
