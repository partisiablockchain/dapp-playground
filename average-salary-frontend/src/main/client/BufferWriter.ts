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

/**
 * Utility class used to write specific types of values to a buffer.
 */
export class BufferWriter {
  private buffer: Buffer;

  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  public readonly writeIntBE = (int: number): void => {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(int, 0);
    this.appendBuffer(buffer);
  };

  public readonly writeLongBE = (long: BN): void => {
    this.writeNumberBE(long, 8);
  };

  public readonly writeNumberBE = (num: BN, byteCount: number): void => {
    const buffer = num.toTwos(byteCount * 8).toArrayLike(Buffer, "be", byteCount);
    this.appendBuffer(buffer);
  };

  public readonly writeBuffer = (buffer: Buffer): void => {
    this.appendBuffer(buffer);
  };

  public readonly writeDynamicBuffer = (buffer: Buffer): void => {
    this.writeIntBE(buffer.length);
    this.writeBuffer(buffer);
  };

  public readonly writeHexString = (hex: string): void => {
    this.appendBuffer(Buffer.from(hex, "hex"));
  };

  public readonly toBuffer = (): Buffer => {
    return this.buffer.slice();
  };

  private readonly appendBuffer = (buffer: Buffer) => {
    this.buffer = Buffer.concat([this.buffer, buffer]);
  };
}
