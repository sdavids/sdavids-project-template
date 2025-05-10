#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker#1-use-the-localworkspacefolder-as-environment-variable-in-your-code
if [ -n "${LOCAL_WORKSPACE_FOLDER+x}" ]; then
  npx --yes --quiet playwright show-report --host 0.0.0.0 reports/playwright
else
  npx --yes --quiet playwright show-report reports/playwright
fi
