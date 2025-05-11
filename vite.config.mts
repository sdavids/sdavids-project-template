// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { cwd } from "node:process";

import browserslist from "browserslist";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { browserslistToTargets } from "lightningcss";
import { defineConfig, loadEnv } from "vite";
import csp from "vite-plugin-csp-guard";
import { ViteMinifyPlugin as minify } from "vite-plugin-minify";
import sitemap from "vite-plugin-sitemap";
import viteReact from "@vitejs/plugin-react";

import type { UserConfig, UserConfigFnObject } from "vite";

const list = browserslist();

// https://vite.dev/config/
const plugins = [
  viteReact(),
  csp({
    // https://vite-csp.tsotne.co.uk/api-docs#options
    build: {
      sri: true,
    },
  }),
];

const cfg = {
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    target: browserslistToEsbuild(list),
    cssMinify: "lightningcss",
    minify: "terser",
  },
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "localhost",
    // https://vite.dev/config/server-options.html#server-allowedhosts
    // https://docs.docker.com/desktop/features/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
    allowedHosts: ["localhost", "host.docker.internal"],
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(list),
    },
  },
  plugins,
} satisfies UserConfig;

const configFn: UserConfigFnObject = defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");
  const isCi = env["CI"];
  const isGitPushHook = env["GIT_PUSH_HOOK"];
  // https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker#1-use-the-localworkspacefolder-as-environment-variable-in-your-code
  const isDevContainer = env["LOCAL_WORKSPACE_FOLDER"];

  if (isCi || isDevContainer || isGitPushHook) {
    // https://vite.dev/guide/troubleshooting.html#dev-containers-vs-code-port-forwarding
    cfg.server.host = "127.0.0.1";
  }

  if (mode === "production") {
    const epoch = Number(process.env["SOURCE_DATE_EPOCH"]);
    const lastmod = Number.isInteger(epoch)
      ? new Date(epoch * 1000)
      : new Date();

    const disallowedRobots = [
      "AI2Bot",
      "Adsbot-Google",
      "AhrefsBot",
      "Applebot-Extended",
      "BLEXBot",
      "Baiduspider",
      "Bytespider",
      "CCBot",
      "Claude-Web",
      "ClaudeBot",
      "DataForSeoBot",
      "Diffbot",
      "FacebookBot",
      "GPTBot",
      "Google-Extended",
      "ImagesiftBot",
      "Kangaroo Bot",
      "LCC",
      "MJ12bot",
      "Meta-ExternalAgent",
      "PanguBot",
      "PerplexityBot",
      "SemrushBot",
      "SirdataBot",
      "Timpibot",
      "TurnitinBot",
      "Webzio-Extended",
      "Yeti",
      "anthropic-ai",
      "cohere-ai",
      "cohere-training-data-crawler",
      "dotbot",
      "magpie-crawler",
      "omgili",
      "omgilibot",
      "sentibot",
    ]
      .sort()
      .map((a) => ({
        userAgent: a,
        disallow: "/",
      }));

    const crawlDelayRobots = [
      "Googlebot",
      "Google-Site-Verification",
      "bingbot",
      "Yandex",
      "Qwantify",
      "DuckDuckBot",
    ]
      .sort()
      .map((a) => ({
        userAgent: a,
        crawlDelay: 2,
      }));

    const robots = [
      ...disallowedRobots,
      ...crawlDelayRobots,
      {
        userAgent: "*",
        crawlDelay: 42,
      },
    ];

    plugins.push(
      sitemap({
        hostname: "https://sdavids.de",
        lastmod,
        robots,
        xmlns: {
          news: false,
          xhtml: false,
          image: false,
          video: false,
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
    );
  }

  return cfg;
});

export default configFn;
