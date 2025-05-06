#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly base_dir="${1:-$PWD}"

if [ ! -d "${base_dir}" ]; then
  printf "The directory '%s' does not exist.\n" "${base_dir}" >&2
  exit 1
fi

cd "${base_dir}"

if [ ! -d 'node_modules' ]; then
  npm ci --silent --ignore-scripts=true --fund=false
fi

# https://prettier.io/docs/configuration#typescript-configuration-files
NODE_OPTIONS="--experimental-strip-types --disable-warning=ExperimentalWarning" npx --yes --quiet prettier --config prettier.config.mts --plugin=@prettier/plugin-xml --log-level warn --cache --check .
