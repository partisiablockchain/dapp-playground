# PBC Smart Contract Development Environment

To boot the environment in your browser: 

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/JensScheel/web-ide/tree/main)


In the repo there are two contracts provided. 
The [petition contact](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/petition?ref_type=heads)
and the [average salary contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
in a dev-container, where all the tooling for developing smart contracts for the Partisia Blockchain are installed.

## Use for own contract development

To use the environment to develop your own contracts, fork the repository. Now you can change the
contract code and save those changes. 

For local development see the [dev container documentation](https://code.visualstudio.com/docs/devcontainers/containers).

## Setup
To interact with the Partisia Blockchain there are provided three new keys, A.pk, B.pk and C.pk.
The keys have been filled with 100.000.000 gas on the Testnet, as a part of the environment boot-up.


## Tasks

There is a list of predefined tasks available in the container. 
These are examples of how the different tools can be used, and how to call them. 
To find the list of tasks press 'F1' and search for "Tasks: Run Task" and click it.

There are seven tasks predefined in the sandbox.

Tasks: 

#### Compile All Contracts

Compiles all the contracts.

#### Compile Contract

Compiles the contract in the folder of the file currently displayed in the editor.

#### Deploy Petition Contract

Deploys the Petition contract to testnet.

#### Sign Petition

Sign the deployed Petition contract with the secret key for a given person, the task will
prompt for 

#### Deploy an Average salary contract (ZK contract)

Deploys an Average salary contract to testnet.

#### Send a salary as a secret input to an average salary contract.

Send a secret input from a given account to a given deployed average salary contract, so it can be
included in the Zk computation.

#### Compute average salary, starting the ZK computation.

Start the computation of the average salary, can only be called by the owner of the contract, i.e.
must be sent by the account that deployed the contract. 
There must also be at least 3 inputs added to the contract to compute.

#### Show the ABI for a contract.

Show the ABI structure for a contract. Prompts for the name of the contract to show.