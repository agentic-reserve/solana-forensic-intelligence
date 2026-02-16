import axios from 'axios';
import { TransactionData } from '../types';

export class HeliusService {
  private apiKey: string;
  private rpcUrl: string;
  private restUrl: string;
  private wsUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    this.restUrl = `https://api-mainnet.helius-rpc.com/v0`;
    this.wsUrl = `wss://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  }

  async getTransactionsForAddress(address: string, limit: number = 100): Promise<any[]> {
    try {
      // Use Enhanced Transactions API for better parsing
      const response = await axios.get(
        `${this.restUrl}/addresses/${address}/transactions`,
        {
          params: {
            'api-key': this.apiKey,
            limit: Math.min(limit, 100),
            commitment: 'finalized'
          }
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching transactions for ${address}:`, error.response?.data || error.message);
      return [];
    }
  }

  // Get parsed transaction history (Enhanced API)
  async getParsedTransactions(address: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.restUrl}/addresses/${address}/transactions`,
        {
          params: {
            'api-key': this.apiKey,
            limit: Math.min(limit, 100)
          }
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching parsed transactions for ${address}:`, error.response?.data || error.message);
      return [];
    }
  }

  // Parse specific transactions by signature
  async parseTransactions(signatures: string[]): Promise<any[]> {
    try {
      const response = await axios.post(
        `${this.restUrl}/transactions`,
        {
          transactions: signatures.slice(0, 100) // Max 100 per request
        },
        {
          params: {
            'api-key': this.apiKey
          }
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error(`Error parsing transactions:`, error.response?.data || error.message);
      return [];
    }
  }

  // Get WebSocket URL for real-time streaming
  getWebSocketUrl(): string {
    return this.wsUrl;
  }
}
