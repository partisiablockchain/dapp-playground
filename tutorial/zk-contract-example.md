# A Zero Knowledge smart contract example - Average salary contract

[Average salary](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/zk-average-salary?ref_type=heads)
is a common multi-party computation example, where several privacy-conscious
individuals are interested in determining whether they are getting a fair salary, without
revealing the salary of any given individual. The smart contract is written in Partisia
Blockchains [unique language ZKRust](https://partisiablockchain.gitlab.io/documentation/smart-contracts/zk-smart-contracts/zk-smart-contracts.html).

Throughout this example, when we write `run task`, then press `F1`, and search for `Tasks: Run Task`.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy an Average salary contract

Run task "Deploy an Average salary contract (ZK contract)", the task will prompt you to choose the
account to deploy with.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx deploy --gas 10000000 --privatekey ./PATH/TO/PRIVATEKEY target/wasm32-unknown-unknown/release/average_salary.zkwa target/wasm32-unknown-unknown/release/average_salary.abi`

## Zk input

Run task "Send a salary as a secret input to an average salary contract", to send secret input to an already deployed
average salary contract. The task will prompt to choose the
sender of the input, the contract to send to and the input salary.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx action --gas 100000 --privatekey ./PATH/TO/PRIVATEKEY {contract-address-on-chain} add_salary {salary}`

## Compute average salary

Run task "Compute average salary, starting the ZK computation.", to start the computation of the average salary.
The action can only be called by the owner of the contract, i.e.
the call must be signed by the same account that deployed the contract.
There must also be at least 3 inputs added to the contract to compute. Otherwise, the result would not be secret.
The task will prompt you to choose the sender and the address of the deployed contract. The compute average salary is a
action created in the smart contract.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract cli tx action --gas 20000 --privatekey ./PATH/TO/PRIVATEKEY {contract-address-on-chain} compute_average_salary`

## The structure of the Average salary smart contract

run task "Show the ABI for a contract", to view the structure of the Average salary contract,
and choose the average salary option.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:
<br>
`cargo partisia-contract abi show target/wasm32-unknown-unknown/release/average_salary.abi`

## Use web client to view state and interact with the contract

Run task "Start client for contract" and choose average-salary-client from the prompt. This will start a
web client able to talk to an average salary contract.

After opening the web client, input the address and click "
Connect to contract".
If the address corresponds to an average salary contract you should see the administrator in the state section.
To add salary to the contract you need to sign in with an account that has gas. Copy your private key
(AccountA.pk, AccountB.pk or AccountC.pk) into the form and click login using private key. You can now add salary.
If you have logged in as the administrator you can start the computation by clicking the compute button.
You might have to update the state to see the result of the computation. You update the state by clicking the connect to
contract button again.

## Challenges

If you ever get stuck on one of the challenges you can always ask for help in the supportive Dev-chat in
our [active Discord community](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).

1. Try to make the ZK computation count how many zero knowledge inputs there are and return that as a public available
   variable. You can see how it works
   in [zk-voting](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/zk-voting-simple/src/contract.rs?ref_type=heads).
2. Add a gender field to the metadata and try to branch by using a public condition available in the metadata.
3. Try to split the average salary into two different averages using available gender public metadata created in the
   earlier challenge.