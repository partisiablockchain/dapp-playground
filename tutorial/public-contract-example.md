# A Public smart contract example - Petition Contract

This article is meant to run through the examples in web-ide and explain specific elements pertaining to Partisia
Blockchain system. It will not dive into rust macros or rust specific topics. If you need help translating rust elements
we recommend you visit [the rust standard library](https://doc.rust-lang.org/std/index.html)
or [the rust programming language book](https://doc.rust-lang.org/book/).

Throughout this example, when we write 'run task', then press 'F1', and search for 'Tasks: Run Task'.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy a Petition contract

Run the task "Deploy Petition Contract", the task will prompt asking for the account to deploy with,
and what the description for the Petition should be.

### Sign the Petition

Run the task "Sign Petition", the task will prompt asking for the account to sign the petition with 
and an address for a deployed petition contract.

### Use web client to view state and sign petition

Run the task "Start client for contract" and choose petition-client from the prompt.
This will start a web client able to talk to a petition contract. Input the address and click "Connect to contract".
If the address corresponds to a petition contract you should see your petition in the state section.
To sign the petition you need to sign in with an account that has gas. Copy your private key (A.pk, B.pk or C.pk)
into the form and click login using private key. You can now sign the petition by clicking the sign button.

## The structure of a smart contract

A smart contract consists of a state, actions and callbacks. To view the structure of the "Petition"
contract, run the task "Show the ABI for a contract", and choose the 'petition' option.

## State

The state of a contract is the initialization step of the contract. The state is often where you defined you data
structure and the macro `#[state]` must be given exactly once in any given contract.

In the case of the petition contract you can see that the macro is given followed by the definition of the struct with
two variables.

```rust
#[state]
pub struct PetitionState {
    signed_by: SortedVecSet<Address>,
    description: String,
}
```

The struct has two variables a description which is a string and
a [SortedVecSet](https://partisiablockchain.gitlab.io/language/contract-sdk/pbc_contract_common/sorted_vec_map/struct.SortedVecSet.html)
which is a vec that is sorted after the element type and can only hold unique elements. This specific SortedVecSet
holds [addresses](https://partisiablockchain.gitlab.io/language/contract-sdk/pbc_contract_common/address/index.html).

## Init

Init is the first action being called in a contract when being deployed. In this contract the `#init` macro ensures that
a description is sent to the contract to be displayed on the blockchain.

## Actions

Actions are functions that can be called on the blockchain. There can be multiple actions within a smart contract. An
action can use the state as is and will always require a new state returned.
The sign action.



## Callbacks

What is a callback.

## CLI commands

Deploy and interact

Tasks working.