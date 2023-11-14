# syntax=docker/dockerfile:1.6
ARG RUST_VERSION=1.72
FROM registry.gitlab.com/partisia/dockerimages/rustmaven:${RUST_VERSION}
LABEL authors="Partisia"

##ARG EXAMPLE_VERSION=
USER 0

RUN cargo install cargo-partisia-contract

COPY --from=node:18 /usr/local/bin/ /usr/local/bin
COPY --from=node:18 /usr/local/lib/ /usr/local/lib
COPY --from=node:18 /usr/local/share/ /usr/local/share
COPY --from=node:18 /usr/local/include/ /usr/local/include
COPY --from=node:18 /opt/ /opt
