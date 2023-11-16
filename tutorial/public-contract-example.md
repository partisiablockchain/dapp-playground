# A Public smart contract example - Petition Contract

The Petition is a public smart contract, written in Rust which can be run on deployed on the Partisia
Blockchain.
To learn more about the public smart contracts visit our [smart contract documentation](https://partisiablockchain.gitlab.io/documentation/smart-contracts/introduction-to-smart-contracts.html).

This example contract is a Petition contract, it shows how to create a collection of signatures for 
a specific topic on the chain. 

Throughout this example, when we write `run task`, then press `F1`, and search for `Tasks: Run Task`.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy a Petition contract

Run task `Deploy Petition Contract`, the task will prompt asking for the account to deploy with,
and what the description for the Petition should be.

The contract can also be deployed by running this command.
<br>
```shell
cargo partisia-contract cli tx deploy --gas 2500000 --privatekey Account-A.pk  target/wasm32-unknown-unknown/release/petition.wasm target/wasm32-unknown-unknown/release/petition.abi 'My Petition is Awesome'
```


### Sign the Petition

Either run task `Sign Petition`, the task will prompt asking for the account to sign the petition with
and an address for a deployed petition contract or run the following command.
<br>
```shell
cargo partisia-contract cli tx action --gas 20000 --privatekey Account-A.pk {contract-address-on-chain} sign
```

### Use web client to view state and sign petition

Run task `Start client for Petition`.
This will start a web client able to talk to a petition contract.

The client can also be started by running the two following commands after each other.
```shell
npm install
```
```shell
npm start
```

Input the address and click `Connect to contract`.
If the address corresponds to a petition contract you should see your petition in the state section.
To sign the petition you need to sign in with an account that has gas.

Copy one of the private keys, (`Account-A.pk`, `Account-B.pk` or `Account-C.pk`),
into the form and click login using private key. You can now sign the petition by clicking the `Sign` button.

## Challenges

If you ever get stuck on one of the challenges you can always ask for help in the supportive Dev-chat in
our [active Discord community](https://partisiablockchain.gitlab.io/documentation/get-support-from-pbc-community.html).

1. Attempt to use the other of the tasks or terminal commands than the one you have just used.
2. Try to
   manually [compile and deploy the contract](https://partisiablockchain.gitlab.io/documentation/smart-contracts/compile-and-deploy-contracts.html).
3. Try to force the contract to only accept input from AccountA.pk and AccountB.pk
   using [asserts](https://doc.rust-lang.org/std/macro.assert.html). You can find inspiration on how to do it in
   the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads).
4. Add an action that can update the description of the petition contract. You can visit the count action in
   the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads#L116)
   for inspiration.
5. Add a parameter to the above action to remove the hardcoded part of the action.
6. Try to create an action that can unsign a signed user from the petition contract. 