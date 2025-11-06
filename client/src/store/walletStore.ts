import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ChainBalance {
  chainId: number;
  chainName: string;
  balance: string;
  usdValue: string;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  usdValue: string;
  address: string;
}

interface WalletState {
  // Wallet data
  selectedChain: number | null;
  chainBalances: ChainBalance[];
  totalBalance: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedChain: (chainId: number) => void;
  setChainBalances: (balances: ChainBalance[]) => void;
  setTotalBalance: (balance: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedChain: null,
  chainBalances: [],
  totalBalance: '0',
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedChain: (chainId) => set({ selectedChain: chainId }),

      setChainBalances: (balances) => set({ chainBalances: balances }),

      setTotalBalance: (balance) => set({ totalBalance: balance }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedChain: state.selectedChain,
      }),
    }
  )
);
