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

import { Buffer } from "buffer";
import PartisiaSdk from "partisia-sdk";
import { CLIENT, resetAccount, setAccount, getContractAddress, isConnected } from "./AppState";
import { TransactionApi } from "./client/TransactionApi";
import { serializeTransaction } from "./client/TransactionSerialization";
import { ConnectedWallet } from "./ConnectedWallet";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";
import { Rpc, TransactionPayload } from "./client/TransactionData";
import { ec } from "elliptic";
import { CryptoUtils } from "./client/CryptoUtils";
import { deserializePetitionState } from "./contract/PetitionGenerated";
import { BlockchainAddress } from "@partisiablockchain/abi-client";

interface MetamaskRequestArguments {
  /** The RPC method to request. */
  method: string;
  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown>;
}

interface MetaMask {
  request<T>(args: MetamaskRequestArguments): Promise<T>;
}

/**
 * Function for connecting to the MPC wallet and setting the connected wallet in the app state.
 */
export const connectMetaMaskWalletClick = () => {
  handleWalletConnect(connectMetaMask());
};

/**
 * Connect to MetaMask snap and instantiate a ConnectedWallet.
 */
const connectMetaMask = async (): Promise<ConnectedWallet> => {
  const snapId = "npm:@partisiablockchain/snap";

  if ("ethereum" in window) {
    const metamask = window.ethereum as MetaMask;

    // Request snap to be installed and connected
    await metamask.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: {},
      },
    });

    // Get the address of the user from the snap
    const userAddress: string = await metamask.request({
      method: "wallet_invokeSnap",
      params: { snapId, request: { method: "get_address" } },
    });

    return {
      address: userAddress,
      signAndSendTransaction: async (payload, cost = 0) => {
        // To send a transaction we need some up-to-date account information, i.e. the
        // current account nonce.
        const accountData = await CLIENT.getAccountData(userAddress);
        if (accountData == null) {
          throw new Error("Account data was null");
        }
        // Account data was fetched, build and serialize the transaction
        // data.
        const serializedTx = serializeTransaction(
          {
            cost: String(cost),
            nonce: accountData.nonce,
            validTo: String(new Date().getTime() + TransactionApi.TRANSACTION_TTL),
          },
          payload
        );

        // Request signature from MetaMask
        const signature: string = await metamask.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: "npm:@partisiablockchain/snap",
            request: {
              method: "sign_transaction",
              params: {
                payload: serializedTx.toString("hex"),
                chainId: "Partisia Blockchain Testnet",
              },
            },
          },
        });

        // Serialize transaction for sending
        const transactionPayload = Buffer.concat([Buffer.from(signature, "hex"), serializedTx]);

        // Send the transaction to the blockchain
        return CLIENT.putTransaction(transactionPayload).then((txPointer) => {
          if (txPointer != null) {
            return {
              putSuccessful: true,
              shard: txPointer.destinationShardId,
              transactionHash: txPointer.identifier,
            };
          } else {
            return { putSuccessful: false };
          }
        });
      },
    };
  } else {
    throw new Error("Unable to find MetaMask extension");
  }
};

/**
 * Function for connecting to the MPC wallet and setting the connected wallet in the app state.
 */
