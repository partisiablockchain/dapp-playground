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
  resetAccount,
  setAccount,
  getContractAddress,
  isConnected, getPetitionApi,
} from "./AppState";

import { SenderAuthentication } from "@privacyblockchain/blockchain-api-transaction-client";
import {CryptoUtils} from "./client/CryptoUtils";
import {connectPrivateKey} from "./shared/PrivateKeySignatureProvider";
import {connectMpcWallet} from "./shared/MpcWalletSignatureProvider";
import {connectMetaMask} from "./shared/MetaMaskSignatureProvider";
import {BlockchainAddress} from "@privacyblockchain/abi-client";

/**
 * Function for connecting to the MPC wallet and setting the connected wallet in the app state.
 */
export const connectMetaMaskWalletClick = () => {
  handleWalletConnect(connectMetaMask());
};

/**
 * Function for connecting to the MPC wallet and setting the connected wallet in the app state.
 */
export const connectMpcWalletClick = () => {
  // Call Partisia SDK to initiate connection
  handleWalletConnect(connectMpcWallet());
};

/**
 * Connect to the blockchain using a private key. Reads the private key from the form.
 */
export const connectPrivateKeyWalletClick = () => {
  const privateKey = <HTMLInputElement>document.querySelector("#private-key-value");
  const keyPair = CryptoUtils.privateKeyToKeypair(privateKey.value);
  const sender = CryptoUtils.keyPairToAccountAddress(keyPair);
  handleWalletConnect(connectPrivateKey(sender, keyPair));
};

/**
 * Common code for handling a generic wallet connection.
 * @param connect the wallet connection. Can be Mpc Wallet, Metamask, or using a private key.
 */
const handleWalletConnect = (connect: Promise<SenderAuthentication>) => {
  // Clean up state
  resetAccount();
  setConnectionStatus("Connecting...");
  connect
      .then((userAccount) => {
        setAccount(userAccount);

        // Fix UI
        setConnectionStatus(`Logged in: ${userAccount.getAddress()}`);
        toggleVisibility("#wallet-connect");
        toggleVisibility("#metamask-connect");
        toggleVisibility("#private-key-connect");
        toggleVisibility("#wallet-disconnect");
        updateInteractionVisibility();
      })
      .catch((error) => {
        console.error(error);
        if ("message" in error) {
          setConnectionStatus(error.message);
        } else {
          setConnectionStatus("An error occurred trying to connect wallet: " + error);
        }
      });
};

/**
 * Reset state to disconnect current user.
 */
export const disconnectWalletClick = () => {
  resetAccount();
  setConnectionStatus("Disconnected account");
  toggleVisibility("#wallet-connect");
  toggleVisibility("#metamask-connect");
  toggleVisibility("#private-key-connect");
  toggleVisibility("#wallet-disconnect");
  updateInteractionVisibility();
};

/**
 * Write some of the state to the UI.
 */
export const updateContractState = () => {
  const address = getContractAddress();
  if (address === undefined) {
    throw new Error("No address provided");
  }
  const petitionApi = getPetitionApi();
  if (petitionApi === undefined) {
    throw new Error("Petition API not setup");
  }

  const refreshLoader = <HTMLInputElement>document.querySelector("#refresh-loader");
  refreshLoader.classList.remove("hidden");

  if (petitionApi.basicState != undefined) {
    petitionApi.basicState(address).then((state) => {
      const stateHeader = <HTMLInputElement>document.querySelector("#state-header");
      const updateStateButton = <HTMLInputElement>document.querySelector("#update-state");
      stateHeader.classList.remove("hidden");
      updateStateButton.classList.remove("hidden");

      const description = <HTMLElement>document.querySelector("#description");
      description.innerHTML = `${state.description}`;

      const signedBy = <HTMLElement>document.querySelector("#signed-by");
      signedBy.innerHTML = "";
      state.signedBy.forEach((signer: BlockchainAddress) => {
        const signerElement = document.createElement("div");
        signerElement.innerHTML = signer.asString();
        signedBy.appendChild(signerElement);
      });

      const contractState = <HTMLElement>document.querySelector("#contract-state");
      contractState.classList.remove("hidden");
      refreshLoader.classList.add("hidden");
    });
  }
};

const setConnectionStatus = (status: string) => {
  const statusText = document.querySelector("#connection-status p");
  if (statusText != null) {
    statusText.innerHTML = status;
  }
}

const toggleVisibility = (selector: string) => {
  const element = document.querySelector(selector);
  if (element != null) {
    element.classList.toggle("hidden");
  }
};

export const updateInteractionVisibility = () => {
  const contractInteraction = <HTMLElement>document.querySelector("#contract-interaction");
  if (isConnected() && getContractAddress() !== undefined) {
    contractInteraction.classList.remove("hidden");
  } else {
    contractInteraction.classList.add("hidden");
  }
};
