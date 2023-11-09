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

import { ContractAbi, FnRpcBuilder } from "@partisiablockchain/abi-client-ts";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";
import BN from "bn.js";
import { Buffer } from "buffer";
import { TransactionApi } from "../client/TransactionApi";
import { Address } from "./Addresses";

/**
 * API for the token contract.
 * This minimal implementation only allows for transferring tokens to a single address.
 *
 * The implementation uses the TransactionApi to send transactions, and ABI for the contract to be
 * able to build the RPC for the transfer transaction.
 */
export class TokenContractApi {
  private readonly transactionApi: TransactionApi;
  private readonly abi: ContractAbi;

  constructor(transactionApi: TransactionApi, abi: ContractAbi) {
    this.transactionApi = transactionApi;
    this.abi = abi;
  }

  /**
   * Build and send transfer transaction.
   * @param to receiver of tokens
   * @param amount number of tokens to send
   */
  readonly transfer = (to: string, amount: BN) => {
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = this.buildTransferRpc(to, amount);
    // Then send the payload via the transaction API.
    // We are sending the transaction to the configured address of the token address, and use the
    // GasCost utility to estimate how much the transaction costs.
    return this.transactionApi.sendTransactionAndWait(Address.token, rpc, 10_000);
  };

  /**
   * Build and send mint transaction
   */
  readonly mint = () => {
    const rpc = this.buildMintRpc();
    return this.transactionApi.sendTransactionAndWait(Address.token, rpc, 10_000);
  };

  /**
   * Build the RPC payload for the transfer transaction.
   * @param to receiver of tokens
   * @param amount number of tokens to send
   */
  private readonly buildTransferRpc = (to: string, amount: BN): Buffer => {
    // First construct a Function RPC builder that can format the bytes correctly.
    // Specify the name of the function, i.e. "transfer" and use the ABI to the builder knows how to
    // format for the function.
    const fnBuilder = new FnRpcBuilder("transfer", this.abi);
    // Write the address as bytes in a buffer and add as function argument.
    const encodedAddress = Buffer.from(to, "hex");
    fnBuilder.addAddress(encodedAddress);
    // Add the amount as an u128 function argument.
    fnBuilder.addU128(amount);
    // Write out the encoded function call as bytes and return the result as the RPC.
    const bufferWriter = new BigEndianByteOutput();
    fnBuilder.write(bufferWriter);
    return bufferWriter.toBuffer();
  };

  /**
   * Build the RPC payload for the transfer transaction.
   */
  private readonly buildMintRpc = (): Buffer => {
    const fnBuilder = new FnRpcBuilder("mint", this.abi);
    const bufferWriter = new BigEndianByteOutput();
    fnBuilder.write(bufferWriter);
    return bufferWriter.toBuffer();
  };
}
