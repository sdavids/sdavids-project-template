// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

// https://eslint.org/docs/latest/use/configure/configuration-files

import globals from 'globals';
import js from '@eslint/js';
import json from '@eslint/json';
import css from '@eslint/css';
import markdown from '@eslint/markdown';
import compat from 'eslint-plugin-compat';

// noinspection JSUnusedGlobalSymbols
export default [
  {
    files: ['**/*.{js,mjs}'],
    ...js.configs.all,
    name: 'eslint/js/all',
  },
  {
    files: ['**/*.json'],
    ignores: [
      'package-lock.json',
      '.devcontainer/devcontainer.json',
      '.devcontainer/devcontainer-lock.json',
    ],
    language: 'json/json',
    plugins: {
      json,
    },
    ...json.configs.recommended,
    name: 'eslint/json/recommended',
  },
  {
    files: ['.devcontainer/devcontainer.json'],
    language: 'json/jsonc',
    plugins: {
      json,
    },
    ...json.configs.recommended,
    name: 'eslint/jsonc/recommended',
  },
  {
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    ...css.configs.recommended,
    name: 'eslint/css/recommended',
  },
  {
    files: ['**/*.md'],
    language: 'markdown/gfm',
    plugins: {
      markdown,
    },
    name: 'eslint/markdown/recommended',
  },
  {
    files: ['src/j/*.js', 'src/j/**/*.js'],
    ...compat.configs['flat/recommended'],
    name: 'eslint/browser-compat',
  },
  {
    files: ['**/*.{js,mjs}'],
    rules: {
      'capitalized-comments': 'off',
      'func-names': ['error', 'always', { generators: 'as-needed' }],
      'id-length': 'off',
      'line-comment-position': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'multiline-comment-style': 'off',
      'no-continue': 'off',
      'no-inline-comments': 'off',
      'no-magic-numbers': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'no-ternary': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-warning-comments': 'off',
      'one-var': 'off',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'sort-keys': 'off',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-vars': 'off',
      radix: 'off',
    },
    name: 'sdavids/js/defaults',
  },
  {
    files: ['src/j/*.js', 'src/j/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    name: 'sdavids/js/browser',
  },
  {
    files: ['*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        // https://node.green/#ES2024
        ecmaVersion: 2024,
      },
    },
    name: 'sdavids/js/node',
  },
];
