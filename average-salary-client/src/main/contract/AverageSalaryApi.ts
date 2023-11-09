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

import { ContractAbi, FnRpcBuilder, ZkInputBuilder } from "@partisiablockchain/abi-client";
import { ZkRpcBuilder, BlockchainAddress, BlockchainPublicKey  } from "@partisiablockchain/zk-client";
import { Buffer } from "buffer";
import { TransactionApi } from "../client/TransactionApi";
import { Address } from "./Addresses";
import { computeAverageSalary } from "./AverageSalary";

/**
 * API for the token contract.
 * This minimal implementation only allows for transferring tokens to a single address.
 *
 * The implementation uses the TransactionApi to send transactions, and ABI for the contract to be
 * able to build the RPC for the transfer transaction.
 */
export class AverageSalaryApi {
  private readonly transactionApi: TransactionApi;
  private readonly sender: BlockchainAddress;
  private readonly abi: ContractAbi;
  private readonly engineKeys: BlockchainPublicKey[]

  constructor(transactionApi: TransactionApi, sender: string, abi: ContractAbi, engineKeys: BlockchainPublicKey[]) {
    this.transactionApi = transactionApi;
    this.sender = BlockchainAddress.fromString(sender);
    this.abi = abi;
    this.engineKeys = engineKeys.map(key => BlockchainPublicKey.fromBuffer(key.asBuffer()));
  }

  /**
   * Build and send transfer transaction.
   * @param to receiver of tokens
   * @param amount number of tokens to send
   */
  readonly addSalary = (amount: number) => {
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = this.buildAddSalaryRpc(amount);
    // Then send the payload via the transaction API.
    // We are sending the transaction to the configured address of the token address, and use the
    // GasCost utility to estimate how much the transaction costs.
    return this.transactionApi.sendTransactionAndWait(Address.averageSalary, rpc, 100_000);
  };

  /**
   * Build and send mint transaction
   */
  readonly compute = () => {
    const rpc = this.ComputeAverageSalaryRpc();
    return this.transactionApi.sendTransactionAndWait(Address.averageSalary, rpc, 10_000);
  };

  /**
   * Build the RPC payload for the transfer transaction.
   * @param to receiver of tokens
   * @param amount number of tokens to send
   */
  private readonly buildAddSalaryRpc = (amount: number): Buffer => {
    const fnBuilder = new FnRpcBuilder("add_salary", this.abi);
    
    const additionalRpc = fnBuilder.getBytes();

    const secretInputBuilder = ZkInputBuilder.createZkInputBuilder("add_salary", this.abi);
    secretInputBuilder.addI32(amount);
    const compactBitArray = secretInputBuilder.getBits();

    return ZkRpcBuilder.zkInputOnChain(this.sender, compactBitArray, additionalRpc, this.engineKeys);
  };

  /**
   * Build the RPC payload for the transfer transaction.
   */
  private readonly ComputeAverageSalaryRpc = (): Buffer => {
    return computeAverageSalary();
  };
}
