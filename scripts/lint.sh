#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# golangci-lint needs to be in $PATH
#
# https://golangci-lint.run/welcome/quick-start/
# https://github.com/golangci/golangci-lint/issues/2654#issuecomment-1606439587

set -eu

readonly base_dir="${1:-$PWD}"

if [ ! -d "${base_dir}" ]; then
  printf "The directory '%s' does not exist.\n" "${base_dir}" >&2
  exit 1
fi

cd "${base_dir}"

go list -f '{{.Dir}}/...' -m | xargs golangci-lint run