export const connectMpcWalletClick = () => {
  // Call Partisia SDK to initiate connection
  const partisiaSdk = new PartisiaSdk();
  handleWalletConnect(
    partisiaSdk
      .connect({
        // eslint-disable-next-line
        permissions: ["sign" as any],
        dappName: "Wallet integration demo",
        chainId: "Partisia Blockchain Testnet",
      })
      .then(() => {
        const connection = partisiaSdk.connection;
        if (connection != null) {
          // User connection was successful. Use the connection to build up a connected wallet
          // in state.
          const userAccount: ConnectedWallet = {
            address: connection.account.address,
            signAndSendTransaction: (payload, cost = 0) => {
              // To send a transaction we need some up-to-date account information, i.e. the
              // current account nonce.
              return CLIENT.getAccountData(connection.account.address).then((accountData) => {
                if (accountData == null) {
                  throw new Error("Account data was null");
                }
                // Account data was fetched, build and serialize the transaction
                // data.
                const serializedTx = serializeTransaction(
                  {
                    cost: String(cost),
                    nonce: accountData.nonce,
                    validTo: String(new Date().getTime() + TransactionApi.TRANSACTION_TTL),
                  },
                  payload
                );
                // Ask the MPC wallet to sign and send the transaction.
                return partisiaSdk
                  .signMessage({
                    payload: serializedTx.toString("hex"),
                    payloadType: "hex",
                    dontBroadcast: false,
                  })
                  .then((value) => {
                    return {
                      putSuccessful: true,
                      shard: CLIENT.shardForAddress(connection.account.address),
                      transactionHash: value.trxHash,
                    };
                  })
                  .catch(() => ({
                    putSuccessful: false,
                  }));
              });
            },
          };
          return userAccount;
        } else {
          throw new Error("Unable to establish connection to MPC wallet");
        }
      })
      .catch((error) => {
        // Something went wrong with the connection.
        if (error instanceof Error) {
          if (error.message === "Extension not Found") {
            throw new Error("Partisia Wallet Extension not found.");
          } else if (error.message === "user closed confirm window") {
            throw new Error("Sign in using MPC wallet was cancelled");
          } else if (error.message === "user rejected") {
            throw new Error("Sign in using MPC wallet was rejected");
          } else {
            throw error;
          }
        } else {
          throw new Error(error);
        }
      })
  );
};

/**
 * Function for using a private key to sign and send transactions.
 */
const connectPrivateKey = async (sender: string, keyPair: ec.KeyPair): Promise<ConnectedWallet> => {
  return {
    address: sender,
    signAndSendTransaction: (payload: TransactionPayload<Rpc>, cost = 0) => {
      // To send a transaction we need some up-to-date account information, i.e. the
      // current account nonce.
      return CLIENT.getAccountData(sender).then((accountData) => {
        if (accountData == null) {
          throw new Error("Account data was null");
        }
        // Account data was fetched, build and serialize the transaction
        // data.
        const serializedTx = serializeTransaction(
          {
            cost: String(cost),
            nonce: accountData.nonce,
            validTo: String(new Date().getTime() + TransactionApi.TRANSACTION_TTL),
          },
          payload
        );
        const hash = CryptoUtils.hashBuffers([
          serializedTx,
          BigEndianByteOutput.serialize((out) => out.writeString("Partisia Blockchain Testnet")),
        ]);
        const signature = keyPair.sign(hash);

        // Serialize transaction for sending
        const transactionPayload = Buffer.concat([
          CryptoUtils.signatureToBuffer(signature),
          serializedTx,
        ]);

        // Send the transaction to the blockchain
        return CLIENT.putTransaction(transactionPayload).then((txPointer) => {
          if (txPointer != null) {
            return {
              putSuccessful: true,
              shard: txPointer.destinationShardId,
              transactionHash: txPointer.identifier,
            };
          } else {
            return { putSuccessful: false };
          }
        });
      });
    },
  };
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
const handleWalletConnect = (connect: Promise<ConnectedWallet>) => {
  // Clean up state
  resetAccount();
  setConnectionStatus("Connecting...");
  connect
    .then((userAccount) => {
      setAccount(userAccount);

      // Fix UI
      setConnectionStatus(`Logged in: ${userAccount.address}`);
      toggleVisibility("#wallet-connect");
      toggleVisibility("#metamask-connect");
      toggleVisibility("#private-key-connect");
      toggleVisibility("#wallet-disconnect");
      updateInteractionVisibility();
    })
    .catch((error) => {
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
 * Structure of the raw data from a WASM contract.
 */
interface RawContractData {
  state: { data: string };
}

/**
 * Write some of the state to the UI.
 */
export const updateContractState = () => {
  const address = getContractAddress();
  if (address === undefined) {
    throw new Error("No address provided");
  }
  const refreshLoader = <HTMLInputElement>document.querySelector("#refresh-loader");
  refreshLoader.classList.remove("hidden");
  CLIENT.getContractData<RawContractData>(address).then((contract) => {
    if (contract != null) {
      // Reads the state of the contract
      const stateBuffer = Buffer.from(contract.serializedContract.state.data, "base64");

      const state = deserializePetitionState({ state: stateBuffer });

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
    } else {
      throw new Error("Could not find data for contract");
    }
  });
};

const setConnectionStatus = (status: string) => {
  const statusText = document.querySelector("#connection-status p");
  if (statusText != null) {
    statusText.innerHTML = status;
  }
};

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
