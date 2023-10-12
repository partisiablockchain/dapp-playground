# syntax=docker/dockerfile:1.6
ARG RUST_VERSION=1.72
FROM registry.gitlab.com/partisia/dockerimages/rustmaven:${RUST_VERSION}
LABEL authors="Partisia"

##ARG EXAMPLE_VERSION=
USER 0

ADD --keep-git-dir=true https://gitlab.com/partisiablockchain/language/example-contracts.git#main /build/example-contracts

RUN cargo install cargo-partisia-contract

WORKDIR /build/example-contracts

RUN cargo partisia-contract build --release

WORKDIR /build/example-contracts/java-test

RUN mvn test-compile
