#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;

use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::sorted_vec_map::SortedVecSet;

/// The state of the petition, which is persisted on-chain.
#[state]
pub struct PetitionState {
    signed_by: SortedVecSet<Address>,
    description: String,
    allowed_signers: Vec<Address>,
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
#[init]
pub fn initialize(
    _ctx: ContractContext,
    description: String,
    allowed_signers: Vec<Address>,
) -> PetitionState {
    assert_ne!(
        description, "",
        "The description of a petition cannot be empty."
    );
    PetitionState {
        description,
        signed_by: SortedVecSet::new(),
        allowed_signers: allowed_signers,
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
///
#[action(shortname = 0x01)]
pub fn sign(ctx: ContractContext, state: PetitionState) -> PetitionState {
    assert!(
        state.allowed_signers.contains(&ctx.sender),
        "This account is not allowed to sign contracts."
    );
    let mut new_state = state;
    new_state.signed_by.insert(ctx.sender);
    new_state
}
