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
    "50424341424909050005020000000002010000000d5065746974696f6e537461746500000002000000097369676e65645f6279100d0000000b6465736372697074696f6e0b010000000b536563726574566172496400000001000000067261775f69640300000002010000000a696e697469616c697a65ffffffff0f000000010000000b6465736372697074696f6e0b02000000047369676e01000000000000",
    "hex"
  )
).parseAbi();

type Option<K> = K | undefined;

export interface PetitionState {
  signedBy: BlockchainAddress[];
  description: string;
}

export function newPetitionState(
  signedBy: BlockchainAddress[],
  description: string
): PetitionState {
  return { signedBy, description };
}

function fromScValuePetitionState(structValue: ScValueStruct): PetitionState {
  return {
    signedBy: structValue
      .getFieldValue("signed_by")!
      .setValue()
      .values.map((sc1) => BlockchainAddress.fromBuffer(sc1.addressValue().value)),
    description: structValue.getFieldValue("description")!.stringValue(),
  };
}

export function deserializePetitionState(state: StateBytes): PetitionState {
  const scValue = new StateReader(state.state, fileAbi.contract, state.avlTrees).readState();
  return fromScValuePetitionState(scValue);
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

export function initialize(description: string): Buffer {
  const fnBuilder = new FnRpcBuilder("initialize", fileAbi.contract);
  fnBuilder.addString(description);
  return fnBuilder.getBytes();
}

export function sign(): Buffer {
  const fnBuilder = new FnRpcBuilder("sign", fileAbi.contract);
  return fnBuilder.getBytes();
}
