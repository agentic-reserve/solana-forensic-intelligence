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

  async getTransactionsForAddress(address: string, limit: number = 100): Promise<TransactionData[]> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransactionsForAddress',
        params: [
          address,
          {
            transactionDetails: 'full',
            sortOrder: 'desc',
            limit,
            filters: {
              status: 'succeeded',
              tokenAccounts: 'balanceChanged'
            },
            encoding: 'jsonParsed',
            maxSupportedTransactionVersion: 0
          }
        ]
      });

      return response.data.result?.data || [];
    } catch (error) {
      console.error(`Error fetching transactions for ${address}:`, error);
      return [];
    }
  }

  // Alternative: Use REST API v0 for transactions
  async getTransactionsV0(address: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.restUrl}/addresses/${address}/transactions`,
        {
          params: {
            'api-key': this.apiKey,
            limit
          }
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching transactions v0 for ${address}:`, error.response?.data || error.message);
      return [];
    }
  }

  async getTransactionDetails(signature: string): Promise<any> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [
          signature,
          {
            encoding: 'jsonParsed',
            maxSupportedTransactionVersion: 0
          }
        ]
      });

      return response.data.result;
    } catch (error) {
      console.error(`Error fetching transaction ${signature}:`, error);
      return null;
    }
  }

  // Get parsed transaction history (Enhanced API)
  async getParsedTransactions(address: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.restUrl}/addresses/${address}/transactions`,
        {
          params: {
            'api-key': this.apiKey
          }
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching parsed transactions for ${address}:`, error.response?.data || error.message);
      return [];
    }
  }

  // Get WebSocket URL for real-time streaming
  getWebSocketUrl(): string {
    return this.wsUrl;
  }
}
