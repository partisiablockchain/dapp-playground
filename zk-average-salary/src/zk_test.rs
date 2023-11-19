//! Test for ZK-computation for average salary (sum).

mod zk_compute;

use pbc_zk::api::*;
use pbc_zk::*;

// assert eval(1500, 1900, 2100, 2000, 2050, 1975) => (11525)
#[test]
fn average_salary_zk_test() {
    let inputs: Vec<SecretVar> = vec![
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(1500)),
        },
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(1900)),
        },
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(2100)),
        },
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(2000)),
        },
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(2050)),
        },
        SecretVar {
            metadata: Box::new(0u8),
            value: Box::new(Sbi32::from(1975)),
        },
    ];

    unsafe {
        set_secrets(inputs);
    }

    // Compute sum
    let output = zk_compute::sum_everything();
    assert_eq!(output, Sbi32::from(11525));
}
