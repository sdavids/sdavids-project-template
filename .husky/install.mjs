// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

// https://typicode.github.io/husky/how-to.html#ci-server-and-docker

/* eslint-disable dot-notation,no-console */

import { env, exit } from "node:process";

if (env["CI"] === "true" || env["NODE_ENV"] === "production") {
  exit(0);
}

const husky = (await import("husky")).default;

console.log(husky());
