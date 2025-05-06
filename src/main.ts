// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { assertNonNullish } from "./lib/utils.ts";

import "./main.css";

const rootElement = document.getElementById("root");
assertNonNullish("unable to find DOM element #root", rootElement);

rootElement.innerHTML = `
<main>
  <h1>sdavids-project-template</h1>
</main>
`;
