# syntax=docker/dockerfile:1.6
ARG RUST_VERSION=1.72
FROM registry.gitlab.com/partisia/dockerimages/rustmaven:${RUST_VERSION}
LABEL authors="Partisia"

##ARG EXAMPLE_VERSION=
USER 0

RUN cargo install cargo-partisia-contract
