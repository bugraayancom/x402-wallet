import { WalletClient, PublicClient, parseEther, formatEther, type Hash } from 'viem';
import { Transaction, useTransactionStore } from '@/store/transactionStore';
import { nanoid } from 'nanoid';

export interface SendTransactionParams {
  to: string;
  value: string;
  data?: `0x${string}`;
}

export interface TransactionReceipt {
  hash: Hash;
  blockNumber: bigint;
  status: 'success' | 'reverted';
  gasUsed: bigint;
}

class TransactionService {
  /**
   * Send a native token transaction
   */
  async sendTransaction(
    walletClient: WalletClient,
    publicClient: PublicClient,
    params: SendTransactionParams,
    chainId: number,
    chainName: string
  ): Promise<Hash> {
    try {
      const [account] = await walletClient.getAddresses();

      // Create transaction
      const hash = await walletClient.sendTransaction({
        account,
        to: params.to as `0x${string}`,
        value: parseEther(params.value),
        data: params.data,
      });

      // Add to store as pending
      const transaction: Transaction = {
        id: nanoid(),
        hash,
        type: 'send',
        amount: params.value,
        token: 'ETH',
        status: 'pending',
        timestamp: Date.now(),
        chain: chainName,
        chainId,
        from: account,
        to: params.to,
      };

      useTransactionStore.getState().addTransaction(transaction);

      // Wait for confirmation in background
      this.waitForConfirmation(publicClient, hash, transaction.id);

      return hash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(
    publicClient: PublicClient,
    hash: Hash,
    transactionId: string
  ): Promise<void> {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      // Update transaction status
      useTransactionStore.getState().updateTransaction(hash, {
        status: receipt.status === 'success' ? 'completed' : 'failed',
        blockNumber: Number(receipt.blockNumber),
        gasUsed: formatEther(receipt.gasUsed * receipt.effectiveGasPrice),
        confirmations: 1,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      useTransactionStore.getState().updateTransaction(hash, {
        status: 'failed',
      });
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    publicClient: PublicClient,
    from: `0x${string}`,
    to: `0x${string}`,
    value: string,
    data?: `0x${string}`
  ): Promise<bigint> {
    try {
      const gas = await publicClient.estimateGas({
        account: from,
        to,
        value: parseEther(value),
        data,
      });
      return gas;
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(publicClient: PublicClient): Promise<bigint> {
    try {
      const gasPrice = await publicClient.getGasPrice();
      return gasPrice;
    } catch (error) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }

  /**
   * Calculate transaction fee
   */
  async calculateFee(
    publicClient: PublicClient,
    from: `0x${string}`,
    to: `0x${string}`,
    value: string
  ): Promise<{ gasEstimate: string; gasFee: string; totalCost: string }> {
    try {
      const gasEstimate = await this.estimateGas(publicClient, from, to, value);
      const gasPrice = await this.getGasPrice(publicClient);
      const gasFee = gasEstimate * gasPrice;

      return {
        gasEstimate: gasEstimate.toString(),
        gasFee: formatEther(gasFee),
        totalCost: formatEther(parseEther(value) + gasFee),
      };
    } catch (error) {
      console.error('Failed to calculate fee:', error);
      throw error;
    }
  }

  /**
   * Get transaction by hash
   */
  async getTransaction(
    publicClient: PublicClient,
    hash: Hash
  ): Promise<any> {
    try {
      const transaction = await publicClient.getTransaction({ hash });
      return transaction;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(
    publicClient: PublicClient,
    hash: Hash
  ): Promise<TransactionReceipt | null> {
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash });
      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
        gasUsed: receipt.gasUsed,
      };
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      return null;
    }
  }

  /**
   * Cancel/Speed up a pending transaction (by replacing with higher gas)
   */
  async speedUpTransaction(
    walletClient: WalletClient,
    publicClient: PublicClient,
    originalHash: Hash,
    gasMultiplier: number = 1.2
  ): Promise<Hash> {
    try {
      const originalTx = await publicClient.getTransaction({ hash: originalHash });

      if (!originalTx.gasPrice) {
        throw new Error('Cannot speed up transaction without gas price');
      }

      const [account] = await walletClient.getAddresses();
      const newGasPrice = BigInt(Math.floor(Number(originalTx.gasPrice) * gasMultiplier));

      const hash = await walletClient.sendTransaction({
        account,
        to: originalTx.to!,
        value: originalTx.value,
        data: originalTx.input,
        gasPrice: newGasPrice,
        nonce: originalTx.nonce,
      });

      return hash;
    } catch (error) {
      console.error('Failed to speed up transaction:', error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
