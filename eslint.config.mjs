// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

// https://eslint.org/docs/latest/use/configure/configuration-files

import globals from 'globals';
import js from '@eslint/js';
import json from '@eslint/json';
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
    ignores: ['package-lock.json'],
    language: 'json/json',
    plugins: {
      json,
    },
    ...json.configs.recommended,
    name: 'eslint/json/recommended',
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
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'no-continue': 'off',
      'no-magic-numbers': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_$' }],
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
];
