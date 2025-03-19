import {
  SenderAuthentication,
  Signature,
} from "@partisiablockchain/blockchain-api-transaction-client";

interface MetamaskRequestArguments {
  /** The RPC method to request. */
  method: string;
  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown>;
}

interface MetaMask {
  request<T>(args: MetamaskRequestArguments): Promise<T>;
}

/**
 * Initializes a ConnectedWallet by connecting to MetaMask snap.
 *
 * Does not take any arguments as everything is automatically determined from the
 * environment. An error is thrown if the MetaMask extension is not installed.
 */
export const connectMetaMask = async (): Promise<SenderAuthentication> => {
  const snapId = "npm:@partisiablockchain/snap";

  if ("ethereum" in window) {
    const metamask = window.ethereum as MetaMask;

    // Request snap to be installed and connected
    await metamask.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: {},
      },
    });

    // Get the address of the user from the snap
    const userAddress: string = await metamask.request({
      method: "wallet_invokeSnap",
      params: { snapId, request: { method: "get_address" } },
    });

    return {
      getAddress: () => userAddress,
      sign: async (transactionPayload: Buffer, chainId: string): Promise<Signature> => {
        // Request signature from MetaMask
        return await metamask.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: "npm:@partisiablockchain/snap",
            request: {
              method: "sign_transaction",
              params: {
                payload: transactionPayload.toString("hex"),
                chainId,
              },
            },
          },
        });
      },
    };
  } else {
    throw new Error("Unable to find MetaMask extension");
  }
};
