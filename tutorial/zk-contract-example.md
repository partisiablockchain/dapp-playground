# A Zero Knowledge smart contract example - Average salary contract

[Average salary](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
is a common multi-party computation example, where several privacy-conscious
individuals are interested in determining whether they are getting a fair salary, without
revealing the salary of any given individual.

The smart contract is written in Rust and uses the Partisia
Blockchains [unique language ZKRust](https://partisiablockchain.gitlab.io/documentation/smart-contracts/zk-smart-contracts/zk-smart-contracts.html),
to define the Zk computation of summing the variables.

Throughout this example, when we write `run task`, then press `Ctrl+Shift+B`.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy an Average salary contract

Run task `Deploy an Average salary contract (ZK contract)`, the task will prompt you to choose the
account to deploy with, or run the following command.

```shell
cargo partisia-contract cli tx deploy --gas 10000000 --privatekey Account-A.pk target/wasm32-unknown-unknown/release/average_salary.zkwa target/wasm32-unknown-unknown/release/average_salary.abi
```

## Use web client to view state and interact with the contract

Run task `Start Average Salary Client`, or run these
two commands standing in the `average-salary-client` folder.

```shell
npm install
```

```shell
npm start
```

This will start a
web client able to interact with a deployed average salary contract.

To add salary to the contract open the web client and sign in
with [an account](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/create-an-account.html)
that [has gas](https://partisiablockchain.gitlab.io/documentation/smart-contracts/gas/how-to-get-testnet-gas.html).
Copy one of the private keys (`Account-A.pk`, `Account-B.pk` or `Account-C.pk`) into the form and
click `Login using private key`.

Input the deployed contract address and click `Set address`.
If the address corresponds to a deployed average salary contract you should see the administrator in
the state section. You can now add salary.

To start the computation click the `Start computation` button.
You need to refresh the state to see the result of the computation, the computation can take up to
minute.
You can refresh the state by clicking the `Refresh State` button.

## Zk input

Run task `Send salary as secret input to average salary contract`, to add a secret input. The task
prompts you to choose the sender of the input, the contract to send to and the input salary, or you
use
the command below.

```shell
cargo partisia-contract cli tx action --gas 100000 --privatekey Account-A.pk {contract-address-on-chain} add_salary {salary}
```

## Compute average salary

Run task `Compute average salary, starting the ZK computation.`, to start the computation of the
average salary.
You are required to add three inputs to the contract to compute the average of the inputs.
Otherwise, the result would not be secret.
The task will prompt you to choose the sender and the address of the deployed contract, or use the
command below.

```shell
cargo partisia-contract cli tx action --gas 20000 --privatekey Account-A.pk {contract-address-on-chain} compute_average_salary
```

## Learning challenges

If you ever get stuck on one of the learning challenges you can always ask for help in the
supportive Dev-chat in
our [active Discord community](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).

1. Try to make the ZK computation count how many zero knowledge inputs there are and return that as
   a public available
   variable. You can see how it works
   in [zk-voting](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/zk-voting-simple/src/contract.rs?ref_type=heads).
2. Add a gender field to the metadata and try to branch by using a public condition available in the
   metadata.
3. Try to split the average salary into two different averages using available gender public
   metadata created in challenge 2.