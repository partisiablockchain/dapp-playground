#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

/// b- Import necessary external crates for the contract.
#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;

/// b- Import specific modules from `pbc_contract_common` crate.
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::sorted_vec_map::SortedVecSet;

/// b- Define the persistent state of the petition on-chain.
/// The state of the petition, which is persisted on-chain.
#[state]
pub struct PetitionState {
    signed_by: SortedVecSet<Address>,
    description: String,
    account_a: Address,
    account_b: Address
}

/// Initialize a new petition to sign.
///
/// # Arguments
///
/// * `_ctx` - the contract context containing information about the sender and the blockchain.
/// * `description` - the description of the petition people can sign.
///
/// # Returns
///
/// The initial state of the petition, with no signers.
///
///  b- This function is called when the contract is deployed.
///  b- It initializes the contract with a description.
#[init]
pub fn initialize(_ctx: ContractContext, description: String, account_a: Address, account_b: Address) -> PetitionState {
    // b- Check that the description is not empty.
    assert_ne!(
        description, "",
        "The description af a petition cannot be empty."
    );
    // b- Return the initial state with the given description and no signers.
    PetitionState {
        description,
        signed_by: SortedVecSet::new(),
        account_a,
        account_b
    }
}

/// Sign the petition
///
/// # Arguments
///
/// * `ctx` - the contract context containing information about the sender and the blockchain.
/// * `state` - the current state of the petition.
///
/// # Returns
///
/// The updated vote state reflecting the new signing.
/// -b This function is an action that can be called after the contract is deployed.
/// -b It allows an address to sign the petition.
#[action(shortname = 0x01)]
pub fn sign(ctx: ContractContext, state: PetitionState) -> PetitionState {
    assert!(ctx.sender == state.account_a || ctx.sender == state.account_b);
    let mut new_state = state;
    new_state.signed_by.insert(ctx.sender);
    new_state
}