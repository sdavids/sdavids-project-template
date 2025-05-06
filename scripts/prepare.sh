#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

if [ -n "${CI+x}" ]; then
  exit 0
fi

npx --yes --quiet husky
