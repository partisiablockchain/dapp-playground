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
import { getRequest } from "./BaseClient";
import { ContractCore, ContractData } from "./ContractData";
import { ExecutedTransactionDto } from "./TransactionData";

/**
 * Web client that can get data from PBC.
 */
export class PbcClient {
  readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  public getContractData<T>(
    address: string,
    withState = true
  ): Promise<ContractCore | ContractData<T> | undefined> {
    const query = "?requireContractState=" + withState;
    return getRequest(this.host + "/blockchain/contracts/" + address + query);
  }

  public getAccountData(address: string): Promise<AccountData | undefined> {
    return getRequest<AccountData>(this.host + "/blockchain/account/" + address).then(
      (response?: AccountData) => {
        if (response != null) {
          response.address = address;
        }
        return response;
      }
    );
  }

  public getExecutedTransaction(
    identifier: string,
    requireFinal = true
  ): Promise<ExecutedTransactionDto | undefined> {
    const query = "?requireFinal=" + requireFinal;
    return getRequest(this.host + "/blockchain/transaction/" + identifier + query);
  }
}
