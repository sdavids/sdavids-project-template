# syntax=docker/dockerfile:1
# check=error=true

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://docs.docker.com/engine/reference/builder/

### HTTP server ###

# https://hub.docker.com/_/busybox
FROM busybox:1.37.0-musl AS http_server

COPY --chown=www-data:www-data src /home/www-data

# https://boxmatrix.info/wiki/Property:httpd
CMD ["httpd", "-v", "-f", "-p", "3000", "-h", "/home/www-data"]

EXPOSE 3000

# https://boxmatrix.info/wiki/Property:wget
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s \
    CMD wget -q -T 3 --spider 'http://localhost:3000/' || exit 1

LABEL de.sdavids.docker.group="de.sdavids.template" \
      de.sdavids.docker.type="builder"

### final ###

FROM http_server

# https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.vendor="Sebastian Davids" \
      org.opencontainers.image.title="sdavids-project-template" \
      de.sdavids.docker.group="de.sdavids.template" \
      de.sdavids.docker.type="development"
