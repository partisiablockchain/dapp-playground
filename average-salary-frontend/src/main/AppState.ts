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
import { BlockchainPublicKey } from "@partisiablockchain/zk-client";
import { ShardedClient } from "./client/ShardedClient";
import { TransactionApi } from "./client/TransactionApi";
import { ConnectedWallet } from "./ConnectedWallet";
import { AverageSalaryApi } from "./contract/AverageSalaryApi";
import { updateContractState } from "./WalletIntegration";

export const CLIENT = new ShardedClient("https://node1.testnet.partisiablockchain.com", [
  "Shard0",
  "Shard1",
  "Shard2",
]);

let contractAddress: string | undefined;
let currentAccount: ConnectedWallet | undefined;
let contractAbi: ContractAbi | undefined;
let averageApi: AverageSalaryApi | undefined;
let engineKeys: BlockchainPublicKey[] | undefined;

export const setAccount = (account: ConnectedWallet | undefined) => {
  currentAccount = account;
  setAverageApi();
};

export const resetAccount = () => {
  currentAccount = undefined;
};

export const isConnected = () => {
  return currentAccount != null;
};

export const setContractAbi = (abi: ContractAbi | undefined) => {
  contractAbi = abi;
  setAverageApi();
};

export const getContractAbi = () => {
  return contractAbi;
};

export const setAverageApi = () => {
  if (currentAccount != undefined && contractAbi != undefined && engineKeys !== undefined) {
    const transactionApi = new TransactionApi(currentAccount, updateContractState);
    averageApi = new AverageSalaryApi(
      transactionApi,
      currentAccount.address,
      contractAbi,
      engineKeys
    );
  }
};

export const getAverageApi = () => {
  return averageApi;
};

export const getEngineKeys = () => {
  return engineKeys;
};

export const setEngineKeys = (keys: BlockchainPublicKey[] | undefined) => {
  engineKeys = keys;
  setAverageApi();
};

export const getContractAddress = () => {
  return contractAddress;
};

export const setContractAddress = (address: string) => {
  contractAddress = address;
};
