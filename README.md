# PBC Smart Contract - Sandbox IDE

The Partisia Blockchain sandbox provides the [example contracts](https://gitlab.com/partisiablockchain/language/example-contracts) 
in a dev-container, where all the tooling for developing smart contracts for the Partisia Blockchain are installed.

To boot the sandbox in your browser, use the GitHub codespaces.
Click the 'Code' icon and 'Create codespace on main'.


## Setup

The contracts can compile and all the tests can be run.
To be able to make interaction with [TestNet](https://browser.testnet.partisiablockchain.com/transactions), please create
and acquire gas for 3 accounts on TestNet. 
Add one secret key to each of the three '.pk' files in the ".vscode" folder.


## Tasks

There is a list of predefined tasks available in the container. 
These are examples of how the different tools can be used, and how to call them. 
To find the list of tasks press 'F1' and search for "Tasks: Run Task" and click it.

There are seven tasks predefined in the sandbox.

Tasks: 

* "Compile All Contracts"

Compiles all the contracts.

* "Compile Contract"

Compiles the contract in the folder of the file currently displayed in the editor.

* "Run Java Tests"

Run all the java tests for the contracts. The test code is located in the "java-test" folder. 

* "Deploy Petition Contract"

Deploys the Petition contract to testnet, using the private key in '.vscode/A.pk'. 

* Sign Petition
  * "Sign petition for Person A"
  * "Sign petition for Person B"
  * "Sign petition for Person C"

Sign the deployed Petition contract with the secret key for a given person, the task will
prompt for an address for a deployed petition contract.

