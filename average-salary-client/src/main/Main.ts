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

import { getTokenApi, isConnected, setContractAddress } from "./AppState";
import {
  connectMetaMaskWalletClick,
  connectMpcWalletClick,
  connectPrivateKeyWalletClick,
  disconnectWalletClick,
  updateContractState,
} from "./WalletIntegration";

// Setup event listener to connect to the MPC wallet browser extension
const connectWallet = <Element>document.querySelector("#wallet-connect-btn");
connectWallet.addEventListener("click", connectMpcWalletClick);

// Setup event listener to connect to the MetaMask snap
const metaMaskConnect = <Element>document.querySelector("#metamask-connect-btn");
metaMaskConnect.addEventListener("click", connectMetaMaskWalletClick);

// Setup event listener to connect to the MetaMask snap
const pkConnect = <Element>document.querySelector("#private-key-connect-btn");
pkConnect.addEventListener("click", connectPrivateKeyWalletClick);

// Setup event listener to drop the connection again
const disconnectWallet = <Element>document.querySelector("#wallet-disconnect-btn");
disconnectWallet.addEventListener("click", disconnectWalletClick);

// Setup event listener that sends a transfer transaction to the contract.
// This requires that a wallet has been connected.
const addSalarySubmitBtn = <Element>document.querySelector("#add-salary-btn");
addSalarySubmitBtn.addEventListener("click", addSalaryFormAction);

const computeSalaryBtn = <Element>document.querySelector("#compute-average-salary-btn");
computeSalaryBtn.addEventListener("click", computeAction);

const addressBtn = <Element>document.querySelector("#address-btn");
addressBtn.addEventListener("click", contractAddressClick);

// Fetch the state of the Token contract and write relevant values to the UI.
//updateContractState();

// Form action for the transfer tokens form.
// The action reads the values from the input fields and validates them.
function addSalaryFormAction() {
  // Test if a user has connected via the MPC wallet extension
  if (isConnected()) {
    const salary = <HTMLInputElement>document.querySelector("#salary");
    if (isNaN(parseInt(salary.value, 10))) {
      // Validate that amount is greater than zero
      console.error("Salary must be a number");
    } else {
      // All fields validated, transfer tokens.
      // To be able to tokens we need the token API to be set in state.
      // This should have happened automatically if we were able to fetch the token contract state
      // and abi.
      const api = getTokenApi();
      if (api !== undefined) {
        // Transfer tokens via the token api
        api
          .addSalary(parseInt(salary.value, 10))
          .then(() => console.warn("Transfer was successful!"));
      }
    }
  } else {
    console.error("Cannot transfer without a connected wallet!");
  }
}

function computeAction() {
  const api = getTokenApi();
  if (isConnected() && api !== undefined) {
    api.compute().then(() => console.warn("Computed average salary"));
  }
}

function contractAddressClick() {
  const address = (<HTMLInputElement>document.querySelector("#address-value")).value;
  const regex = /[0-9A-Fa-f]{42}/g;
  if (address === undefined) {
    throw new Error("Need to provide a contract address");
  } else if (address.length != 42 || address.match(regex) == null) {
    // Validate that address is 21 bytes in hexidecimal format
    console.error(`${address} is not a valid PBC address`);
  } else {
    const currentAddress = <HTMLInputElement>document.querySelector("#current-address");
    currentAddress.innerHTML = `Contract Address: ${address}`;
    setContractAddress(address);
    updateContractState();
  }
}
