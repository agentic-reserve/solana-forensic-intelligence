export interface RiskScore {
  address: string;
  network: string;
  risk_score: number;
  risk_level: string;
  risk_factors: string[];
}

export interface Counterparty {
  address: string;
  transaction_count: number;
  total_volume: number;
  labels?: string[];
}

export interface AddressStats {
  address: string;
  first_seen: string;
  last_seen: string;
  transaction_count: number;
  total_received: number;
  total_sent: number;
}

export interface TransactionData {
  signature: string;
  slot: number;
  blockTime: number;
  transaction: any;
  meta: any;
}

export interface InvestigationReport {
  address: string;
  role: 'BAD_ACTOR' | 'VICTIM';
  riskScore: RiskScore | null;
  counterparties: Counterparty[];
  statistics: AddressStats | null;
  recentTransactions: TransactionData[];
  patterns: PatternAnalysis;
}

export interface PatternAnalysis {
  suspiciousPatterns: string[];
  behaviorFlags: string[];
  connectionToVictim?: boolean;
}
