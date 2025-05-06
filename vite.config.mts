// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { cwd } from 'node:process';

import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig, loadEnv } from 'vite';
import csp from 'vite-plugin-csp-guard';
import { ViteMinifyPlugin as minify } from 'vite-plugin-minify';

import type { UserConfig, UserConfigFnObject } from 'vite';

const list = browserslist();

// https://vite.dev/config/
const config = {
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: browserslistToEsbuild(list),
    cssMinify: 'lightningcss',
  },
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
    host: 'localhost',
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(list),
    },
  },
  plugins: [
    csp({
      // https://vite-csp.tsotne.co.uk/api-docs#options
      build: {
        sri: true,
      },
    }),
    minify({
      // https://www.npmjs.com/package/html-minifier-terser
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      decodeEntities: true,
      minifyCSS: true,
      quoteCharacter: "'",
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
    }),
  ],
} satisfies UserConfig;

const configFn: UserConfigFnObject = defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '');
  // https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker#1-use-the-localworkspacefolder-as-environment-variable-in-your-code
  if (env['CI'] || env['LOCAL_WORKSPACE_FOLDER']) {
    // https://vite.dev/guide/troubleshooting.html#dev-containers-vs-code-port-forwarding
    config.server.host = '127.0.0.1';
  }
  return config;
});

export default configFn;
