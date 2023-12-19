#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://github.com/microsoft/vscode-dev-containers/issues/559
bash -i -c 'nvm install -b --no-progress && npm install --no-ignore-scripts --silent --fund=false'
