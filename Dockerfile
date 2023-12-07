# syntax=docker/dockerfile:1
# check=error=true

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://docs.docker.com/engine/reference/builder/

### builder ###

# https://hub.docker.com/_/golang/
FROM golang:1.24.4-alpine3.22 AS builder

RUN adduser \
      --uid 10001 \
      --gecos app \
      --home /home/app \
      --shell /sbin/nologin \
      --disabled-password \
      app

WORKDIR /home/app

COPY go.mod go.sum ./

RUN go mod download

COPY main.go main.go

COPY internal internal

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w -B none -extldflags '-static'" -buildvcs=false -o target/sdavids-project-template main.go

LABEL de.sdavids.docker.group="sdavids-project-template" \
      de.sdavids.docker.type="builder"

### final ###

# https://hub.docker.com/_/alpine/
FROM alpine:3.22.0

COPY --from=builder /etc/passwd /etc/group /etc/
COPY --from=builder \
  /home/app/target/sdavids-project-template \
  /usr/local/bin/sdavids-project-template

ENV HOST=0.0.0.0

EXPOSE 3000

USER app

WORKDIR /home/app

CMD ["sdavids-project-template"]

# https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.vendor="Sebastian Davids" \
      org.opencontainers.image.title="sdavids-project-template" \
      de.sdavids.docker.group="sdavids-project-template" \
      de.sdavids.docker.type="production"
