#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# lychee
#   Mac:
#     brew install lychee
#   Linux:
#     https://github.com/lycheeverse/lychee/issues/59

set -eu

readonly lychee_version='sha-874b0f0-alpine'

config_file="$PWD/lychee.toml"
dist_dir="$PWD/dist"
reports_dir="$PWD/reports/lychee"

if [ ! -f "${config_file}" ]; then
  printf "config file '%s' does not exist\n" "${config_file}" >&2
  exit 1
fi

if [ ! -d "${dist_dir}" ]; then
  printf "directory '%s' does not exist\n" "${dist_dir}" >&2
  exit 2
fi

mkdir -p "${reports_dir}"

if command -v lychee >/dev/null 2>&1; then
  readonly config_file
  readonly dist_dir
  readonly reports_dir

  if [ -n "${CI+x}" ] || [ -n "${LOCAL_WORKSPACE_FOLDER+x}" ] || [ -n "${GIT_PUSH_HOOK+x}" ]; then
    host_port='http://127.0.0.1:3000'
  else
    host_port='http://localhost:3000'
  fi
  readonly host_port

  lychee \
    --config "${config_file}" \
    --root-dir "${dist_dir}" \
    --output "${reports_dir}/report.md" \
    --remap "https://sdavids.de ${host_port}" \
    "${dist_dir}"
else
  # https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker#1-use-the-localworkspacefolder-as-environment-variable-in-your-code
  if [ -n "${LOCAL_WORKSPACE_FOLDER+x}" ]; then
    config_file="${LOCAL_WORKSPACE_FOLDER}/lychee.toml"
    dist_dir="${LOCAL_WORKSPACE_FOLDER}/dist"
    reports_dir="${LOCAL_WORKSPACE_FOLDER}/reports"
  fi
  readonly config_file
  readonly dist_dir
  readonly reports_dir

  readonly host_port='http://host.docker.internal:3000'

  # https://lychee.cli.rs/usage/config/
  # https://lychee.cli.rs/usage/cli/
  docker container run \
    --init \
    --tty \
    --interactive \
    --rm \
    --workdir /run/input \
    --read-only \
    --security-opt='no-new-privileges=true' \
    --cap-drop=all \
    --mount "type=bind,source=${dist_dir},target=/run/input,readonly" \
    --mount "type=bind,source=${config_file},target=/run/lychee.toml,readonly" \
    --mount "type=bind,source=${reports_dir},target=/run/reports" \
    "lycheeverse/lychee:${lychee_version}" \
    --config /run/lychee.toml \
    --root-dir /run/input \
    --output /run/reports/report.md \
    --remap "https://sdavids.de ${host_port}" \
    .
fi
