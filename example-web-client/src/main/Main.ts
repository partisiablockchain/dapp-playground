/*
 * Copyright (C) 2022 - 2023 Partisia Blockchain Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import BN from "bn.js";
import { getTokenApi, isConnected } from "./AppState";
import {
  connectMetaMaskWalletClick,
  connectMpcWalletClick,
  disconnectWalletClick,
  updateContractState,
} from "./WalletIntegration";

// Setup event listener to connect to the MPC wallet browser extension
const connectWallet = <Element>document.querySelector("#wallet-connect-btn");
connectWallet.addEventListener("click", connectMpcWalletClick);

// Setup event listener to connect to the MetaMask snap
const metaMaskConnect = <Element>document.querySelector("#metamask-connect-btn");
metaMaskConnect.addEventListener("click", connectMetaMaskWalletClick);

// Setup event listener to drop the connection again
const disconnectWallet = <Element>document.querySelector("#wallet-disconnect-btn");
disconnectWallet.addEventListener("click", disconnectWalletClick);

// Setup event listener that sends a transfer transaction to the contract.
// This requires that a wallet has been connected.
const transferSubmitBtn = <Element>document.querySelector("#transfer-submit-btn");
transferSubmitBtn.addEventListener("click", transferFormAction);

const mintTokensBtn = <Element>document.querySelector("#mint-tokens-btn");
mintTokensBtn.addEventListener("click", mintTokensAction);

// Fetch the state of the Token contract and write relevant values to the UI.
updateContractState();

// Form action for the transfer tokens form.
// The action reads the values from the input fields and validates them.
function transferFormAction() {
  // Test if a user has connected via the MPC wallet extension
  if (isConnected()) {
    const to = <HTMLInputElement>document.querySelector("#transfer-to");
    const amount = <HTMLInputElement>document.querySelector("#transfer-amount");
    const address = to.value;
    const regex = /[0-9A-Fa-f]{42}/g;
    if (address.length != 42 || address.match(regex) == null) {
      // Validate that address is 21 bytes in hexidecimal format
      console.error(`${address} is not a valid PBC address`);
    } else if (parseInt(amount.value, 10) <= 0 || isNaN(parseInt(amount.value, 10))) {
      // Validate that amount is greater than zero
      console.error("Transfer amount must be greater than zero");
    } else {
      // All fields validated, transfer tokens.
      // To be able to tokens we need the token API to be set in state.
      // This should have happened automatically if we were able to fetch the token contract state
      // and abi.
      const api = getTokenApi();
      if (api !== undefined) {
        // Transfer tokens via the token api
        api
          .transfer(address, new BN(amount.value))
          .then(() => console.warn("Transfer was successful!"));
      }
    }
  } else {
    console.error("Cannot transfer without a connected wallet!");
  }
}

function mintTokensAction() {
  const api = getTokenApi();
  if (isConnected() && api !== undefined) {
    api.mint().then(() => console.warn("Minted tokens"));
  }
}
