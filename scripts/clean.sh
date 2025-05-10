#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly base_dir="${1:-$PWD}"

readonly build_dir="${base_dir}/dist"
readonly eslint_cache_file="${base_dir}/node_modules/.cache/eslint/.eslintcache"
readonly prettier_cache_file="${base_dir}/node_modules/.cache/prettier/.prettier-cache"
readonly ts_build_info_file="${base_dir}/node_modules/.cache/tsc/.tsbuildcache"
readonly reports_dir="${base_dir}/reports"
readonly playwright_dir="${base_dir}/.playwright"
readonly lhci_dir="${base_dir}/.lighthouseci"

rm -rf "${build_dir}" \
  "${eslint_cache_file}" \
  "${prettier_cache_file}" \
  "${ts_build_info_file}" \
  "${reports_dir}" \
  "${playwright_dir}" \
  "${lhci_dir}"
