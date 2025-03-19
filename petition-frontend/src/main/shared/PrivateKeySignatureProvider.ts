// eslint-disable-next-line import/no-extraneous-dependencies
import {
  SenderAuthentication,
  Signature,
} from "@partisiablockchain/blockchain-api-transaction-client";
import { ec } from "elliptic";
import { CryptoUtils } from "../client/CryptoUtils";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";

/**
 * Initializes a ConnectedWallet by inputting the private key directly.
 */
export const connectPrivateKey = async (
  sender: string,
  keyPair: ec.KeyPair
): Promise<SenderAuthentication> => {
  return {
    getAddress: () => sender,
    sign: (transactionPayload: Buffer, chainId: string): Promise<Signature> => {
      const hash = CryptoUtils.hashBuffers([
        transactionPayload,
        BigEndianByteOutput.serialize((out) => out.writeString(chainId)),
      ]);
      return Promise.resolve(CryptoUtils.signatureToBuffer(keyPair.sign(hash)).toString("hex"));
    },
  };
};
