import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected, connector } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: balance } = useBalance({
    address,
  });

  const connectWallet = useCallback(async (connectorId?: string) => {
    try {
      const selectedConnector = connectorId
        ? connectors.find(c => c.id === connectorId)
        : connectors[0];

      if (!selectedConnector) {
        toast.error('Wallet connector not found');
        return;
      }

      connect({ connector: selectedConnector });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    }
  }, [connect, connectors]);

  const disconnectWallet = useCallback(() => {
    try {
      disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  const changeNetwork = useCallback(async (chainId: number) => {
    try {
      await switchChain({ chainId });
      toast.success('Network switched successfully');
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  }, [switchChain]);

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    connector,
    connectors,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    changeNetwork,
    connectError,
  };
}
