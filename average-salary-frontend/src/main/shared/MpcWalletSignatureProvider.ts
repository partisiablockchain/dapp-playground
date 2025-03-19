import {
  SenderAuthentication,
  Signature,
} from "@partisiablockchain/blockchain-api-transaction-client";
import PartisiaSdk from "partisia-sdk";

/**
 * Initializes a new ConnectedWallet by connecting to Partisia Blockchain
 * Applications MPC wallet.
 *
 * Does not take any arguments as everything is automatically determined from the
 * environment. An error is thrown if the MPC Wallet extension is not installed.
 */
export const connectMpcWallet = async (): Promise<SenderAuthentication> => {
  const partisiaSdk = new PartisiaSdk();
  return partisiaSdk
    .connect({
      // eslint-disable-next-line
      permissions: ["sign" as any],
      dappName: "Wallet integration demo",
      chainId: "Partisia Blockchain Testnet",
    })
    .then(() => {
      const connection = partisiaSdk.connection;
      if (connection != null) {
        // User connection was successful. Use the connection to build up a connected wallet
        // in state.
        return {
          getAddress: () => connection.account.address,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          sign: async (transactionPayload: Buffer, _chainId: string): Promise<Signature> => {
            // Ask the MPC wallet to sign the transaction.
            const res = await partisiaSdk.signMessage({
              payload: transactionPayload.toString("hex"),
              payloadType: "hex",
              dontBroadcast: true,
            });
            return res.signature;
          },
        };
      } else {
        throw new Error("Unable to establish connection to MPC wallet");
      }
    })
    .catch((error) => {
      // Something went wrong with the connection.
      if (error instanceof Error) {
        if (error.message === "Extension not Found") {
          throw new Error("Partisia Wallet Extension not found.");
        } else if (error.message === "user closed confirm window") {
          throw new Error("Sign in using MPC wallet was cancelled");
        } else if (error.message === "user rejected") {
          throw new Error("Sign in using MPC wallet was rejected");
        } else {
          throw error;
        }
      } else {
        throw new Error(error);
      }
    });
};
