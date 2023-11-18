# The DApp Playground for Partisia Blockchain

This a development environment for the Partisia Blockchain, made for creating applications and smart
contracts utilizing the Zk Rust and public blockchain.

Read here how
to [create a codespace for a repository](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository#creating-a-codespace-for-a-repository),
select the `main` branch, when creating a codespace.

Read the documentation to better understand
[the fundamentals of the Partisia Blockchain](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/introduction-to-the-fundamentals.html)

The repo contains two simple smart contracts with simple front-ends:
The [petition contact](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/petition?ref_type=heads)
and
the [average salary contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
This is provided in a dev-container, where all the tooling needed for developing smart contracts and
front-ends is installed.

To run any premade task you need to press `Ctrl+Shift+B`. This gives you a list
of
all prescripted tasks within the development environment.

## It is an Automated setup

To interact with the Partisia Blockchain you need an account, the accounts are created with private
keys for you as a user.
The environment provides you with three new accounts,
`Account-A.pk`, `Account-B.pk` and `Account-C.pk` upon creation.

Read how addresses works
for [accounts and smart contracts](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/dictionary.html#address).

The created accounts have test_coins pre-minted which gives you 100.000.000 gas on the Testnet to
interact, deploy and
play around with as part of the dev-environment. You can continue using these outside of the dev
environment,
just remember the private keys, because they are not saved when you delete the container.

## It is your own online personalized contract development environment

To use the environment to develop your own contracts, fork the repository.
On the fork you can start changing the contract code and commit those changes to
build smart contracts on Partisia Blockchain.

You can see how to use codespaces in a forked repository in
this [article](https://www.freecodecamp.org/news/how-to-make-your-first-open-source-contribution/).

When forking the repository you can drastically decrease boot up time for new dev containers
by [configuring prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/configuring-prebuilds).

For local development see how to do it through
the [dev container documentation](https://code.visualstudio.com/docs/devcontainers/containers).

## Try, Learn and Interact with Partisia Blockchain

There are 2 challenge-based tutorials as part of your development environment.

The first one explores the [public smart contracts](tutorial/public-contract-example.md),
this example shows you how to deploy and interact with public smart contracts.

The second one explores the superpower of Partisia
Blockchain: [The Zk contracts](tutorial/zk-contract-example.md), here
you can test how to deploy,
how to provide secure and private input and how to start a zero knowledge computation.

Along with the two contracts, there are two frontend clients, which can be started and linked to a
deployed contract.
These are meant as examples for how to integrate contract interaction with a web
application.

If you want to know more about the blockchain, ZK Rust or just contracts in general,
we urge you to visit our [documentation](https://partisiablockchain.gitlab.io/documentation/) and
participate
in [our active community on Discord](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).
