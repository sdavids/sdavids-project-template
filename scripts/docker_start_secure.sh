#!/usr/bin/env sh

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

set -eu

readonly https_port="${1:-3000}"

readonly tag='local'

# https://docs.docker.com/reference/cli/docker/image/tag/#description
readonly namespace='de.sdavids'
readonly repository='sdavids-project-template'

readonly label_group='de.sdavids.docker.group'

readonly label="${label_group}=${repository}"

readonly image_name="${namespace}/${repository}"

readonly container_name='sdavids-project-template-go'

readonly host_name='localhost'

readonly network_name='sdavids_project_template'

secrets_dir="$PWD/certs"

if [ ! -d "${secrets_dir}" ]; then
  printf "secrets directory '%s' does not exist\n\nExecute 'scripts/create_self_signed_cert.sh' then execute this script again.\n" "${secrets_dir}" >&2
  exit 1
fi

# https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker#1-use-the-localworkspacefolder-as-environment-variable-in-your-code
if [ -n "${LOCAL_WORKSPACE_FOLDER+x}" ]; then
  secrets_dir="${LOCAL_WORKSPACE_FOLDER}/certs"
fi
readonly secrets_dir

docker network inspect "${network_name}" >/dev/null 2>&1 \
  || docker network create \
    --driver bridge "${network_name}" \
    --label "${label_group}=${namespace}" >/dev/null

# to ensure ${label} is set, we use --label "${label}"
# which might overwrite the label ${label_group} of the image
docker container run \
  --init \
  --rm \
  --detach \
  --security-opt='no-new-privileges=true' \
  --cap-add=chown \
  --cap-add=setgid \
  --cap-add=setuid \
  --cap-drop=all \
  --network="${network_name}" \
  --publish "${https_port}:3000" \
  --env 'LOG_LEVEL=debug' \
  --env 'LOG_REQUESTS=true' \
  --env HTTPS_PORT=3000 \
  --env CERT_PATH=/run/secrets/cert.pem \
  --env KEY_PATH=/run/secrets/key.pem \
  --mount "type=bind,source=${secrets_dir},target=/run/secrets,readonly" \
  --name "${container_name}" \
  --label "${label}" \
  "${image_name}:${tag}" >/dev/null

readonly url="https://${host_name}:${https_port}"

printf '\nListen local: %s\n' "${url}"

if command -v pbcopy >/dev/null 2>&1; then
  printf '%s' "${url}" | pbcopy
  printf '\nThe URL has been copied to the clipboard.\n'
elif command -v xclip >/dev/null 2>&1; then
  printf '%s' "${url}" | xclip -selection clipboard
  printf '\nThe URL has been copied to the clipboard.\n'
elif command -v wl-copy >/dev/null 2>&1; then
  printf '%s' "${url}" | wl-copy
  printf '\nThe URL has been copied to the clipboard.\n'
fi
