# Welcome to the PBC Smart Contract Development Environment

To boot the environment in your browser:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/JensScheel/web-ide/tree/main)

In the repo there are two contracts provided.
The [petition contact](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/petition?ref_type=heads)
and
the [average salary contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
in a dev-container, where all the tooling for developing smart contracts for the Partisia Blockchain are installed.

## Setup

To interact with the Partisia Blockchain there are provided three new keys, A.pk, B.pk and C.pk in
the .vscode folder.
The created keys have been filled with 100.000.000 gas on the Testnet,
as a part of the environment boot-up.

## Its your personalized contract development

To use the environment to develop your own contracts, fork the repository. Now you can change the
contract code and save those changes.

For local development see how to do it through
the [dev container documentation](https://code.visualstudio.com/docs/devcontainers/containers).

## Try, Learn and Interact

There are 2 challenge based guides as part of your development environment.

The first one explores the [public smart contracts](tutorial/public-contract-example.md),
how to deploy and interact with them.

The second one explores the superpower of Partisia Blockchain: [The Zk contracts](tutorial/zk-contract-example.md), here
you can test how to deploy,
how you can provide secure and private input and how to start a zero knowledge computation.

Along with the two contracts, there are two frontend clients, which can be started and linked to a deployed
contract. These are meant as examples for how to integrate contract interaction with a web application.