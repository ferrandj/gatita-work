# syntax=docker/dockerfile:1

# ---- 1. build the web app (type-check + production bundle) ----
FROM node:24-alpine AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build

# ---- 2. build the server (Rust, static binary) ----
FROM rust:1-alpine AS server
RUN apk add --no-cache musl-dev
WORKDIR /src
COPY server/Cargo.toml server/Cargo.lock ./
# cache the dependencies in their own layer
RUN mkdir src && echo 'fn main() {}' > src/main.rs && cargo build --release --locked && rm -rf src target/release/deps/gatita* target/release/gatita
COPY server/src ./src
RUN cargo build --release --locked && strip target/release/gatita

# ---- 3. runtime: the binary, the built app and the course content. Nothing else. ----
FROM alpine:3.22
ARG APP_VERSION=dev
ENV DATA_DIR=/data \
    PORT=8080 \
    PUBLIC_DIR=/app/public \
    CONTENT_DIR=/app/content \
    APP_VERSION=$APP_VERSION
WORKDIR /app
COPY --from=server /src/target/release/gatita /app/gatita
COPY --from=web /web/dist /app/public
# Lessons and exercises (plain text files). Files in /data/content are added on top of them.
COPY content /app/content

# /data holds EVERYTHING the user creates (progress, backups, course PDFs, extra content).
RUN mkdir -p /data
VOLUME ["/data"]

# The server starts as root only to look at who owns /data, then runs as that user (or as uid 1000 when Docker created
# the folder as root) BEFORE it listens on the network. So a NAS folder owned by any user just works.
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["/app/gatita", "healthcheck"]
CMD ["/app/gatita"]
