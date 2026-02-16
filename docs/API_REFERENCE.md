# API Reference

## Introduction

This document provides comprehensive API reference for the Solana Forensic Intelligence Platform. It covers all public interfaces, methods, and data structures used throughout the system.

---

## Table of Contents

1. [Helius Service API](#helius-service-api)
2. [Forensic Visualizer API](#forensic-visualizer-api)
3. [Data Structures](#data-structures)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Helius Service API

### Class: HeliusService

Primary interface for interacting with the Helius API.

#### Constructor

```typescript
constructor(apiKey: string, network?: string)
```

**Parameters:**
- `apiKey` (string): Helius API key
- `network` (string, optional): Network selection ('mainnet-beta', 'devnet', 'testnet')

**Example:**
```typescript
const helius = new HeliusService('your_api_key', 'mainnet-beta');
```

#### Methods

##### getTransactionsForAddress

Retrieves transaction history for a given address.

```typescript
async getTransactionsForAddress(
  address: string,
  limit?: number,
  before?: string
): Promise<Transaction[]>
```

**Parameters:**
- `address` (string): Solana address to query
- `limit` (number, optional): Maximum number of transactions (default: 100, max: 1000)
- `before` (string, optional): Pagination cursor

**Returns:**
- Promise<Transaction[]>: Array of transaction objects

**Example:**
```typescript
const transactions = await helius.getTransactionsForAddress(
  '3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH',
  100
);
```

**Error Handling:**
- Throws `APIError` if request fails
- Throws `RateLimitError` if rate limit exceeded
- Throws `ValidationError` if address invalid

##### getWalletIdentity

Retrieves identity information for known addresses.

```typescript
async getWalletIdentity(address: string): Promise<Identity | null>
```

**Parameters:**
- `address` (string): Solana address to query

**Returns:**
- Promise<Identity | null>: Identity object or null if unknown

**Example:**
```typescript
const identity = await helius.getWalletIdentity(
  'HXsKP7wrBWaQ8T2Vtjry3Nj3oUgwYcqq9vrHDM12G664'
);
```

##### getWalletBalances

Retrieves token and NFT balances for an address.

```typescript
async getWalletBalances(
  address: string,
  options?: BalanceOptions
): Promise<BalanceResponse>
```

**Parameters:**
- `address` (string): Solana address to query
- `options` (BalanceOptions, optional): Query options

**BalanceOptions:**
```typescript
interface BalanceOptions {
  page?: number;
  limit?: number;
  showZeroBalance?: boolean;
  showNative?: boolean;
  showNfts?: boolean;
}
```

**Returns:**
- Promise<BalanceResponse>: Balance information

**Example:**
```typescript
const balances = await helius.getWalletBalances(
  '3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH',
  { showNfts: true, limit: 100 }
);
```

---

## Forensic Visualizer API

### Class: ForensicVisualizer

Main class for forensic analysis and visualization.

#### Constructor

```typescript
constructor(apiKey: string)
```

**Parameters:**
- `apiKey` (string): Helius API key

**Example:**
```typescript
const visualizer = new ForensicVisualizer('your_api_key');
```

#### Methods

##### analyze

Performs comprehensive forensic analysis.

```typescript
async analyze(
  targetAddress: string,
  depth: number
): Promise<ForensicGraph>
```

**Parameters:**
- `targetAddress` (string): Address to investigate
- `depth` (number): Analysis depth (1-5)

**Returns:**
- Promise<ForensicGraph>: Complete graph structure

**Example:**
```typescript
const graph = await visualizer.analyze(
  '3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH',
  3
);
```

**Performance:**
- Depth 1: ~10 seconds
- Depth 2: ~30 seconds
- Depth 3: ~2 minutes
- Depth 4: ~5 minutes
- Depth 5: ~10 minutes

##### exportToGephi

Exports graph data in Gephi-compatible format.

```typescript
exportToGephi(graph: ForensicGraph, outputPath: string): void
```

**Parameters:**
- `graph` (ForensicGraph): Graph to export
- `outputPath` (string): Output directory path

**Output Files:**
- `nodes.csv`: Node data
- `edges.csv`: Edge data

**Example:**
```typescript
visualizer.exportToGephi(graph, './output');
```

##### exportTransactionTable

Exports detailed transaction table.

```typescript
exportTransactionTable(graph: ForensicGraph, outputPath: string): void
```

**Parameters:**
- `graph` (ForensicGraph): Graph to export
- `outputPath` (string): Output directory path

**Output Files:**
- `transactions_table.csv`: All transactions

**Example:**
```typescript
visualizer.exportTransactionTable(graph, './output');
```

##### exportClusterAnalysis

Exports cluster analysis data.

```typescript
exportClusterAnalysis(outputPath: string): void
```

**Parameters:**
- `outputPath` (string): Output directory path

**Output Files:**
- `clusters.csv`: Cluster information
- `cluster_members.csv`: Membership data

**Example:**
```typescript
visualizer.exportClusterAnalysis('./output');
```

##### generateHTMLVisualization

Generates interactive HTML visualization.

```typescript
generateHTMLVisualization(
  graph: ForensicGraph,
  outputPath: string
): void
```

**Parameters:**
- `graph` (ForensicGraph): Graph to visualize
- `outputPath` (string): Output directory path

**Output Files:**
- `visualization.html`: Interactive graph

**Example:**
```typescript
visualizer.generateHTMLVisualization(graph, './output');
```

---

## Data Structures

### Node

Represents an address in the transaction network.

```typescript
interface Node {
  id: string;                    // Address public key
  label: string;                 // Display label
  type: 'target' | 'counterparty' | 'cluster';
  totalReceived: number;         // Total SOL received (lamports)
  totalSent: number;             // Total SOL sent (lamports)
  transactionCount: number;      // Number of transactions
  firstSeen: string;             // ISO 8601 timestamp
  lastSeen: string;              // ISO 8601 timestamp
  riskScore: number;             // 0-100
  tags: string[];                // Risk tags
}
```

**Example:**
```json
{
  "id": "3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH",
  "label": "3nMNd89A...FHyyH",
  "type": "target",
  "totalReceived": 125450000000,
  "totalSent": 98760000000,
  "transactionCount": 234,
  "firstSeen": "2024-01-01T08:30:00Z",
  "lastSeen": "2024-01-15T16:45:00Z",
  "riskScore": 67,
  "tags": ["HIGH_ACTIVITY", "IMBALANCED_FLOW"]
}
```

### Edge

Represents a transaction flow between two addresses.

```typescript
interface Edge {
  id: string;                    // Unique edge identifier
  source: string;                // Source address
  target: string;                // Target address
  weight: number;                // Total volume (lamports)
  transactionCount: number;      // Number of transactions
  direction: 'unidirectional' | 'bidirectional';
  type: 'SOL' | 'TOKEN' | 'MIXED';
  transactions: TransactionDetail[];
}
```

**Example:**
```json
{
  "id": "3nMNd89A-6LMcuyBs",
  "source": "3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH",
  "target": "6LMcuyBsNDWnafgxp4LZRkxFEQsTsgiEyEyqXFHyyH",
  "weight": 45670000000,
  "transactionCount": 23,
  "direction": "bidirectional",
  "type": "SOL",
  "transactions": [...]
}
```

### TransactionDetail

Represents a single transaction.

```typescript
interface TransactionDetail {
  signature: string;             // Transaction signature
  timestamp: string;             // ISO 8601 timestamp
  amount: number;                // Amount (lamports)
  type: 'SOL' | 'TOKEN';
  status: 'success' | 'failed';
  from: string;                  // Source address
  to: string;                    // Destination address
}
```

**Example:**
```json
{
  "signature": "5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXF...",
  "timestamp": "2024-01-15T10:30:00Z",
  "amount": 1500000000,
  "type": "SOL",
  "status": "success",
  "from": "3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH",
  "to": "6LMcuyBsNDWnafgxp4LZRkxFEQsTsgiEyEyqXFHyyH"
}
```

### ForensicGraph

Complete graph structure.

```typescript
interface ForensicGraph {
  nodes: Node[];
  edges: Edge[];
  metadata: GraphMetadata;
}

interface GraphMetadata {
  targetAddress: string;
  depth: number;
  totalNodes: number;
  totalEdges: number;
  totalVolume: number;
  analysisDate: string;
}
```

**Example:**
```json
{
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "targetAddress": "3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH",
    "depth": 3,
    "totalNodes": 50,
    "totalEdges": 127,
    "totalVolume": 1234560000000,
    "analysisDate": "2024-01-15T10:30:00Z"
  }
}
```

### ClusterAnalysis

Cluster detection results.

```typescript
interface ClusterAnalysis {
  clusterId: string;
  addresses: string[];
  totalVolume: number;
  transactionCount: number;
  pattern: 'accumulation' | 'distribution' | 'mixing' | 'normal';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
```

**Example:**
```json
{
  "clusterId": "CLUSTER_1",
  "addresses": [
    "3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH",
    "6LMcuyBsNDWnafgxp4LZRkxFEQsTsgiEyEyqXFHyyH"
  ],
  "totalVolume": 1234560000000,
  "transactionCount": 456,
  "pattern": "mixing",
  "riskLevel": "critical"
}
```

---

## Type Definitions

### Transaction

```typescript
interface Transaction {
  signature: string;
  slot: number;
  blockTime: number;
  transaction: {
    signatures: string[];
    message: {
      accountKeys: string[];
      instructions: Instruction[];
      recentBlockhash: string;
    };
  };
  meta: {
    err: any | null;
    fee: number;
    preBalances: number[];
    postBalances: number[];
    innerInstructions: InnerInstruction[];
  };
}
```

### Identity

```typescript
interface Identity {
  address: string;
  type: string;
  name: string;
  category: string;
  tags: string[];
}
```

### BalanceResponse

```typescript
interface BalanceResponse {
  balances: TokenBalance[];
  nfts?: Nft[];
  totalUsdValue: number;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface TokenBalance {
  mint: string;
  symbol: string | null;
  name: string | null;
  balance: number;
  decimals: number;
  pricePerToken: number | null;
  usdValue: number | null;
  logoUri: string | null;
  tokenProgram: 'spl-token' | 'token-2022';
}
```

---

## Error Handling

### Error Types

#### APIError

Thrown when API requests fail.

```typescript
class APIError extends Error {
  statusCode: number;
  response: any;
  
  constructor(message: string, statusCode: number, response: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}
```

**Example:**
```typescript
try {
  const transactions = await helius.getTransactionsForAddress(address);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  }
}
```

#### RateLimitError

Thrown when rate limits are exceeded.

```typescript
class RateLimitError extends Error {
  retryAfter: number;
  
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
```

**Example:**
```typescript
try {
  const transactions = await helius.getTransactionsForAddress(address);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter}ms`);
    await sleep(error.retryAfter);
  }
}
```

#### ValidationError

Thrown when input validation fails.

```typescript
class ValidationError extends Error {
  field: string;
  value: any;
  
