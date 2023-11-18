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

import {
  getAverageApi,
  isConnected,
  setContractAbi,
  setContractAddress,
  setEngineKeys,
} from "./AppState";
import {
  connectMetaMaskWalletClick,
  connectMpcWalletClick,
  connectPrivateKeyWalletClick,
  disconnectWalletClick,
  updateContractState,
  updateInteractionVisibility,
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

const updateStateBtn = <Element>document.querySelector("#update-state-btn");
updateStateBtn.addEventListener("click", updateContractState);

/** Function for the contract address form.
 * This is called when the user clicks on the connect to contract button.
 * It validates the address, and then gets the state for the contract.
 */
function contractAddressClick() {
  const address = (<HTMLInputElement>document.querySelector("#address-value")).value;
  const regex = /[0-9A-Fa-f]{42}/g;
  if (address === undefined) {
    throw new Error("Need to provide a contract address");
  } else if (address.length != 42 || address.match(regex) == null) {
    // Validate that address is 21 bytes in hexidecimal format
    console.error(`${address} is not a valid PBC address`);
  } else {
    // Show address and a link to the browser.
    const currentAddress = <HTMLInputElement>document.querySelector("#current-address");
    currentAddress.innerHTML = `Average Salary Address: ${address}`;
    const browserLink = <HTMLInputElement>document.querySelector("#browser-link");
    browserLink.innerHTML = `<a href="https://browser.testnet.partisiablockchain.com/contracts/${address}" target="_blank">Browser link</a>`;

    // Reset abi and engine keys
    setContractAbi(undefined);
    setEngineKeys(undefined);
    // Update the contract state.
    setContractAddress(address);
    updateInteractionVisibility();
    updateContractState();
  }
}

/**
 * Form action for the add salary form.
 * The action reads the value from the input field and validates them.
 */
function addSalaryFormAction() {
  // Test if a user has connected via the MPC wallet extension
  if (isConnected()) {
    const salary = <HTMLInputElement>document.querySelector("#salary");
    if (isNaN(parseInt(salary.value, 10))) {
      // Validate that amount is a number
      console.error("Salary must be a number");
    } else {
      // All fields validated, add salary.

      // If the user has inputted a correct average salary address this should be defined.
      const api = getAverageApi();
      if (api !== undefined) {
        // Add salary via Average Salary api
        const browserLink = <HTMLInputElement>(
          document.querySelector("#add-salary-transaction-link")
        );
        browserLink.innerHTML = '<br><div class="loader"></div>';
        api
          .addSalary(parseInt(salary.value, 10))
          .then((transactionHash) => {
            browserLink.innerHTML = `<br><a href="https://browser.testnet.partisiablockchain.com/transactions/${transactionHash}" target="_blank">Transaction link in browser</a>`;
          })
          .catch((msg) => {
            browserLink.innerHTML = `<br>${msg}`;
          });
      }
    }
  } else {
    console.error("Cannot transfer without a connected wallet!");
  }
}

/** Action for the compute average salary button */
function computeAction() {
  // User is connected and the Average Salary Api is defined
  const api = getAverageApi();
  const browserLink = <HTMLInputElement>document.querySelector("#compute-transaction-link");
  browserLink.innerHTML = '<br><div class="loader"></div>';
  if (isConnected() && api !== undefined) {
    // Call compute via the Api
    api
      .compute()
      .then((transactionHash) => {
        browserLink.innerHTML = `<br><a href="https://browser.testnet.partisiablockchain.com/transactions/${transactionHash}" target="_blank">Transaction link in browser</a>`;
      })
      .catch((msg) => {
        browserLink.innerHTML = `<br>${msg}`;
      });
  }
}
