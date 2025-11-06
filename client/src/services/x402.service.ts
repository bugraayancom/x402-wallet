import axios, { AxiosInstance } from 'axios';
import { x402Config, X402PaymentMethod, X402PaymentStatus } from '@/config/x402.config';

export interface X402PaymentRequest {
  id: string;
  amount: string;
  currency: string;
  recipient: string;
  description?: string;
  method: X402PaymentMethod;
  chainId: number;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

export interface X402PaymentResponse {
  requestId: string;
  status: X402PaymentStatus;
  transactionHash?: string;
  confirmedAt?: number;
  error?: string;
}

export interface X402Facilitator {
  id: string;
  url: string;
  name: string;
  status: 'active' | 'inactive';
  responseTime: number;
  successRate: number;
}

class X402Service {
  private client: AxiosInstance;
  private facilitators: X402Facilitator[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: x402Config.gatewayUrl,
      timeout: x402Config.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Network-ID': x402Config.networkId,
      },
    });

    this.initializeFacilitators();
  }

  /**
   * Initialize facilitator nodes
   */
  private async initializeFacilitators() {
    this.facilitators = x402Config.facilitatorNodes.map((url, index) => ({
      id: `facilitator-${index + 1}`,
      url,
      name: `Facilitator ${index + 1}`,
      status: 'active' as const,
      responseTime: 0,
      successRate: 100,
    }));

    // Check facilitator status
    await this.checkFacilitatorStatus();
  }

  /**
   * Check status of all facilitators
   */
  async checkFacilitatorStatus(): Promise<X402Facilitator[]> {
    const checks = this.facilitators.map(async (facilitator) => {
      try {
        const startTime = Date.now();
        await axios.get(`${facilitator.url}/health`, { timeout: 5000 });
        const responseTime = Date.now() - startTime;

        return {
          ...facilitator,
          status: 'active' as const,
          responseTime,
        };
      } catch (error) {
        return {
          ...facilitator,
          status: 'inactive' as const,
        };
      }
    });

    this.facilitators = await Promise.all(checks);
    return this.facilitators;
  }

  /**
   * Get active facilitators
   */
  getActiveFacilitators(): X402Facilitator[] {
    return this.facilitators.filter((f) => f.status === 'active');
  }

  /**
   * Parse HTTP 402 payment request from response
   */
  parsePaymentRequest(response: any): X402PaymentRequest | null {
    try {
      if (response.status !== 402) {
        return null;
      }

      const paymentHeader = response.headers['www-authenticate'];
      if (!paymentHeader || !paymentHeader.startsWith('x402')) {
        return null;
      }

      // Parse payment details from header
      const paymentData = JSON.parse(response.data);

      return {
        id: paymentData.requestId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'ETH',
        recipient: paymentData.recipient,
        description: paymentData.description,
        method: paymentData.method || 'direct',
        chainId: paymentData.chainId || 1,
        expiresAt: paymentData.expiresAt,
        metadata: paymentData.metadata,
      };
    } catch (error) {
      console.error('Failed to parse payment request:', error);
      return null;
    }
  }

  /**
   * Create a payment request
   */
  async createPaymentRequest(
    request: Omit<X402PaymentRequest, 'id'>
  ): Promise<X402PaymentRequest> {
    try {
      const response = await this.client.post('/payments/create', request);
      return response.data;
    } catch (error) {
      console.error('Failed to create payment request:', error);
      throw error;
    }
  }

  /**
   * Submit a payment
   */
  async submitPayment(
    requestId: string,
    transactionHash: string,
    chainId: number
  ): Promise<X402PaymentResponse> {
    try {
      const response = await this.client.post('/payments/submit', {
        requestId,
        transactionHash,
        chainId,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to submit payment:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(requestId: string): Promise<X402PaymentResponse> {
    try {
      const response = await this.client.get(`/payments/${requestId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }

  /**
   * Verify payment completion
   */
  async verifyPayment(
    requestId: string,
    transactionHash: string
  ): Promise<boolean> {
    try {
      const response = await this.client.post('/payments/verify', {
        requestId,
        transactionHash,
      });

      return response.data.verified === true;
    } catch (error) {
      console.error('Failed to verify payment:', error);
      return false;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(
    address: string,
    limit: number = 20
  ): Promise<X402PaymentResponse[]> {
    try {
      const response = await this.client.get('/payments/history', {
        params: { address, limit },
      });

      return response.data.payments || [];
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  }

  /**
   * Handle automatic payment for HTTP 402 response
   */
  async handleAutomaticPayment(
    paymentRequest: X402PaymentRequest,
    transactionHash: string
  ): Promise<X402PaymentResponse> {
    try {
      // Submit payment
      const response = await this.submitPayment(
        paymentRequest.id,
        transactionHash,
        paymentRequest.chainId
      );

      // Wait for confirmation
      if (response.status === 'pending') {
        // Poll for status updates
        return await this.pollPaymentStatus(paymentRequest.id, 30000);
      }

      return response;
    } catch (error) {
      console.error('Failed to handle automatic payment:', error);
      throw error;
    }
  }

  /**
   * Poll payment status until completed or timeout
   */
  private async pollPaymentStatus(
    requestId: string,
    timeout: number = 30000,
    interval: number = 2000
  ): Promise<X402PaymentResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getPaymentStatus(requestId);

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error('Payment verification timeout');
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<{
    activeFacilitators: number;
    avgResponseTime: number;
    totalTransactions: number;
    networkStatus: 'online' | 'degraded' | 'offline';
  }> {
    try {
      const response = await this.client.get('/network/stats');
      return response.data;
    } catch (error) {
      // Fallback to local facilitator data
      const active = this.getActiveFacilitators();
      const avgResponseTime =
        active.reduce((sum, f) => sum + f.responseTime, 0) / active.length || 0;

      return {
        activeFacilitators: active.length,
        avgResponseTime: Math.round(avgResponseTime),
        totalTransactions: 0,
        networkStatus: active.length > 0 ? 'online' : 'offline',
      };
    }
  }
}

export const x402Service = new X402Service();
