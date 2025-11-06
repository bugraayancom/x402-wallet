import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  amount: string;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  chain: string;
  chainId: number;
  from: string;
  to: string;
  gasUsed?: string;
  gasFee?: string;
  blockNumber?: number;
  confirmations?: number;
}

interface TransactionState {
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
  removeTransaction: (hash: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  getPendingTransactions: () => Transaction[];
  getTransactionsByChain: (chainId: number) => Transaction[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  transactions: [],
  pendingTransactions: [],
  isLoading: false,
  error: null,
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          pendingTransactions:
            transaction.status === 'pending'
              ? [transaction, ...state.pendingTransactions]
              : state.pendingTransactions,
        })),

      updateTransaction: (hash, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, ...updates } : tx
          ),
          pendingTransactions:
            updates.status !== 'pending'
              ? state.pendingTransactions.filter((tx) => tx.hash !== hash)
              : state.pendingTransactions.map((tx) =>
                  tx.hash === hash ? { ...tx, ...updates } : tx
                ),
        })),

      removeTransaction: (hash) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.hash !== hash),
          pendingTransactions: state.pendingTransactions.filter(
            (tx) => tx.hash !== hash
          ),
        })),

      setTransactions: (transactions) => set({ transactions }),

      getPendingTransactions: () => {
        return get().transactions.filter((tx) => tx.status === 'pending');
      },

      getTransactionsByChain: (chainId) => {
        return get().transactions.filter((tx) => tx.chainId === chainId);
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions.slice(0, 100), // Keep only last 100 transactions
      }),
    }
  )
);
