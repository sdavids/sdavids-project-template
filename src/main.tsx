// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { assertNonNullish } from "./lib/utils.ts";

import "./main.css";

const rootElement = document.getElementById("root");
assertNonNullish("unable to find DOM element #root", rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <main>
      <h1>sdavids-project-template</h1>
    </main>
  </StrictMode>,
);
