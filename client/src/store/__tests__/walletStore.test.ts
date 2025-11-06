import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from '../walletStore';

describe('walletStore', () => {
  beforeEach(() => {
    useWalletStore.getState().reset();
  });

  it('should initialize with default state', () => {
    const state = useWalletStore.getState();
    expect(state.selectedChain).toBeNull();
    expect(state.chainBalances).toEqual([]);
    expect(state.totalBalance).toBe('0');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set selected chain', () => {
    useWalletStore.getState().setSelectedChain(1);
    expect(useWalletStore.getState().selectedChain).toBe(1);
  });

  it('should set chain balances', () => {
    const balances = [
      {
        chainId: 1,
        chainName: 'Ethereum',
        balance: '1.5',
        usdValue: '3000',
        tokens: [],
      },
    ];
    useWalletStore.getState().setChainBalances(balances);
    expect(useWalletStore.getState().chainBalances).toEqual(balances);
  });

  it('should set total balance', () => {
    useWalletStore.getState().setTotalBalance('5000');
    expect(useWalletStore.getState().totalBalance).toBe('5000');
  });

  it('should set loading state', () => {
    useWalletStore.getState().setLoading(true);
    expect(useWalletStore.getState().isLoading).toBe(true);
  });

  it('should set error', () => {
    const error = 'Failed to fetch balance';
    useWalletStore.getState().setError(error);
    expect(useWalletStore.getState().error).toBe(error);
  });

  it('should reset to initial state', () => {
    const store = useWalletStore.getState();
    store.setSelectedChain(1);
    store.setTotalBalance('1000');
    store.setLoading(true);

    store.reset();

    const state = useWalletStore.getState();
    expect(state.selectedChain).toBeNull();
    expect(state.totalBalance).toBe('0');
    expect(state.isLoading).toBe(false);
  });
});
