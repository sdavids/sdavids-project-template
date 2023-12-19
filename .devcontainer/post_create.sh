#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

find . -type d -name node_modules -exec rm -rf {} +

curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION="$(jq -r .devEngines.packageManager.version package.json)" sh -

bash -i -c "pnpm env use --global $(perl <pnpm-workspace.yaml -n -e '/useNodeVersion: (.*)/ && print $1') && pnpm install"
