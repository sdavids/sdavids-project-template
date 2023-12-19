#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

if npx --yes --quiet is-ci; then
  exit 0
fi

npx --yes --quiet husky
