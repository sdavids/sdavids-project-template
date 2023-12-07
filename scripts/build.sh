#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly base_dir="${1:-$PWD}"

cd "${base_dir}"

go build -o target/sdavids-project-template cmd/sdavids-project-template.go
