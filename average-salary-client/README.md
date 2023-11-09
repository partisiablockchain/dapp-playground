# ui-integration-demo

Demo for how to integrate PBC wallet into a web frontend or dApp.

## Requirements

To be able to run the demo the following setup is required.

* node.js version v.16.15.0 or newer.

## How to run?

To run the example run

```shell
npm install
npm start
```

and view the demo at localhost:8080

## How does the wallet integration work?

The demo page is setup to interact with a specific
[token contract](https://gitlab.com/partisiablockchain/language/example-contracts/-/tree/main/token).

The page reads some of the fields from the contract state, and allows a user to transfer tokens to
another address.

To be able to interact with the contract a user most first connect to the dApp via the MPC wallet.

For a technical walkthrough of how the demo work, read the commentary in the code.
