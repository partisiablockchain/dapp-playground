# A Public smart contract example - Petition Contract

Throughout this example, when we write 'run task', then press 'F1', and search for 'Tasks: Run Task'.
A list of tasks wil pop up, now you can select the task you are looking for.

## Deploy a Petition contract

Run task "Deploy Petition Contract", the task will prompt asking for the account to deploy with,
and what the description for the Petition should be.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:

`cargo partisia-contract cli tx deploy --gas 2500000 --privatekey .vscode/${input:key}.pk target/wasm32-unknown-unknown/release/petition.wasm target/wasm32-unknown-unknown/release/petition.abi '${input:petition-description}'`

### Sign the Petition

Run task "Sign Petition", the task will prompt asking for the account to sign the petition with
and an address for a deployed petition contract.

[CLI instruction](https://partisiablockchain.gitlab.io/documentation/smart-contracts/smart-conract-tools-overview.html#the-command-line-interface-cli)
used in the Run task:

`cargo partisia-contract cli tx action --gas 20000 --privatekey .vscode/${input:key}.pk ${input:contract-address} sign`

### Use web client to view state and sign petition

Run task "Start client for contract" and choose petition-client from the prompt.
This will start a web client able to talk to a petition contract. Input the address and click "Connect to contract".
If the address corresponds to a petition contract you should see your petition in the state section.
To sign the petition you need to sign in with an account that has gas. Copy your private key (AccountA.pk, AccountB.pk
or AccountC.pk)
into the form and click login using private key. You can now sign the petition by clicking the sign button.

## Challenges
1. Try to manually [compile and deploy the contract](https://partisiablockchain.gitlab.io/documentation/smart-contracts/compile-and-deploy-contracts.html). 
2. Try to force the contract to only accept input from AccountA.pk and AccountB.pk using [asserts](https://doc.rust-lang.org/std/macro.assert.html), you can find inspiration on how to do it in the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads).
3. Add an action that can update the description of the petition contract. You can visit the count action in the [voting contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/blob/main/voting/src/lib.rs?ref_type=heads#L116) for inspiration.
4. Add a parameter to the above action to remove the hardcoded part of the action. 
5. Try to create an action that can unsign a signed user from the petition contract. 