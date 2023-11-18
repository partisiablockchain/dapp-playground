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

import { AccountData } from "./AccountData";
import { putRequest } from "./BaseClient";
import { ContractCore, ContractData } from "./ContractData";
import { PbcClient } from "./PbcClient";
import {
  ExecutedTransactionDto,
  PutTransactionWasSuccessful,
  PutTransactionWasUnsuccessful,
  ShardId,
  TransactionPointer,
} from "./TransactionData";

export interface ShardSuccessfulTransactionResponse extends PutTransactionWasSuccessful {
  shard: ShardId;
}

export type ShardPutTransactionResponse =
  | ShardSuccessfulTransactionResponse
  | PutTransactionWasUnsuccessful;

/**
 * Web client that can handle the sending requests to the correct shard of PBC.
 */
export class ShardedClient {
  private readonly masterClient: PbcClient;
  private readonly shardClients: { [key: string]: PbcClient };
  private readonly shards: string[];
  private readonly baseUrl: string;

  constructor(baseUrl: string, shards: string[]) {
    this.baseUrl = baseUrl;
    this.shards = shards;
    this.masterClient = new PbcClient(baseUrl);
    this.shardClients = {};
    for (const shard of shards) {
      this.shardClients[shard] = new PbcClient(baseUrl + "/shards/" + shard);
    }
  }

  public getClient(shardId: ShardId): PbcClient {
    if (shardId == null || this.shards.length === 0) {
      return this.masterClient;
    } else {
      return this.shardClients[shardId];
    }
  }

  public shardForAddress(address: string): string | null {
    if (this.shards.length === 0) {
      return null;
    } else {
      const buffer = Buffer.from(address, "hex");
      const shardIndex = Math.abs(buffer.readInt32BE(17)) % this.shards.length;
      return this.shards[shardIndex];
    }
  }

  public getAccountData(address: string): Promise<AccountData | undefined> {
    return this.clientForAddress(address).getAccountData(address);
  }

  public getContractData<T>(
    address: string,
    withState?: true
  ): Promise<ContractData<T> | undefined>;
  public getContractData<T>(
    address: string,
    withState?: boolean
  ): Promise<ContractData<T> | ContractCore | undefined> {
    const requireState = withState === undefined || withState;
    if (requireState) {
      return this.clientForAddress(address).getContractData(address, requireState);
    } else {
      return this.clientForAddress(address).getContractData(address, requireState);
    }
  }

  public getExecutedTransaction(
    shard: ShardId,
    identifier: string,
    requireFinal?: boolean
  ): Promise<ExecutedTransactionDto | undefined> {
    return this.getClient(shard).getExecutedTransaction(identifier, requireFinal);
  }

  public putTransaction(transaction: Buffer): Promise<TransactionPointer | undefined> {
    const byteJson = { payload: transaction.toString("base64") };
    return putRequest(this.baseUrl + "/chain/transactions", byteJson);
  }

  private clientForAddress(address: string) {
    return this.getClient(this.shardForAddress(address));
  }
}
