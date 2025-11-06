import { http, type Transport } from 'viem';
import { base, mainnet, polygon, arbitrum, optimism } from 'viem/chains';

const getAlchemyUrl = (chainName: string) => {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  if (!apiKey) return null;
  return `https://${chainName}.g.alchemy.com/v2/${apiKey}`;
};

const getInfuraUrl = (chainName: string) => {
  const apiKey = import.meta.env.VITE_INFURA_API_KEY;
  if (!apiKey) return null;
  return `https://${chainName}.infura.io/v3/${apiKey}`;
};

export const transportConfig: Record<number, Transport> = {
  [base.id]: http(
    import.meta.env.VITE_BASE_RPC_URL ||
    getAlchemyUrl('base-mainnet') ||
    'https://mainnet.base.org'
  ),
  [mainnet.id]: http(
    import.meta.env.VITE_ETHEREUM_RPC_URL ||
    getAlchemyUrl('eth-mainnet') ||
    getInfuraUrl('mainnet') ||
    'https://eth.llamarpc.com'
  ),
  [polygon.id]: http(
    import.meta.env.VITE_POLYGON_RPC_URL ||
    getAlchemyUrl('polygon-mainnet') ||
    getInfuraUrl('polygon-mainnet') ||
    'https://polygon-rpc.com'
  ),
  [arbitrum.id]: http(
    import.meta.env.VITE_ARBITRUM_RPC_URL ||
    getAlchemyUrl('arb-mainnet') ||
    'https://arb1.arbitrum.io/rpc'
  ),
  [optimism.id]: http(
    import.meta.env.VITE_OPTIMISM_RPC_URL ||
    getAlchemyUrl('opt-mainnet') ||
    'https://mainnet.optimism.io'
  ),
};

export const rpcConfig = {
  pollingInterval: 4_000,
  retryCount: 3,
  retryDelay: 1_000,
};
