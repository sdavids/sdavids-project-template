#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly container_name='sdavids-project-template-rust'

if [ -n "$(docker container ls --all --quiet --filter="name=^/${container_name}$")" ]; then
  docker container stop "${container_name}" >/dev/null
fi

# container not started with --rm ?
if [ -n "$(docker container ls --all --quiet --filter="name=^/${container_name}$")" ]; then
  docker container remove --force --volumes "${container_name}" >/dev/null
fi
