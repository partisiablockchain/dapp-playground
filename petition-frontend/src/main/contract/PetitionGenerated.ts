// This file is auto-generated from an abi-file using AbiCodegen.
/* eslint-disable */
// @ts-nocheck
// noinspection ES6UnusedImports
import {
  AbiBitInput,
  AbiBitOutput,
  AbiByteInput,
  AbiByteOutput,
  AbiInput,
  AbiOutput,
  AvlTreeMap,
  BlockchainAddress,
  BlockchainPublicKey,
  BlockchainStateClient,
  BlsPublicKey,
  BlsSignature,
  BN,
  Hash,
  Signature,
  StateWithClient,
  SecretInputBuilder,
} from "@privacyblockchain/abi-client";

type Option<K> = K | undefined;
export class PetitionGenerated {
  private readonly _client: BlockchainStateClient | undefined;
  private readonly _address: BlockchainAddress | undefined;
  
  public constructor(
    client: BlockchainStateClient | undefined,
    address: BlockchainAddress | undefined
  ) {
    this._address = address;
    this._client = client;
  }
  public deserializePetitionState(_input: AbiInput): PetitionState {
    const signedBy_setLength = _input.readI32();
    const signedBy: BlockchainAddress[] = [];
    for (let signedBy_i = 0; signedBy_i < signedBy_setLength; signedBy_i++) {
      const signedBy_elem: BlockchainAddress = _input.readAddress();
      signedBy.push(signedBy_elem);
    }
    const description: string = _input.readString();
    return { signedBy, description };
  }
  public async getState(): Promise<PetitionState> {
    const bytes = await this._client?.getContractStateBinary(this._address!);
    if (bytes === undefined) {
      throw new Error("Unable to get state bytes");
    }
    const input = AbiByteInput.createLittleEndian(bytes);
    return this.deserializePetitionState(input);
  }

}
export interface PetitionState {
  signedBy: BlockchainAddress[];
  description: string;
}

export function initialize(description: string): Buffer {
  return AbiByteOutput.serializeBigEndian((_out) => {
    _out.writeBytes(Buffer.from("ffffffff0f", "hex"));
    _out.writeString(description);
  });
}

export function sign(): Buffer {
  return AbiByteOutput.serializeBigEndian((_out) => {
    _out.writeBytes(Buffer.from("01", "hex"));
  });
}

export function deserializeState(state: StateWithClient): PetitionState;
export function deserializeState(bytes: Buffer): PetitionState;
export function deserializeState(
  bytes: Buffer,
  client: BlockchainStateClient,
  address: BlockchainAddress
): PetitionState;
export function deserializeState(
  state: Buffer | StateWithClient,
  client?: BlockchainStateClient,
  address?: BlockchainAddress
): PetitionState {
  if (Buffer.isBuffer(state)) {
    const input = AbiByteInput.createLittleEndian(state);
    return new PetitionGenerated(client, address).deserializePetitionState(input);
  } else {
    const input = AbiByteInput.createLittleEndian(state.bytes);
    return new PetitionGenerated(
      state.client,
      state.address
    ).deserializePetitionState(input);
  }
}

