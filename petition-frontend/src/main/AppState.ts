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

import { ContractAbi, BlockchainAddress } from "@partisiablockchain/abi-client";
import { ConnectedWallet } from "./shared/ConnectedWallet";
import {
  BlockchainTransactionClient,
  ChainControllerApi,
  Configuration,
  SenderAuthentication,
} from "@partisiablockchain/blockchain-api-transaction-client";

export const CLIENT = new ChainControllerApi(
  new Configuration({ basePath: "https://node1.testnet.partisiablockchain.com" })
);

let contractAddress: string | undefined;
let currentAccount: ConnectedWallet | undefined;
let contractAbi: ContractAbi | undefined;
let petitionApi: PetitionApi | undefined;

export const setAccount = (account: ConnectedWallet | undefined) => {
  currentAccount = account;
  setPetitionApi();
};

export const resetAccount = () => {
  currentAccount = undefined;
};

export const isConnected = () => {
  return currentAccount != null && contractAddress != null;
};

export const setContractAbi = (abi: ContractAbi) => {
  contractAbi = abi;
  setPetitionApi();
};

export const getContractAbi = () => {
  return contractAbi;
};

export const setPetitionApi = () => {
  if (currentAccount != undefined) {
    const transactionApi = new TransactionApi(currentAccount, updateContractState);
    petitionApi = new PetitionApi(transactionApi);
  }
};

export const getPetitionApi = () => {
  return petitionApi;
};

export const getContractAddress = () => {
  return contractAddress;
};

export const setContractAddress = (address: string) => {
  contractAddress = address;
};
