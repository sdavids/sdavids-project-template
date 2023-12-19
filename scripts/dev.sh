#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly base_dir="${1:-$PWD}"

cd "${base_dir}"

if [ ! -d 'node_modules' ]; then
  npm ci --ignore-scripts=false --fund=false
fi

npx browser-sync "${base_dir}/src" -f "${base_dir}/src" --no-notify --no-ghost-mode
