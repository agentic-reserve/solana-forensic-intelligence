import WebSocket from 'ws';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private wsUrl: string;
  private subscriptions: Map<number, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private pingInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);

        this.ws.on('open', () => {
          console.log('✅ WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startPingInterval();
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          try {
            const message = JSON.parse(data.toString());
            
            // Handle subscription responses
            if (message.method === 'accountNotification') {
              const subscriptionId = message.params.subscription;
              const callback = this.subscriptions.get(subscriptionId);
              if (callback) {
                callback(message.params);
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        this.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('WebSocket closed');
          this.isConnecting = false;
          this.stopPingInterval();
          this.attemptReconnect();
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private startPingInterval(): void {
    // Send ping every 60 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 60000);
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  async subscribeToAccount(
    address: string,
    callback: (data: any) => void,
    options: {
      encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
      commitment?: 'finalized' | 'confirmed' | 'processed';
    } = {}
  ): Promise<number> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const requestId = Date.now();
      
      const request = {
        jsonrpc: '2.0',
        id: requestId,
        method: 'accountSubscribe',
        params: [
          address,
          {
            encoding: options.encoding || 'jsonParsed',
            commitment: options.commitment || 'finalized'
          }
        ]
      };

      const responseHandler = (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.id === requestId) {
            if (message.error) {
              reject(new Error(message.error.message));
            } else {
              const subscriptionId = message.result;
              this.subscriptions.set(subscriptionId, callback);
              this.ws?.removeListener('message', responseHandler);
              resolve(subscriptionId);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      this.ws?.on('message', responseHandler);
      this.ws?.send(JSON.stringify(request));

      // Timeout after 10 seconds
      setTimeout(() => {
        this.ws?.removeListener('message', responseHandler);
        reject(new Error('Subscription timeout'));
      }, 10000);
    });
  }

  async subscribeToProgram(
    programId: string,
    callback: (data: any) => void,
    options: {
      encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
      commitment?: 'finalized' | 'confirmed' | 'processed';
      filters?: any[];
    } = {}
  ): Promise<number> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const requestId = Date.now();
      
      const config: any = {
        encoding: options.encoding || 'jsonParsed',
        commitment: options.commitment || 'finalized'
      };

      if (options.filters) {
        config.filters = options.filters;
      }

      const request = {
        jsonrpc: '2.0',
        id: requestId,
        method: 'programSubscribe',
        params: [programId, config]
      };

      const responseHandler = (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.id === requestId) {
            if (message.error) {
              reject(new Error(message.error.message));
            } else {
              const subscriptionId = message.result;
              this.subscriptions.set(subscriptionId, callback);
              this.ws?.removeListener('message', responseHandler);
              resolve(subscriptionId);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      this.ws?.on('message', responseHandler);
      this.ws?.send(JSON.stringify(request));

      setTimeout(() => {
        this.ws?.removeListener('message', responseHandler);
        reject(new Error('Subscription timeout'));
      }, 10000);
    });
  }

  async unsubscribe(subscriptionId: number, type: 'account' | 'program' = 'account'): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    return new Promise((resolve, reject) => {
      const requestId = Date.now();
      const method = type === 'account' ? 'accountUnsubscribe' : 'programUnsubscribe';
      
      const request = {
        jsonrpc: '2.0',
        id: requestId,
        method,
        params: [subscriptionId]
      };

      const responseHandler = (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.id === requestId) {
            this.subscriptions.delete(subscriptionId);
            this.ws?.removeListener('message', responseHandler);
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      };

      this.ws?.on('message', responseHandler);
      this.ws?.send(JSON.stringify(request));

      setTimeout(() => {
        this.ws?.removeListener('message', responseHandler);
        reject(new Error('Unsubscribe timeout'));
      }, 5000);
    });
  }

  disconnect(): void {
    this.stopPingInterval();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.subscriptions.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
