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

import { CLIENT } from "../AppState";
import { ConnectedWallet } from "../ConnectedWallet";
import { ShardId } from "./TransactionData";

export type CallbackPromise = Promise<string>;

/**
 * API for sending transactions to PBC.
 * The API uses a connected user wallet, to sign and send the transaction.
 * If the transaction was successful it calls a provided function to update the contract state in
 * the UI.
 */
export class TransactionApi {
  public static readonly TRANSACTION_TTL: number = 60_000;
  private static readonly DELAY_BETWEEN_RETRIES = 1_000;
  private static readonly MAX_TRIES = TransactionApi.TRANSACTION_TTL / this.DELAY_BETWEEN_RETRIES;
  private readonly userWallet: ConnectedWallet;
  private readonly fetchUpdatedState: () => void;

  constructor(userWallet: ConnectedWallet, fetch: () => void) {
    this.userWallet = userWallet;
    this.fetchUpdatedState = fetch;
  }

  public readonly sendTransactionAndWait = (
    address: string,
    rpc: Buffer,
    gasCost: number
  ): CallbackPromise => {
    return this.userWallet
      .signAndSendTransaction(
        {
          rpc,
          address,
        },
        gasCost
      )
      .then((putResponse) => {
        if (putResponse.putSuccessful) {
          return this.waitForTransaction(putResponse.shard, putResponse.transactionHash)
            .then(() => {
              this.fetchUpdatedState();
              return putResponse.transactionHash;
            })
            .catch((reason) => {
              throw reason;
            });
        } else {
          throw new Error("Transaction could not be sent");
        }
      });
  };

  private readonly delay = (millis: number): Promise<unknown> => {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  private readonly waitForTransaction = (
    shard: ShardId,
    identifier: string,
    tryCount = 0
  ): Promise<void> => {
    return CLIENT.getExecutedTransaction(shard, identifier).then((executedTransaction) => {
      if (executedTransaction == null) {
        if (tryCount >= TransactionApi.MAX_TRIES) {
          throw new Error(
            'Transaction "' + identifier + '" not finalized at shard "' + shard + '"'
          );
        } else {
          return this.delay(TransactionApi.DELAY_BETWEEN_RETRIES).then(() =>
            this.waitForTransaction(shard, identifier, tryCount + 1)
          );
        }
      } else if (!executedTransaction.executionSucceeded) {
        throw new Error('Transaction "' + identifier + '" failed at shard "' + shard + '"');
      } else {
        return Promise.all(
          executedTransaction.events.map((e) =>
            this.waitForTransaction(e.destinationShard, e.identifier)
          )
        ).then(() => undefined);
      }
    });
  };
}
