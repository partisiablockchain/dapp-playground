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

import { deserializeState, PetitionState, sign } from "./PetitionGenerated";
import { getContractAddress } from "../AppState";

import {
  BlockchainTransactionClient,
  ChainControllerApi,
} from "@partisiablockchain/blockchain-api-transaction-client";
import { BlockchainAddress } from "@partisiablockchain/abi-client";

export interface PetitionBasicState {
  signedBy: BlockchainAddress[];
  description: string;
}

/**
 * API for the token contract.
 * This minimal implementation only allows for transferring tokens to a single address.
 *
 * The implementation uses the TransactionApi to send transactions, and ABI for the contract to be
 * able to build the RPC for the transfer transaction.
 */
export class PetitionApi {
  private readonly transactionClient: BlockchainTransactionClient | undefined;
  private readonly client: ChainControllerApi;

  constructor(
    shardedClient: ChainControllerApi,
    transactionClient: BlockchainTransactionClient | undefined
  ) {
    this.transactionClient = transactionClient;
    this.client = shardedClient;
  }

  private getState(contractAddress: BlockchainAddress): Promise<PetitionState> {
    return this.client.getContract({ address: contractAddress.asString() }).then((contract) => {
      if (contract == null) {
        throw new Error("Could not find data for contract");
      }

      // Reads the state of the contract
      if (contract.serializedContract != undefined) {
        const stateBuffer = Buffer.from(contract.serializedContract, "base64");
        return deserializeState(stateBuffer);
      } else throw new Error("Could not get the contract state.");
    });
  }

  /**
   * Determines the basic state of the contract.
   */
  public basicState(contractAddress: BlockchainAddress): Promise<PetitionBasicState> {
    return this.getState(contractAddress);
  }

  /**
   * Build and send sign transaction.
   */
  readonly sign = () => {
    if (this.transactionClient === undefined) {
      throw new Error("No account logged in");
    }
    const address = getContractAddress();
    if (address === undefined) {
      throw new Error("No address provided");
    }
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = sign();
    // Then send the payload via the transaction API.
    return this.transactionClient.signAndSend({ address: address.asString(), rpc }, 10_000);
  };
}
