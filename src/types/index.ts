// Transaction Data
export interface TransactionData {
  signature: string;
  slot: number;
  blockTime: number;
  transaction: any;
  meta: any;
}

// Transaction Flow
export interface TransactionFlow {
  signature: string;
  timestamp: string;
  from: string;
  to: string;
  amount: number;
  amountSol: number;
  depth?: number;
  path?: string[];
  type?: string;
  status?: string;
}

// Address Profile
export interface AddressProfile {
  address: string;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
  depth?: number;
  isEndpoint?: boolean;
  cluster?: string;
  counterparties?: string[];
  netFlow?: number;
  riskScore?: number;
  tags?: string[];
}

// Graph Node
export interface Node {
  id: string;
  label: string;
  type: 'target' | 'counterparty';
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
  riskScore: number;
  tags: string[];
}

// Graph Edge
export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  transactionCount: number;
  direction: 'unidirectional' | 'bidirectional';
  type: 'SOL';
  transactions: TransactionFlow[];
}

// Forensic Graph
export interface ForensicGraph {
  nodes: Node[];
  edges: Edge[];
  metadata: {
    targetAddress: string;
    depth: number;
    totalNodes: number;
    totalEdges: number;
    totalVolume: number;
    analysisDate: string;
  };
}

// Cluster Analysis
export interface ClusterAnalysis {
  clusterId: string;
  addresses: string[];
  totalVolume: number;
  transactionCount: number;
  pattern: 'accumulation' | 'distribution' | 'mixing' | 'normal';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
