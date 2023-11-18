# Petition example application

A Petition shows how to collect signatures for showing interest in
a specific change in the world.

The
application consists of a smart contract written in Rust and a web frontend written in TypeScript.

To learn more about the smart contracts visit
our [smart contract documentation](https://partisiablockchain.gitlab.io/documentation/smart-contracts/introduction-to-smart-contracts.html).

Throughout this example, when we write `run task`, then press `Ctrl+Shift+B`.

## Deploy a Petition contract

Run task `Deploy Petition Contract`, the task will prompt asking for the account to deploy with,
and what the description for the Petition should be.

The contract can also be deployed by running this command.

```shell
cargo partisia-contract cli tx deploy --gas 2500000 --privatekey Account-A.pk  target/wasm32-unknown-unknown/release/petition.wasm target/wasm32-unknown-unknown/release/petition.abi 'My Petition is Awesome'
```

The task and command will provide you with a link to view the deployed contract in
the [browser](https://browser.testnet.partisiablockchain.com).

### Use the web frontend to view and sign the petition

Run task `Start Petition Frontend`.
This will start a web frontend able to interact with a deployed petition contract.

The frontend can also be started by running the two following commands standing in
the `petition-frontend` folder.

```shell
npm install
```

```shell
npm start
```

Input the address to the deployed Petition contract and click `Set address`. The address can be
found in the browser.
The frontend will show your Petition in the state section.
To sign the petition you need to log in
with [an account](https://partisiablockchain.gitlab.io/documentation/pbc-fundamentals/create-an-account.html)
that [has gas](https://partisiablockchain.gitlab.io/documentation/smart-contracts/gas/how-to-get-testnet-gas.html).

Copy one of the private keys, (`Account-A.pk`, `Account-B.pk` or `Account-C.pk`),
into the form and click `Login using private key`. You can now sign the petition by clicking
the `Sign` button. The state will then be updated with the new signer.

### Sign the Petition from your commandline

Either run the task `Sign Petition`, the task will prompt asking for the account to sign the
petition
with and an address for a deployed petition contract

You can also sign the Petition by running the following command in your terminal.

```shell
cargo partisia-contract cli tx action --gas 20000 --privatekey Account-C.pk {contract-address-on-chain} sign
```

## Learning challenges

If you want to learn how to code smart contracts and frontend for Partisia Blockchain, try to solve
the following learning challenges.

If you ever get stuck on one of the learning challenges you can always ask for help in the
supportive
Dev-chat in
our [active Discord community](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).

1. Attempt to use any of
   the [CLI commands](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-contract-tools-overview.html#command-line-tools).
2. Try to
   manually [compile and deploy the contract](https://partisiablockchain.gitlab.io/documentation/smart-contracts/compile-and-deploy-contracts.html).
3. Try to force the contract to only accept input from AccountA.pk and AccountB.pk
   using [asserts](https://doc.rust-lang.org/std/macro.assert.html). You can find inspiration on how
   to do it in
   the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads).
   If you cannot find the public address of those accounts, log into the browser with your
   private key, go to [your account](https://browser.testnet.partisiablockchain.com/account).
4. Add an action that updates the description of the petition contract to a constant.
   You can visit the count action in
   the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads#L116)
   for inspiration.
5. Add a button to call the new action in the frontend.
6. Add a parameter to the above action to remove the hardcoded part of the action.
7. Add an input field to the frontend, where the user can enter the new Petition description.
8. Try to create an action that can un-sign a signed user from the petition contract. Also add a
   button to the frontend.