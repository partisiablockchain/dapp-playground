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
  BlockchainAddress,
  BlockchainTransactionClient,
} from "@privacyblockchain/blockchain-api-transaction-client";

import { RealZkClient } from "@partisiablockchain/zk-client";
import { addSalary, computeAverageSalary } from "./AverageSalaryGenerated";
import { getContractAddress } from "../AppState";

export interface AverageSalaryBasicState {
  administrator: BlockchainAddress;
  averageSalaryResult: number | undefined;
  numEmployees: number | undefined;
  noSalaries: number;
}

/**
 * API for the average salary contract.
 * This implementation allows for adding salary and computing the result.
 *
 * The implementation uses the AverageSalaryApi to send transactions, and ABI and engine keys for the contract to be
 * able to build the RPC for the add salary transaction.
 */
export class AverageSalaryApi {
  private readonly transactionClient: BlockchainTransactionClient | undefined;
  private readonly zkClient: RealZkClient;
  private readonly sender: BlockchainAddress;

  constructor(
    transactionClient: BlockchainTransactionClient | undefined,
    zkClient: RealZkClient,
    sender: BlockchainAddress
  ) {
    this.transactionClient = transactionClient;
    this.zkClient = zkClient;
    this.sender = sender;
  }

  /**
   * Build and send add salary secret input transaction.
   * @param amount the average salary to input
   */
  readonly addSalary = async (amount: number) => {
    if (this.transactionClient === undefined) {
      throw new Error("No account logged in");
    }

    const addSalarySecretInputBuilder = addSalary();
    const secretInput = addSalarySecretInputBuilder.secretInput(amount);
    const transaction = await this.zkClient.buildOnChainInputTransaction(
      this.sender,
      secretInput.secretInput,
      secretInput.publicRpc
    );

    return this.transactionClient.signAndSend(transaction, 100_000);
  };

  /**
   * Build and send compute transaction
   */
  readonly compute = () => {
    const address = getContractAddress();
    if (address === undefined) {
      throw new Error("No address provided");
    }
    if (this.transactionClient === undefined) {
      throw new Error("No account logged in");
    }
    const rpc = computeAverageSalary();
    return this.transactionClient.signAndSend({ address, rpc }, 10_000);
  };
}
