# Welcome to the PBC Smart Contract Development Environment

This a development environment for the Partisia Blockchain, made for creating applications and smart
contracts utilizing the Zk Rust and public blockchain.

Read the documentation to better understand
[the fundamentals of the Partisia Blockchain](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/introduction-to-the-fundamentals.html)

To try this environment in your browser:

[![Open the Partisiablockchain/web-ide in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/JensScheel/web-ide/tree/main)

In the repo there are two contracts provided.
The [petition contact](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/petition?ref_type=heads)
and
the [average salary contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
in a dev-container, where all the tooling for developing smart contracts for the Partisia Blockchain are installed.

To run any premade task you need to press `F1` and write `Run Task` followed by an `enter press`. This gives you a list
of
all prescripted task within the development environment.

## It is an Automated setup

To interact with the Partisia Blockchain you need an account, the accounts are created with private keys for you as a user.
The environment provides you with three new accounts,
`Account-A.pk`, `Account-B.pk` and `Account-C.pk` upon creation.

The created accounts have test_coins pre-minted which gives you 100.000.000 gas on the Testnet to interact, deploy and
play around with as part of the dev-environment. You can continue using these outside of the dev environment.

## It is your own online personalized contract development environment

To use the environment to develop your own contracts, fork the repository.
On the fork you can start changing the contract code and commit those changes to
build smart contracts on Partisia Blockchain. 

Remember to set up a prebuild of the codespace, when forking the repository. This drastically decreases 
boot up time, when creating a new container. 

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

If you want to know more about the blockchain, ZK Rust or just contracts in general,
we urge you to visit our [documentation](https://partisiablockchain.gitlab.io/documentation/) and participate in [our active community on Discord](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).