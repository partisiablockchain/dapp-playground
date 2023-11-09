# A Public smart contract example - Petition Contract

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

## Actions

Actions are functions that can be called on the blockchain. There can be multiple actions within a smart contract. An
action can use the state as is and will always require a new state returned.
The sign action.

## Callbacks

What is a callback.

## CLI commands

Deploy and interact

Tasks working.