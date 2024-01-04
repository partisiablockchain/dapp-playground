use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::zk::ZkInputDef;
use pbc_zk::*;

const SALARY_VARIABLE_KIND: u8 = 0u8;

#[derive(Clone, SecretBinary, CreateTypeSpec)]
pub struct ZKInput {
    pub salary: Sbi32,
    /*
    1 = Male,
    2 = Female,
    3 = Other
    */
    pub gender_choice: Sbi8,
}

#[derive(Clone, PartialEq, Debug)]
pub struct GenderCounts {
    pub male: Sbi32,
    pub female: Sbi32,
    pub other: Sbi32,
}

#[derive(Clone, PartialEq, Debug)]
pub struct Salaries {
    pub male: Sbi32,
    pub female: Sbi32,
    pub other: Sbi32,
}

#[derive(Clone, PartialEq)]
pub struct ZkOutput {
    pub gender_counts: GenderCounts,
    pub salaries: Salaries,
}

/// Perform a zk computation on secret-shared data sum the secret variables.
///
/// ### Returns:
///
/// The sum of the secret variables.
#[zk_compute(shortname = 0x61)]
pub fn sum_everything() -> Sbi32 {
    // Initialize state
    let mut total_reported_salary: Sbi32 = Sbi32::from(0);

    // Sum each variable
    for variable_id in secret_variable_ids() {
        if load_metadata::<u8>(variable_id) == SALARY_VARIABLE_KIND {
            let reported_salary = load_sbi::<Sbi32>(variable_id);
            total_reported_salary = total_reported_salary + reported_salary;
        }
    }

    total_reported_salary
}

/// Perform a zk computation on secret-shared data sum the secret variables.
///
/// ### Returns:
///
/// Computes the average salaries, based on gender
#[allow(clippy::needless_range_loop, dead_code)]
#[zk_compute(shortname = 0x62)]
pub fn gender_salaries() -> ZkOutput {
    //     let num_of_inputs = state.num_of_inputs + 1;
    //     let mut new_state = state;
    //     new_state.num_of_inputs = num_of_inputs;
    let mut salaries = [Sbi32::from(0); 3];
    let mut gender_count = [Sbi32::from(0); 3];

    for variable_id in secret_variable_ids() {
        let input = load_sbi::<ZKInput>(variable_id);

        for idx in 0usize..3usize {
            if input.gender_choice == Sbi8::from((idx + 1usize) as i8) {
                gender_count[idx] = gender_count[idx] + Sbi32::from(1);
                salaries[idx] = salaries[idx] + input.salary;
            }
        }
    }

    ZkOutput {
        salaries: Salaries {
            male: salaries[0],
            female: salaries[1],
            other: salaries[2],
        },
        gender_counts: GenderCounts {
            male: gender_count[0],
            female: gender_count[1],
            other: gender_count[2],
        },
    }
}
