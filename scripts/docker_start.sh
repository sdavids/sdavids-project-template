#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly tag='local'

# https://docs.docker.com/reference/cli/docker/image/tag/#description
readonly namespace='de.sdavids'
readonly repository='sdavids-project-template'

readonly label_group='de.sdavids.docker.group'

readonly label="${label_group}=${repository}"

readonly image_name="${namespace}/${repository}"

readonly container_name='sdavids-project-template-rust'

readonly network_name=none

# to ensure ${label} is set, we use --label "${label}"
# which might overwrite the label ${label_group} of the image
docker container run \
  -a stdout \
  --rm \
  --read-only \
  --user app \
  --security-opt='no-new-privileges=true' \
  --cap-drop=all \
  --network="${network_name}" \
  --name "${container_name}" \
  --label "${label}" \
  "${image_name}:${tag}"