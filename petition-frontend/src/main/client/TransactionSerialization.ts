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

import BN from "bn.js";
import { BufferWriter } from "./BufferWriter";
import { Rpc, TransactionInner, TransactionPayload } from "./TransactionData";

/**
 * Helper function to serialize a transaction into bytes.
 * @param inner the inner transaction
 * @param data the actual payload
 */
export function serializeTransaction(
  inner: TransactionInner,
  data: TransactionPayload<Rpc>
): Buffer {
  const bufferWriter = new BufferWriter();
  serializeTransactionInner(bufferWriter, inner);
  bufferWriter.writeHexString(data.address);
  bufferWriter.writeDynamicBuffer(data.rpc);
  return bufferWriter.toBuffer();
}

function serializeTransactionInner(bufferWriter: BufferWriter, inner: TransactionInner) {
  bufferWriter.writeLongBE(new BN(inner.nonce));
  bufferWriter.writeLongBE(new BN(inner.validTo));
  bufferWriter.writeLongBE(new BN(inner.cost));
}
