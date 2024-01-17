#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

mod zk_compute;

use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::zk::ZkClosed;
use pbc_contract_common::zk::{CalculationStatus, SecretVarId, ZkInputDef, ZkState, ZkStateChange};
use pbc_traits::ReadWriteState;
use pbc_zk::Sbi32;
use read_write_rpc_derive::ReadWriteRPC;
use read_write_state_derive::ReadWriteState;
use crate::zk_compute::ZkInput;

/// Secret variable metadata. Unused for this contract, so we use a zero-sized struct to save space.
#[derive(ReadWriteState, ReadWriteRPC, Debug)]
#[repr(u8)]
enum SecretVarType {
    #[discriminant(0)]
    Salary {},
    #[discriminant(1)]
    SumResult {},
}

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
pub struct GenderedSumResult {
    pub salary_sums: SalarySums,
    pub input_counts: InputCounts,
}

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
pub struct SalarySums {
    pub male_salary_sum: i32,
    pub female_salary_sum: i32,
    pub other_salary_sum: i32,
}

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
pub struct InputCounts {
    pub male_count: i32,
    pub female_count: i32,
    pub other_count: i32,
}

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
pub struct GenderedAverages {
    pub male_average_salary: i32,
    pub female_average_salary: i32,
    pub other_average_salary: i32,
}

/// Number of employees to wait for before starting computation. A value of 2 or below is useless.
const MIN_NUM_EMPLOYEES: u32 = 3;

/// This contract's state
#[state]
struct ContractState {
    /// Address allowed to start computation
    administrator: Address,
    /// Will contain the result (average) when computation is complete
    average_salary_result: Option<GenderedAverages>,
    /// Will contain the number of employees after starting the computation
    num_employees: u32,
}

/// Initializes contract
///
/// Note that administrator is set to whoever initializes the contact.
#[init(zk = true)]
fn initialize(ctx: ContractContext, zk_state: ZkState<SecretVarType>) -> ContractState {
    ContractState {
        administrator: ctx.sender,
        average_salary_result: None,
        num_employees: 0,
    }
}

/// Adds another salary variable
#[zk_on_secret_input(shortname = 0x40, secret_type="ZkInput")]
fn add_salary(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (
    ContractState,
    Vec<EventGroup>,    
    ZkInputDef<SecretVarType, ZkInput>,
) {
    assert!(
        zk_state
            .secret_variables
            .iter()
            .chain(zk_state.pending_inputs.iter())
            .all(|(_, v)| v.owner != context.sender),
        "Each address is only allowed to send one salary variable. Sender: {:?}",
        context.sender
    );
    let input_def = ZkInputDef::with_metadata(SecretVarType::Salary {});
    (state, vec![], input_def)
}

/// Automatically called when a variable is confirmed on chain.
///
/// Unused for this contract, so we do nothing.
#[zk_on_variable_inputted]
fn inputted_variable(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    inputted_variable: SecretVarId,
) -> ContractState { 
    state.num_employees += 1;
    state
}

/// Allows the administrator to start the computation of the average salary.
///
/// The averaging computation is automatic beyond this call, involving several steps, as described in the module documentation.
#[action(shortname = 0x01, zk = true)]
fn compute_average_salary(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert_eq!(
        context.sender, state.administrator,
        "Only administrator can start computation"
    );
    assert_eq!(
        zk_state.calculation_state,
        CalculationStatus::Waiting,
        "Computation must start from Waiting state, but was {:?}",
        zk_state.calculation_state,
    );


    assert!(state.num_employees >= MIN_NUM_EMPLOYEES , "At least {MIN_NUM_EMPLOYEES} employees must have submitted and confirmed their inputs, before starting computation, but had only {}", state.num_employees);

    (
        state,
        vec![],
        vec![zk_compute::sum_everything_start(
            &SecretVarType::SumResult {},
        )],
    )
}

/// Automatically called when the computation is completed
///
/// The only thing we do is to instantly open/declassify the output variables.
#[zk_on_compute_complete]
fn sum_compute_complete(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    output_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    (
        state,
        vec![],
        vec![ZkStateChange::OpenVariables {
            variables: output_variables,
        }],
    )
}

/// Automatically called when a variable is opened/declassified.
///
/// We can now read the sum variable, and compute the average, which will be our final result.
#[zk_on_variables_opened]
fn open_sum_variable(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    opened_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert_eq!(
        opened_variables.len(),
        1,
        "Unexpected number of output variables"
    );
    let opened_variable = zk_state
        .get_variable(*opened_variables.get(0).unwrap())
        .unwrap();

    let result = read_variable_u32_le(&zk_state, &opened_variable.variable_id);

    let averages = GenderedAverages {
        male_average_salary: division_ignore_zero(
            result.salary_sums.male_salary_sum,
            result.input_counts.male_count
        ),
        female_average_salary: division_ignore_zero(
            result.salary_sums.female_salary_sum,
            result.input_counts.male_count
        ),
        other_average_salary: division_ignore_zero(
            result.salary_sums.other_salary_sum,
            result.input_counts.other_count
        ),
    };

    let mut zk_state_changes = vec![];
    if let SecretVarType::SumResult {} = opened_variable.metadata {
        state.average_salary_result = Some(averages);
        zk_state_changes = vec![ZkStateChange::ContractDone];
    }
    (state, vec![], zk_state_changes)
}

fn division_ignore_zero(nominator: i32, denominator: i32) -> i32{
    if denominator != 0 {
        nominator / denominator
    } else {
        0
    }
}

/// Reads a variable's data as an u32.
fn read_variable_u32_le(
    zk_state: ZkState<SecretVarType>,
    variable_id: &SecretVarId,
) -> GenderedSumResult {
    let variable = zk_state.get_variable(*variable_id).unwrap();
    let buffer: Vec<u8> = variable.data.clone().unwrap();
    let result = GenderedSumResult::state_read_from(&mut buffer.as_slice());

    result
}   
