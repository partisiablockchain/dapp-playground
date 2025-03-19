import {
  BlockchainTransactionClient,
  SentTransaction,
  Transaction,
} from "@partisiablockchain/blockchain-api-transaction-client";

/**
 * Unified interface for connected MPC wallets.
 *
 * These wallets are capable of reporting their address and can sign and send
 * a transaction.
 */
export interface ConnectedWallet {
  /**
   * The address that transactions will be sent from.
   */
  readonly address: string;
  /**
   * Method to sign and send a transaction to the blockchain.
   */
  readonly signAndSendTransaction: (
    client: BlockchainTransactionClient,
    payload: Transaction,
    cost?: string | number
  ) => Promise<SentTransaction>;
}
