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
export class AverageSalaryGenerated {
  private readonly _client: BlockchainStateClient | undefined;
  private readonly _address: BlockchainAddress | undefined;

  public constructor(
    client: BlockchainStateClient | undefined,
    address: BlockchainAddress | undefined
  ) {
    this._address = address;
    this._client = client;
  }
  public deserializeContractState(_input: AbiInput): ContractState {
    const administrator: BlockchainAddress = _input.readAddress();
    let averageSalaryResult: Option<number> = undefined;
    const averageSalaryResult_isSome = _input.readBoolean();
    if (averageSalaryResult_isSome) {
      const averageSalaryResult_option: number = _input.readU32();
      averageSalaryResult = averageSalaryResult_option;
    }
    let numEmployees: Option<number> = undefined;
    const numEmployees_isSome = _input.readBoolean();
    if (numEmployees_isSome) {
      const numEmployees_option: number = _input.readU32();
      numEmployees = numEmployees_option;
    }
    return { administrator, averageSalaryResult, numEmployees };
  }
  public async getState(): Promise<ContractState> {
    const bytes = await this._client?.getContractStateBinary(this._address!);
    if (bytes === undefined) {
      throw new Error("Unable to get state bytes");
    }
    const input = AbiByteInput.createLittleEndian(bytes);
    return this.deserializeContractState(input);
  }
}
export interface ContractState {
  administrator: BlockchainAddress;
  averageSalaryResult: Option<number>;
  numEmployees: Option<number>;
}

export function initialize(): Buffer {
  return AbiByteOutput.serializeBigEndian((_out) => {
    _out.writeBytes(Buffer.from("ffffffff0f", "hex"));
  });
}

export function computeAverageSalary(): Buffer {
  return AbiByteOutput.serializeBigEndian((_out) => {
    _out.writeU8(0x09);
    _out.writeBytes(Buffer.from("01", "hex"));
  });
}

export function addSalary(): SecretInputBuilder<number> {
  const _publicRpc: Buffer = AbiByteOutput.serializeBigEndian((_out) => {
    _out.writeBytes(Buffer.from("40", "hex"));
  });
  const _secretInput = (secret_input_lambda: number): CompactBitArray =>
    AbiBitOutput.serialize((_out) => {
      _out.writeI32(secret_input_lambda);
    });
  return new SecretInputBuilder<number>(_publicRpc, _secretInput);
}

export function deserializeState(state: StateWithClient): ContractState;
export function deserializeState(bytes: Buffer): ContractState;
export function deserializeState(
  bytes: Buffer,
  client: BlockchainStateClient,
  address: BlockchainAddress
): ContractState;
export function deserializeState(
  state: Buffer | StateWithClient,
  client?: BlockchainStateClient,
  address?: BlockchainAddress
): ContractState {
  if (Buffer.isBuffer(state)) {
    const input = AbiByteInput.createLittleEndian(state);
    return new AverageSalaryGenerated(client, address).deserializeContractState(input);
  } else {
    const input = AbiByteInput.createLittleEndian(state.bytes);
    return new AverageSalaryGenerated(state.client, state.address).deserializeContractState(input);
  }
}
