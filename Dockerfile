# syntax=docker/dockerfile:1
# check=error=true

# SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
# SPDX-License-Identifier: Apache-2.0

# https://docs.docker.com/engine/reference/builder/

### builder ###

# https://hub.docker.com/_/rust/
FROM rust:1.88.0-alpine3.22 AS builder

RUN apk add --no-cache musl-dev=1.2.5-r10 upx=5.0.0-r0

# https://doc.rust-lang.org/cargo/reference/environment-variables.html#environment-variables-cargo-reads
ENV CARGO_INCREMENTAL=0

RUN adduser \
      --uid 10001 \
      --gecos app \
      --home /dev/null \
      --shell /sbin/nologin \
      --no-create-home \
      --disabled-password \
      app

WORKDIR /tmp

# https://stackoverflow.com/a/58474618
RUN mkdir src && \
    echo "fn main() {}" >src/main.rs

COPY rust-toolchain.toml ./

COPY Cargo.toml ./

COPY Cargo.lock ./

RUN cargo build --release

COPY src src

RUN touch src/main.rs && \
    cargo build --release --offline && \
    upx --ultra-brute /tmp/target/release/sdavids-project-template

LABEL de.sdavids.docker.group="sdavids-project-template" \
      de.sdavids.docker.type="builder"

### final ###

# https://hub.docker.com/_/alpine/
FROM alpine:3.22.0

COPY --from=builder /etc/passwd /etc/group /etc/
COPY --from=builder \
  /tmp/target/release/sdavids-project-template \
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
