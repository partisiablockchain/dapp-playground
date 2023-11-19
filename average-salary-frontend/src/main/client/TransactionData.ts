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

import { Buffer } from "buffer";

/**
 * This file specifies the data format for transactions, executed transactions and events.
 */
export interface TransactionInner {
  nonce: number;
  validTo: string;
  cost: string;
}

interface ExecutedTransactionDtoInner {
  transactionPayload: string;
  block: string;
  blockTime: number;
  productionTime: number;
  identifier: string;
  executionSucceeded: boolean;
  failureCause?: FailureCause;
  events: EventData[];
  finalized: boolean;
}

export type ExecutedEventTransactionDto = ExecutedTransactionDtoInner;

export interface ExecutedSignedTransactionDto extends ExecutedTransactionDtoInner {
  from: string;
  interactionJarHash: string;
}

export type ExecutedTransactionDto = ExecutedEventTransactionDto | ExecutedSignedTransactionDto;

export type TransactionPayload<PayloadT> = InteractWithContract & PayloadT;

export interface InteractWithContract {
  address: string;
}

export interface Rpc {
  rpc: Buffer;
}

export interface PutTransactionWasSuccessful {
  putSuccessful: true;
  transactionHash: string;
}

export interface PutTransactionWasUnsuccessful {
  putSuccessful: false;
}

export type ShardId = string | null;

export interface EventData {
  identifier: string;
  destinationShard: ShardId;
}

export interface FailureCause {
  errorMessage: string;
  stackTrace: string;
}

export interface TransactionPointer {
  identifier: string;
  destinationShardId: string;
}
