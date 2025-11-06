import { createConfig, http } from 'wagmi';
import { base, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('WalletConnect Project ID not found. Please add VITE_WALLETCONNECT_PROJECT_ID to your .env file');
}

export const config = createConfig({
  chains: [base, mainnet, polygon, arbitrum, optimism],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'x402 Wallet Studio',
      appLogoUrl: '/logo.png',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'x402 Wallet Studio',
        description: 'A user-friendly wallet for x402 protocol',
        url: 'https://x402.org',
        icons: ['/logo.png'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
