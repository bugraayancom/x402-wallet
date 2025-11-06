import { isAddress, parseEther } from 'viem';

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): {
  isValid: boolean;
  error?: string;
} {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }

  if (!isAddress(address)) {
    return { isValid: false, error: 'Invalid Ethereum address' };
  }

  return { isValid: true };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string, balance?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (balance) {
    const numBalance = parseFloat(balance);
    if (numAmount > numBalance) {
      return { isValid: false, error: 'Insufficient balance' };
    }
  }

  try {
    parseEther(amount);
  } catch {
    return { isValid: false, error: 'Invalid amount format' };
  }

  return { isValid: true };
}

/**
 * Validate transaction data
 */
export function validateTransactionData(data: string): {
  isValid: boolean;
  error?: string;
} {
  if (!data) {
    return { isValid: true }; // Optional field
  }

  if (!data.startsWith('0x')) {
    return { isValid: false, error: 'Transaction data must start with 0x' };
  }

  if (data.length % 2 !== 0) {
    return { isValid: false, error: 'Transaction data must have even length' };
  }

  if (!/^0x[0-9a-fA-F]*$/.test(data)) {
    return { isValid: false, error: 'Transaction data contains invalid characters' };
  }

  return { isValid: true };
}

/**
 * Validate gas price
 */
export function validateGasPrice(gasPrice: string): {
  isValid: boolean;
  error?: string;
} {
  if (!gasPrice) {
    return { isValid: false, error: 'Gas price is required' };
  }

  const numGasPrice = parseFloat(gasPrice);

  if (isNaN(numGasPrice) || numGasPrice <= 0) {
    return { isValid: false, error: 'Gas price must be greater than 0' };
  }

  return { isValid: true };
}

/**
 * Validate slippage tolerance (0-100%)
 */
export function validateSlippage(slippage: number): {
  isValid: boolean;
  error?: string;
} {
  if (slippage < 0 || slippage > 100) {
    return { isValid: false, error: 'Slippage must be between 0 and 100%' };
  }

  return { isValid: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Check if URL is safe
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
