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

import { ContractAbi } from "@partisiablockchain/abi-client";
import { ShardedClient } from "./client/ShardedClient";
import { TransactionApi } from "./client/TransactionApi";
import { ConnectedWallet } from "./ConnectedWallet";
import { PetitionApi } from "./contract/PetitionApi";
import { updateContractState } from "./WalletIntegration";

export const CLIENT = new ShardedClient("https://node1.testnet.partisiablockchain.com", [
  "Shard0",
  "Shard1",
  "Shard2",
]);

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
