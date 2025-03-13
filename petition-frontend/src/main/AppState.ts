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
  BlockchainTransactionClient,
  ChainControllerApi,
  Configuration,
  SenderAuthentication,
} from "@privacyblockchain/blockchain-api-transaction-client";
import { BlockchainAddress } from "@privacyblockchain/abi-client";
import { PetitionApi } from "./contract/PetitionApi";

export const CLIENT = new ChainControllerApi(
  new Configuration({ basePath: "https://node1.testnet.partisiablockchain.com" })
);

let contractAddress: BlockchainAddress | undefined;
let currentAccount: SenderAuthentication | undefined;
let petitionApi: PetitionApi | undefined;

export const setAccount = (account: SenderAuthentication | undefined) => {
  currentAccount = account;
  setPetitionApi();
};

export const resetAccount = () => {
  currentAccount = undefined;
};

export const isConnected = () => {
  return currentAccount != null;
};

const setPetitionApi = () => {
  let transactionClient = undefined;
  if (currentAccount != undefined) {
    transactionClient = BlockchainTransactionClient.create(
      "https://node1.testnet.partisiablockchain.com",
      currentAccount
    );
  }
  petitionApi = new PetitionApi(CLIENT, transactionClient);
};

export const getPetitionApi = () => {
  return petitionApi;
};

export const getContractAddress = () => {
  return contractAddress;
};

export const setContractAddress = (address: BlockchainAddress) => {
  contractAddress = address;
  setPetitionApi();
};
