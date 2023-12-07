# syntax=docker/dockerfile:1
# check=error=true

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://docs.docker.com/engine/reference/builder/

### builder ###

# https://hub.docker.com/_/golang/
FROM golang:1.24.0-alpine3.21 AS builder

RUN adduser \
      --uid 10001 \
      --gecos app \
      --home /dev/null \
      --shell /sbin/nologin \
      --no-create-home \
      --disabled-password \
      app

WORKDIR /app

COPY go.sum go.mod ./

RUN go mod download

COPY cmd cmd

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags '-s -w -B none' -buildvcs=false -o target/sdavids-project-template cmd/sdavids-project-template.go

LABEL de.sdavids.docker.group="sdavids-project-template" \
      de.sdavids.docker.type="builder"

### final ###

# https://hub.docker.com/_/alpine/
FROM alpine:3.21.3

COPY --from=builder /etc/passwd /etc/group /etc/
COPY --from=builder \
  /app/target/sdavids-project-template \
  /usr/local/bin/sdavids-project-template

USER "app:app"

WORKDIR /tmp

CMD ["sdavids-project-template"]

# https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.vendor="Sebastian Davids" \
      org.opencontainers.image.title="sdavids-project-template" \
      de.sdavids.docker.group="sdavids-project-template" \
      de.sdavids.docker.type="production"
