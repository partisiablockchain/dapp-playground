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

import { ContractAbi } from "@partisiablockchain/abi-client-ts";
import { ShardedClient } from "./client/ShardedClient";
import { TransactionApi } from "./client/TransactionApi";
import { ConnectedWallet } from "./ConnectedWallet";
import { TokenContractApi } from "./contract/TokenContractApi";
import { updateContractState } from "./WalletIntegration";

export const CLIENT = new ShardedClient("https://node1.testnet.partisiablockchain.com", [
  "Shard0",
  "Shard1",
  "Shard2",
]);

let currentAccount: ConnectedWallet | undefined;
let contractAbi: ContractAbi | undefined;
let tokenApi: TokenContractApi | undefined;

export const setAccount = (account: ConnectedWallet | undefined) => {
  currentAccount = account;
  setTokenApi();
};

export const resetAccount = () => {
  currentAccount = undefined;
};

export const isConnected = () => {
  return currentAccount != null;
};

export const setContractAbi = (abi: ContractAbi) => {
  contractAbi = abi;
  setTokenApi();
};

export const getContractAbi = () => {
  return contractAbi;
};

export const setTokenApi = () => {
  if (currentAccount != undefined && contractAbi != undefined) {
    const transactionApi = new TransactionApi(currentAccount, updateContractState);
    tokenApi = new TokenContractApi(transactionApi, contractAbi);
  }
};

export const getTokenApi = () => {
  return tokenApi;
};
