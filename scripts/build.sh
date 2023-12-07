#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly base_dir="${1:-$PWD}"

if [ ! -d "${base_dir}" ]; then
  printf "The directory '%s' does not exist.\n" "${base_dir}" >&2
  exit 1
fi

version="$(git describe --always --dirty --tags)"
readonly version

cd "${base_dir}"

CGO_ENABLED=0 go build -ldflags "-X main.Version=${version}" -o target/sdavids-project-template main.go
