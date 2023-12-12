use pbc_zk::*;

#[allow(unused)]
const SALARY_VARIABLE_KIND: u8 = 0u8;

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
