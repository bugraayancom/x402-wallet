import express, { Request, Response } from 'express';

const router = express.Router();

// Mock price data - In production, use real APIs like CoinGecko, CoinMarketCap
const mockPrices: Record<string, number> = {
  ETH: 2000,
  MATIC: 0.80,
  BTC: 45000,
  USDC: 1,
  USDT: 1,
};

/**
 * Get token price in USD
 */
router.get('/prices/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const price = mockPrices[symbol.toUpperCase()];

  if (!price) {
    return res.status(404).json({
      error: 'Token not found',
      symbol,
    });
  }

  res.json({
    symbol: symbol.toUpperCase(),
    usdPrice: price,
    timestamp: Date.now(),
  });
});

/**
 * Get multiple token prices
 */
router.post('/prices/batch', (req: Request, res: Response) => {
  const { symbols } = req.body;

  if (!Array.isArray(symbols)) {
    return res.status(400).json({ error: 'symbols must be an array' });
  }

  const prices = symbols.map((symbol) => ({
    symbol: symbol.toUpperCase(),
    usdPrice: mockPrices[symbol.toUpperCase()] || 0,
  }));

  res.json({ prices, timestamp: Date.now() });
});

/**
 * Get transaction history for an address
 */
router.get('/transactions/:address', (req: Request, res: Response) => {
  const { address } = req.params;
  const { chainId, limit = 20 } = req.query;

  // Mock transaction history
  const transactions = [
    {
      hash: '0x1a2b3c4d5e6f',
      type: 'receive',
      amount: '0.5',
      token: 'ETH',
      status: 'completed',
      timestamp: Date.now() - 120000,
      from: '0x123...',
      to: address,
      chainId: Number(chainId) || 1,
    },
    {
      hash: '0x7g8h9i0j1k2l',
      type: 'send',
      amount: '0.25',
      token: 'USDC',
      status: 'completed',
      timestamp: Date.now() - 3600000,
      from: address,
      to: '0x456...',
      chainId: Number(chainId) || 1,
    },
  ];

  res.json({
    address,
    chainId: Number(chainId),
    transactions: transactions.slice(0, Number(limit)),
    total: transactions.length,
  });
});

/**
 * Get gas prices for multiple chains
 */
router.get('/gas-prices', (req: Request, res: Response) => {
  const gasPrices = {
    1: { // Ethereum
      low: 25,
      medium: 30,
      high: 40,
      unit: 'gwei',
    },
    8453: { // Base
      low: 0.001,
      medium: 0.002,
      high: 0.003,
      unit: 'gwei',
    },
    137: { // Polygon
      low: 30,
      medium: 40,
      high: 50,
      unit: 'gwei',
    },
    42161: { // Arbitrum
      low: 0.1,
      medium: 0.2,
      high: 0.3,
      unit: 'gwei',
    },
  };

  res.json({
    prices: gasPrices,
    timestamp: Date.now(),
  });
});

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

/**
 * x402 payment endpoints
 */

// Create payment request
router.post('/x402/payments/create', (req: Request, res: Response) => {
  const { amount, currency, recipient, description, method, chainId } = req.body;

  const paymentRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency: currency || 'ETH',
    recipient,
    description,
    method: method || 'direct',
    chainId: chainId || 1,
    expiresAt: Date.now() + 3600000, // 1 hour
    createdAt: Date.now(),
    status: 'pending',
  };

  res.status(201).json(paymentRequest);
});

// Submit payment
router.post('/x402/payments/submit', (req: Request, res: Response) => {
  const { requestId, transactionHash, chainId } = req.body;

  if (!requestId || !transactionHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  res.json({
    requestId,
    status: 'completed',
    transactionHash,
    chainId,
    confirmedAt: Date.now(),
  });
});

// Get payment status
router.get('/x402/payments/:requestId/status', (req: Request, res: Response) => {
  const { requestId } = req.params;

  res.json({
    requestId,
    status: 'completed',
    transactionHash: '0xabc123...',
    confirmedAt: Date.now(),
  });
});

// Verify payment
router.post('/x402/payments/verify', (req: Request, res: Response) => {
  const { requestId, transactionHash } = req.body;

  if (!requestId || !transactionHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  res.json({
    verified: true,
    requestId,
    transactionHash,
    timestamp: Date.now(),
  });
});

// Get payment history
router.get('/x402/payments/history', (req: Request, res: Response) => {
  const { address, limit = 20 } = req.query;

  const payments = [
    {
      requestId: 'req_123',
      status: 'completed',
      amount: '0.5',
      currency: 'ETH',
      transactionHash: '0xabc...',
      timestamp: Date.now() - 120000,
    },
  ];

  res.json({
    address,
    payments: payments.slice(0, Number(limit)),
    total: payments.length,
  });
});

// Get x402 network stats
router.get('/x402/network/stats', (_req: Request, res: Response) => {
  res.json({
    activeFacilitators: 7,
    avgResponseTime: 95,
    totalTransactions: 12458,
    networkStatus: 'online',
    timestamp: Date.now(),
  });
});

export default router;
