# A Zero Knowledge smart contract example - Average salary contract

Throughout this example, when we write 'run task', then press 'F1', and search for 'Tasks: Run Task'.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy an Average salary contract

Run the task "Deploy an Average salary contract (ZK contract)", the task will prompt to choose the
account to deploy with.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx deploy --gas 10000000 --privatekey {YourPrivateKey} target/wasm32-unknown-unknown/release/average_salary.zkwa target/wasm32-unknown-unknown/release/average_salary.abi`

## Zk input

To send secret inputs to a deployed average salary contract run the task
"Send a salary as a secret input to an average salary contract". The task will prompt to choose the
sender of the input, the contract to send to and the input salary.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx action --gas 100000 --privatekey {YourPrivateKey} {contract-address-on-chain} add_salary {salary}`

## Compute average salary

To start the computation of the average salary, call the public action start_computation.
The action can only be called by the owner of the contract, i.e.
the call must be signed by the account that deployed the contract.
There must also be at least 3 inputs added to the contract to compute.
The task will prompt to choose the sender and the address of the deployed contract.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx action --gas 20000 --privatekey {YourPrivateKey} {contract-address-on-chain} compute_average_salary`

## The structure of the Average salary smart contract

To view the structure of the Average salary contract, run the task "Show the ABI for a contract",
and choose the average salary option.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract abi show target/wasm32-unknown-unknown/release/average_salary.abi`

## Use web client to view state and interact with the contract

Run the task "Start client for contract" and choose average-salary-client from the prompt. This will start a
web client able to talk to an average salary contract. Input the address and click "Connect to contract".
If the address corresponds to an average salary contract you should see the administrator in the state section.
To add salary to the contract you need to sign in with an account that has gas. Copy your private key
(A.pk, B.pk or C.pk) into the form and click login using private key. You can now add salary.
If you have logged as the administrator you can also start the computation by clicking the compute button.
You might have to update the state to see the result of the computation. You can do this by clicking the connect to
contract button again.

## Secret types

## Secret Struct

## Challenges

1. Add a gender field to the metadata and try to branch based on that.
2. Try to split the average salary into two averages using public metadata.
3. Try to recreate the ZK computation to count how many zero knowledge inputs there are and return that.