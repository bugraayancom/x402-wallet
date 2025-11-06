import { describe, it, expect } from 'vitest';
import {
  validateAddress,
  validateAmount,
  validateTransactionData,
  validateGasPrice,
  validateSlippage,
  sanitizeInput,
  isSafeUrl,
} from '../validation';

describe('validation utils', () => {
  describe('validateAddress', () => {
    it('should validate correct Ethereum address', () => {
      const result = validateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid address', () => {
      const result = validateAddress('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject empty address', () => {
      const result = validateAddress('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Address is required');
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amount', () => {
      const result = validateAmount('1.5');
      expect(result.isValid).toBe(true);
    });

    it('should reject negative amount', () => {
      const result = validateAmount('-1');
      expect(result.isValid).toBe(false);
    });

    it('should reject zero amount', () => {
      const result = validateAmount('0');
      expect(result.isValid).toBe(false);
    });

    it('should check balance if provided', () => {
      const result = validateAmount('10', '5');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Insufficient balance');
    });

    it('should accept amount within balance', () => {
      const result = validateAmount('3', '5');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateTransactionData', () => {
    it('should validate empty data', () => {
      const result = validateTransactionData('');
      expect(result.isValid).toBe(true);
    });

    it('should validate hex data', () => {
      const result = validateTransactionData('0x123abc');
      expect(result.isValid).toBe(true);
    });

    it('should reject data without 0x prefix', () => {
      const result = validateTransactionData('123abc');
      expect(result.isValid).toBe(false);
    });

    it('should reject data with odd length', () => {
      const result = validateTransactionData('0x123');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateGasPrice', () => {
    it('should validate positive gas price', () => {
      const result = validateGasPrice('50');
      expect(result.isValid).toBe(true);
    });

    it('should reject zero gas price', () => {
      const result = validateGasPrice('0');
      expect(result.isValid).toBe(false);
    });

    it('should reject negative gas price', () => {
      const result = validateGasPrice('-10');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateSlippage', () => {
    it('should validate slippage within range', () => {
      const result = validateSlippage(0.5);
      expect(result.isValid).toBe(true);
    });

    it('should reject slippage below 0', () => {
      const result = validateSlippage(-1);
      expect(result.isValid).toBe(false);
    });

    it('should reject slippage above 100', () => {
      const result = validateSlippage(101);
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should remove javascript: protocol', () => {
      const result = sanitizeInput('javascript:alert(1)');
      expect(result.toLowerCase()).not.toContain('javascript:');
    });

    it('should trim whitespace', () => {
      const result = sanitizeInput('  test  ');
      expect(result).toBe('test');
    });
  });

  describe('isSafeUrl', () => {
    it('should accept https URLs', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
    });

    it('should accept http URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('should reject javascript: URLs', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isSafeUrl('not a url')).toBe(false);
    });
  });
});
