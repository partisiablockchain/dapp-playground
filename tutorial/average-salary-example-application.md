# Average salary example application

The Average salary application shows how to compute the average salary of a group, without revealing
the salary of any individual.

This example uses the superpower of Partisia Blockchain,
[Zk contracts](https://partisiablockchain.gitlab.io/documentation/smart-contracts/zk-smart-contracts/zk-smart-contracts.html).

The application consists of a smart contract written in Rust
and [Zk Rust](https://partisiablockchain.gitlab.io/documentation/smart-contracts/zk-smart-contracts/zk-rust-language-zkrust.html)
and a web frontend written in TypeScript.

Throughout this example, when we write `run task`, then press `Ctrl+Shift+B`.

## Deploy an Average salary contract

Run task `Deploy an Average salary contract (ZK contract)`, the task will prompt you to choose the
account to deploy with

The average salary can also be deployed by running the following command in your terminal.

```shell
cargo partisia-contract cli tx deploy --gas 10000000 --privatekey Account-A.pk target/wasm32-unknown-unknown/release/average_salary.zkwa target/wasm32-unknown-unknown/release/average_salary.abi
```

The task and command will provide you with a link to view the deployed contract in
the [browser](https://browser.testnet.partisiablockchain.com).

## Use the web frontend to interact and view the contract

Run task `Start Average Salary Frontend`, or run these
two commands standing in the `average-salary-frontend` folder.

```shell
npm install
```

```shell
npm start
```

This will start a
web frontend able to interact with a deployed average salary contract.

Input the address to the deployed Average salary contract and click `Set address`. The address can
be
found in the browser.
The frontend will show your Average salary contract in the state section.

To submit a salary as a secret input to the contract, you need to log in
with [an account](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/create-an-account.html)
that [has gas](https://partisiablockchain.gitlab.io/documentation/smart-contracts/gas/how-to-get-testnet-gas.html).
Copy one of the private keys (`Account-A.pk`, `Account-B.pk` or `Account-C.pk`) into the form and
click `Login using private key`.

Add the salary to the input field, and click `Add salary`, it takes a while for the input to go
through, so click the `Refresh state`, to see the number of inputted salaries increase.

When there is at least three inputted salaries, then the average can be computed.
To start the computation click the `Start computation` button.
You need to refresh the state to see the result of the computation, the computation can take up to
minute.
You can refresh the state by clicking the `Refresh State` button.

## Zk input

Run task `Send salary as secret input to average salary contract`, to add a secret input. The task
prompts you to choose the sender of the input, the contract to send to and the input salary.

You can also send the secret input by running the command below.

```shell
cargo partisia-contract cli tx action --gas 100000 --privatekey Account-C.pk {contract-address-on-chain} add_salary {salary}
```

## Compute average salary

Run task `Compute average salary, starting the ZK computation.`, to start the computation of the
average salary.
The task will prompt you to choose the sender and the address of the deployed contract

You can also start the computation of the average by running the command below.

```shell
cargo partisia-contract cli tx action --gas 20000 --privatekey Account-A.pk {contract-address-on-chain} compute_average_salary
```

## Learning challenges

If you want to learn how to code Zk smart contracts and frontend for Partisia Blockchain, try to solve
the following learning challenges.

If you ever get stuck on one of the learning challenges you can always ask for help in the
supportive Dev-chat in
our [active Discord community](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).

1. Try to make the ZK computation count how many zero knowledge inputs there are and return that as
   a public available
   variable. You can see how it works
   in [zk-voting](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/zk-voting-simple/src/contract.rs?ref_type=heads).
2. Add a gender field to the secret input and try to branch by using a secret condition.
3. Try to split the average salary into different averages by returning multiple outputs based on the gender field
   created in challenge 2.