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

import { Client, RealZkClient } from "@partisiablockchain/zk-client";
import { ShardedClient } from "./client/ShardedClient";
import { AverageSalaryApi } from "./contract/AverageSalaryApi";
import {
  BlockchainTransactionClient,
  SenderAuthentication,
} from "@privacyblockchain/blockchain-api-transaction-client";

export const TESTNET_URL = "https://node1.testnet.partisiablockchain.com";

export const CLIENT = new ShardedClient(TESTNET_URL, ["Shard0", "Shard1", "Shard2"]);

let contractAddress: string | undefined;
let currentAccount: SenderAuthentication | undefined;
let averageApi: AverageSalaryApi | undefined;

export const setAccount = (account: SenderAuthentication | undefined) => {
  currentAccount = account;
  setAverageApi();
};

export const resetAccount = () => {
  currentAccount = undefined;
};

export const isConnected = () => {
  return currentAccount != null;
};

export const setAverageApi = () => {
  let transactionClient = undefined;
  let zkClient = undefined;
  if (currentAccount != undefined && contractAddress != null) {
    transactionClient = BlockchainTransactionClient.create(
      "https://node1.testnet.partisiablockchain.com",
      currentAccount
    );
    zkClient = RealZkClient.create(contractAddress, new Client(TESTNET_URL));
    averageApi = new AverageSalaryApi(transactionClient, zkClient, currentAccount.getAddress());
  }
};

export const getAverageApi = () => {
  return averageApi;
};

export const getContractAddress = () => {
  return contractAddress;
};

export const setContractAddress = (address: string) => {
  contractAddress = address;
  setAverageApi();
};