  constructor(message: string, field: string, value: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}
```

**Example:**
```typescript
try {
  const graph = await visualizer.analyze(address, depth);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Invalid ${error.field}: ${error.value}`);
  }
}
```

### Error Handling Best Practices

**1. Always use try-catch blocks:**
```typescript
try {
  const result = await apiCall();
} catch (error) {
  handleError(error);
}
```

**2. Check error types:**
```typescript
if (error instanceof RateLimitError) {
  // Handle rate limiting
} else if (error instanceof APIError) {
  // Handle API errors
} else {
  // Handle unknown errors
}
```

**3. Implement retry logic:**
```typescript
async function retryableRequest(fn: Function, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * Math.pow(2, i));
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Configuration

**Default Limits:**
- Requests per second: 10
- Requests per minute: 600
- Requests per hour: 36,000

**Free Tier:**
- 100,000 API credits per month
- 1 credit per standard request
- 100 credits per enhanced request

### Rate Limit Headers

**Response Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1642262400
```

### Handling Rate Limits

**Automatic Retry:**
```typescript
const helius = new HeliusService(apiKey, {
  autoRetry: true,
  retryDelay: 1000,
  maxRetries: 3
});
```

**Manual Handling:**
```typescript
try {
  const result = await helius.getTransactionsForAddress(address);
} catch (error) {
  if (error instanceof RateLimitError) {
    await sleep(error.retryAfter);
    // Retry request
  }
}
```

### Best Practices

**1. Implement exponential backoff:**
```typescript
async function exponentialBackoff(fn: Function, maxRetries: number = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof RateLimitError) {
        const delay = Math.min(1000 * Math.pow(2, i), 30000);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
}
```

**2. Use request queuing:**
```typescript
class RequestQueue {
  private queue: Function[] = [];
  private processing: boolean = false;
  private delay: number = 100;
  
  async add(fn: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) await fn();
      await sleep(this.delay);
    }
    
    this.processing = false;
  }
}
```

**3. Monitor credit usage:**
```typescript
class CreditMonitor {
  private used: number = 0;
  private limit: number = 100000;
  
  track(credits: number) {
    this.used += credits;
    if (this.used > this.limit * 0.9) {
      console.warn('Approaching credit limit');
    }
  }
  
  remaining(): number {
    return this.limit - this.used;
  }
}
```

---

## Utility Functions

### sleep

Delays execution for specified milliseconds.

```typescript
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### formatAddress

Formats address for display.

```typescript
function formatAddress(address: string, length: number = 8): string {
  return `${address.substring(0, length)}...${address.substring(address.length - 6)}`;
}
```

### lamportsToSol

Converts lamports to SOL.

```typescript
function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}
```

### solToLamports

Converts SOL to lamports.

```typescript
function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9);
}
```

---

## Conclusion

This API reference provides comprehensive documentation for all public interfaces in the Solana Forensic Intelligence Platform. For implementation examples, refer to the source code in the `src/` directory.

For additional support, consult the other documentation files or open an issue on GitHub.
