export interface X402Config {
  gatewayUrl: string;
  networkId: string;
  facilitatorNodes: string[];
  requestTimeout: number;
  retryAttempts: number;
  enableTestnet: boolean;
}

export const x402Config: X402Config = {
  gatewayUrl: import.meta.env.VITE_X402_GATEWAY_URL || 'https://gateway.x402.org',
  networkId: import.meta.env.VITE_X402_NETWORK_ID || 'x402-mainnet',
  facilitatorNodes: (import.meta.env.VITE_X402_FACILITATOR_NODES || '').split(',').filter(Boolean),
  requestTimeout: 30000,
  retryAttempts: 3,
  enableTestnet: import.meta.env.VITE_ENABLE_TESTNET === 'true',
};

export const X402_PAYMENT_METHODS = {
  DIRECT: 'direct',
  ESCROW: 'escrow',
  SUBSCRIPTION: 'subscription',
} as const;

export const X402_PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type X402PaymentMethod = typeof X402_PAYMENT_METHODS[keyof typeof X402_PAYMENT_METHODS];
export type X402PaymentStatus = typeof X402_PAYMENT_STATUS[keyof typeof X402_PAYMENT_STATUS];
