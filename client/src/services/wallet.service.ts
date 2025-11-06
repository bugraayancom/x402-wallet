import { PublicClient, WalletClient, formatEther, parseEther } from 'viem';
import axios from 'axios';

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usdValue: string;
}

export interface WalletBalance {
  chainId: number;
  chainName: string;
  nativeBalance: string;
  nativeUsdValue: string;
  tokens: TokenInfo[];
  totalUsdValue: string;
}

class WalletService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Get native token balance for an address
   */
  async getNativeBalance(
    client: PublicClient,
    address: `0x${string}`
  ): Promise<string> {
    try {
      const balance = await client.getBalance({ address });
      return formatEther(balance);
    } catch (error) {
      console.error('Failed to get native balance:', error);
      throw new Error('Failed to fetch native balance');
    }
  }

  /**
   * Get ERC20 token balance
   */
  async getTokenBalance(
    client: PublicClient,
    tokenAddress: `0x${string}`,
    walletAddress: `0x${string}`
  ): Promise<bigint> {
    try {
      const balance = await client.readContract({
        address: tokenAddress,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ type: 'uint256' }],
          },
        ],
        functionName: 'balanceOf',
        args: [walletAddress],
      });
      return balance as bigint;
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get USD value for a token amount
   */
  async getTokenUsdValue(
    tokenSymbol: string,
    amount: string
  ): Promise<string> {
    try {
      // In production, use a real price API like CoinGecko, CoinMarketCap, etc.
      const response = await axios.get(
        `${this.apiUrl}/prices/${tokenSymbol}`
      );
      const price = response.data.usdPrice || 0;
      const usdValue = parseFloat(amount) * price;
      return usdValue.toFixed(2);
    } catch (error) {
      console.warn(`Failed to get USD value for ${tokenSymbol}:`, error);
      return '0.00';
    }
  }

  /**
   * Get complete wallet balance across multiple chains
   */
  async getWalletBalances(
    clients: Map<number, PublicClient>,
    address: `0x${string}`
  ): Promise<WalletBalance[]> {
    const balances: WalletBalance[] = [];

    for (const [chainId, client] of clients.entries()) {
      try {
        const nativeBalance = await this.getNativeBalance(client, address);
        const chainInfo = this.getChainInfo(chainId);

        // Get USD value for native token
        const nativeUsdValue = await this.getTokenUsdValue(
          chainInfo.nativeCurrency.symbol,
          nativeBalance
        );

        balances.push({
          chainId,
          chainName: chainInfo.name,
          nativeBalance,
          nativeUsdValue,
          tokens: [], // TODO: Fetch ERC20 tokens
          totalUsdValue: nativeUsdValue,
        });
      } catch (error) {
        console.error(`Failed to get balance for chain ${chainId}:`, error);
      }
    }

    return balances;
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(
    address: string,
    chainId: number,
    limit: number = 20
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/transactions/${address}`,
        {
          params: { chainId, limit },
        }
      );
      return response.data.transactions || [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  /**
   * Validate an Ethereum address
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Format address for display (0x1234...5678)
   */
  formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (!this.isValidAddress(address)) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  /**
   * Get chain information
   */
  private getChainInfo(chainId: number) {
    const chains: Record<number, any> = {
      1: { name: 'Ethereum', nativeCurrency: { symbol: 'ETH', decimals: 18 } },
      8453: { name: 'Base', nativeCurrency: { symbol: 'ETH', decimals: 18 } },
      137: { name: 'Polygon', nativeCurrency: { symbol: 'MATIC', decimals: 18 } },
      42161: { name: 'Arbitrum', nativeCurrency: { symbol: 'ETH', decimals: 18 } },
      10: { name: 'Optimism', nativeCurrency: { symbol: 'ETH', decimals: 18 } },
    };
    return chains[chainId] || { name: 'Unknown', nativeCurrency: { symbol: 'ETH', decimals: 18 } };
  }
}

export const walletService = new WalletService();
