/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BN from "bn.js";
import {
  AbiParser,
  AbstractBuilder,
  BigEndianReader,
  FileAbi,
  FnKinds,
  FnRpcBuilder,
  RpcReader,
  ScValue,
  ScValueEnum,
  ScValueOption,
  ScValueStruct,
  StateReader,
  TypeIndex,
  StateBytes,
  BlockchainAddress,
} from "@partisiablockchain/abi-client";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";

const fileAbi: FileAbi = new AbiParser(
  Buffer.from(
    "5042434142490a000005020000000002010000000d436f6e74726163745374617465000000030000000d61646d696e6973747261746f720d00000015617665726167655f73616c6172795f726573756c7412030000000d6e756d5f656d706c6f796565731203010000000b536563726574566172496400000001000000067261775f69640300000006010000000a696e697469616c697a65ffffffff0f00000000170000000a6164645f73616c61727940000000000000000c7365637265745f696e707574081100000011696e7075747465645f7661726961626c65cbe680ff0b000000000200000016636f6d707574655f617665726167655f73616c6172790100000000130000001473756d5f636f6d707574655f636f6d706c6574659bb1d1cb080000000014000000116f70656e5f73756d5f7661726961626c65c6f5858c0c000000000000",
    "hex"
  )
).parseAbi();

type Option<K> = K | undefined;

export interface ContractState {
  administrator: BlockchainAddress;
  averageSalaryResult: Option<number>;
  numEmployees: Option<number>;
}

export function newContractState(
  administrator: BlockchainAddress,
  averageSalaryResult: Option<number>,
  numEmployees: Option<number>
): ContractState {
  return { administrator, averageSalaryResult, numEmployees };
}

function fromScValueContractState(structValue: ScValueStruct): ContractState {
  return {
    administrator: BlockchainAddress.fromBuffer(
      structValue.getFieldValue("administrator")!.addressValue().value
    ),
    averageSalaryResult: structValue
      .getFieldValue("average_salary_result")!
      .optionValue()
      .valueOrUndefined((sc1) => sc1.asNumber()),
    numEmployees: structValue
      .getFieldValue("num_employees")!
      .optionValue()
      .valueOrUndefined((sc2) => sc2.asNumber()),
  };
}

export function deserializeContractState(state: StateBytes): ContractState {
  const scValue = new StateReader(state.state, fileAbi.contract, state.avlTrees).readState();
  return fromScValueContractState(scValue);
}

export interface SecretVarId {
  rawId: number;
}

export function newSecretVarId(rawId: number): SecretVarId {
  return { rawId };
}

function fromScValueSecretVarId(structValue: ScValueStruct): SecretVarId {
  return {
    rawId: structValue.getFieldValue("raw_id")!.asNumber(),
  };
}

export function initialize(): Buffer {
  const fnBuilder = new FnRpcBuilder("initialize", fileAbi.contract);
  return fnBuilder.getBytes();
}

export function computeAverageSalary(): Buffer {
  const fnBuilder = new FnRpcBuilder("compute_average_salary", fileAbi.contract);
  return fnBuilder.getBytes();
}
