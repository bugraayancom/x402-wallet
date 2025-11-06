import { base, mainnet, polygon, arbitrum, optimism, type Chain } from 'viem/chains';

export interface ChainConfig extends Chain {
  icon: string;
  color: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const supportedChains: ChainConfig[] = [
  {
    ...base,
    icon: '🔵',
    color: 'from-blue-500 to-blue-600',
    blockExplorer: 'https://basescan.org',
  } as ChainConfig,
  {
    ...polygon,
    icon: '🟣',
    color: 'from-purple-500 to-purple-600',
    blockExplorer: 'https://polygonscan.com',
  } as ChainConfig,
  {
    ...mainnet,
    icon: '⬥',
    color: 'from-gray-400 to-gray-500',
    blockExplorer: 'https://etherscan.io',
  } as ChainConfig,
  {
    ...arbitrum,
    icon: '🔷',
    color: 'from-cyan-500 to-cyan-600',
    blockExplorer: 'https://arbiscan.io',
  } as ChainConfig,
  {
    ...optimism,
    icon: '🔴',
    color: 'from-red-500 to-red-600',
    blockExplorer: 'https://optimistic.etherscan.io',
  } as ChainConfig,
];

export const defaultChain = base;

export const getChainById = (chainId: number): ChainConfig | undefined => {
  return supportedChains.find(chain => chain.id === chainId);
};

export const getChainByName = (name: string): ChainConfig | undefined => {
  return supportedChains.find(
    chain => chain.name.toLowerCase() === name.toLowerCase()
  );
};

export const isChainSupported = (chainId: number): boolean => {
  return supportedChains.some(chain => chain.id === chainId);
};
