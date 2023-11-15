# Welcome to the PBC Smart Contract Development Environment

To boot the environment in your browser:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/JensScheel/web-ide/tree/main)

In the repo there are two contracts provided.
The [petition contact](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/petition?ref_type=heads)
and
the [average salary contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
in a dev-container, where all the tooling for developing smart contracts for the Partisia Blockchain are installed.

To run any premade task you need to press `F1` and write `Run Task` followed by an `enter press`. This gives you a list of
all prescripted task within the development environment.

## Its an Automated setup

To interact with the Partisia Blockchain you need an account, the accounts are created as privatekeys for you as a user.
This dev
container provides you with three new accounts: AccountA.pk, AccountB.pk and AccountC.pk
in the .vscode folder.

The created accounts have test_coins pre-minted which gives you 100.000.000 gas on the Testnet to interact, deploy and
play around with as part of the dev-environment. You can continue using these outside of the dev environment.

## Its your own online personalized contract development environment

To use the environment to develop your own contracts, fork the repository. On the fork you can start changing the
contract code and save those changes to build smart contracts on Partisia Blockchain.

For local development see how to do it through
the [dev container documentation](https://code.visualstudio.com/docs/devcontainers/containers).

## Try, Learn and Interact with Partisia Blockchain

There are 2 challenge based tutorials as part of your development environment.

The first one explores the [public smart contracts](tutorial/public-contract-example.md),
this example shows you how to deploy and interact with public smart contracts.

The second one explores the superpower of Partisia Blockchain: [The Zk contracts](tutorial/zk-contract-example.md), here
you can test how to deploy,
how to provide secure and private input and how to start a zero knowledge computation.

Along with the two contracts, there are two frontend clients, which can be started and linked to a deployed
contract. These are meant as examples for how to integrate contract interaction with a web application. 