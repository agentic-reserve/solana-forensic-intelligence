import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Command line arguments
const args = process.argv.slice(2);
const command = args[0];
const address = args[1];
const depth = parseInt(args[2] || '3');

// Show usage if no command
if (!command || !address) {
  console.log('\n🔍 SOLANA FORENSIC INTELLIGENCE - UNIFIED ANALYSIS TOOL');
  console.log('═'.repeat(80));
  console.log('\nUsage: npx tsx src/scripts/analyze.ts <COMMAND> <ADDRESS> [DEPTH]');
  console.log('\nCommands:');
  console.log('  trace      - Quick address trace (30 seconds)');
  console.log('  audit      - KYT/KYA audit report with depth analysis');
  console.log('  forensic   - Full forensic visualization with graphs');
  console.log('  all        - Run all analyses (trace + audit + forensic)');
  console.log('\nExamples:');
  console.log('  npx tsx src/scripts/analyze.ts trace 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH');
  console.log('  npx tsx src/scripts/analyze.ts audit 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3');
  console.log('  npx tsx src/scripts/analyze.ts forensic 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3');
  console.log('  npx tsx src/scripts/analyze.ts all 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3');
  console.log('\n📝 Note: DEPTH defaults to 3 (recommended: 2-5, only for audit/forensic)');
  console.log('═'.repeat(80));
  process.exit(1);
}

// Interfaces
interface TransactionFlow {
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

interface AddressProfile {
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

interface Node {
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

interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  transactionCount: number;
  direction: 'unidirectional' | 'bidirectional';
  type: 'SOL';
  transactions: TransactionFlow[];
}

interface ForensicGraph {
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

interface ClusterAnalysis {
  clusterId: string;
  addresses: string[];
  totalVolume: number;
  transactionCount: number;
  pattern: 'accumulation' | 'distribution' | 'mixing' | 'normal';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Main Analyzer Class
class SolanaForensicAnalyzer {
  private helius: HeliusService;
  private targetAddress: string;
  private flows: TransactionFlow[] = [];
  private addressProfiles: Map<string, AddressProfile> = new Map();
  private processedAddresses: Set<string> = new Set();
  private nodes: Map<string, Node> = new Map();
  private edges: Map<string, Edge> = new Map();
  private clusters: ClusterAnalysis[] = [];

  constructor(apiKey: string, targetAddress: string) {
    this.helius = new HeliusService(apiKey);
    this.targetAddress = targetAddress;
  }

  // ============================================================================
  // TRACE: Quick address analysis
  // ============================================================================
  async runTrace(): Promise<void> {
    console.log('\n🔍 QUICK ADDRESS TRACE');
    console.log('═'.repeat(80));
    console.log(`Target: ${this.targetAddress}`);
    console.log('═'.repeat(80));

    console.log('\n📥 Fetching transactions...');
    const transactions = await this.helius.getTransactionsForAddress(this.targetAddress, 1000);
    console.log(`✅ Found ${transactions.length} transactions`);

    console.log('\n📊 Analyzing...');
    let totalReceived = 0;
    let totalSent = 0;
    let firstSeen = '';
    let lastSeen = '';
    const counterparties = new Map<string, AddressProfile>();

    for (const tx of transactions) {
      try {
        const flows = this.extractFlows(tx, this.targetAddress);
        
        for (const flow of flows) {
          if (!firstSeen || flow.timestamp < firstSeen) firstSeen = flow.timestamp;
          if (!lastSeen || flow.timestamp > lastSeen) lastSeen = flow.timestamp;

          if (flow.from === this.targetAddress) {
            totalSent += flow.amount;
            this.updateCounterparty(counterparties, flow.to, flow.amount, 0, flow.timestamp);
          } else {
            totalReceived += flow.amount;
            this.updateCounterparty(counterparties, flow.from, 0, flow.amount, flow.timestamp);
          }

          this.flows.push(flow);
        }
      } catch (error) {
        // Skip
      }
    }

    // Print summary
    console.log('\n📊 SUMMARY');
    console.log('═'.repeat(80));
    console.log(`Total Received:    ${(totalReceived / 1e9).toFixed(4)} SOL`);
    console.log(`Total Sent:        ${(totalSent / 1e9).toFixed(4)} SOL`);
    console.log(`Net Flow:          ${((totalReceived - totalSent) / 1e9).toFixed(4)} SOL`);
    console.log(`Transactions:      ${this.flows.length}`);
    console.log(`Counterparties:    ${counterparties.size}`);
    console.log(`First Seen:        ${firstSeen}`);
    console.log(`Last Seen:         ${lastSeen}`);

    // Save data
    this.saveTraceData(totalReceived, totalSent, firstSeen, lastSeen, counterparties);
  }

  // ============================================================================
  // AUDIT: KYT/KYA with depth analysis
  // ============================================================================
  async runAudit(maxDepth: number): Promise<void> {
    console.log('\n🔍 KYT/KYA AUDIT');
    console.log('═'.repeat(80));
    console.log(`Target: ${this.targetAddress}`);
    console.log(`Depth: ${maxDepth}`);
    console.log('═'.repeat(80));

    await this.analyzeRecursive(this.targetAddress, 0, maxDepth, [this.targetAddress]);

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Flows: ${this.flows.length}`);
    console.log(`   Addresses: ${this.addressProfiles.size}`);

    // Identify clusters
    this.identifyClusters();

    // Save audit report
    this.saveAuditReport(maxDepth);
  }

  private async analyzeRecursive(
    address: string,
    currentDepth: number,
    maxDepth: number,
    path: string[]
  ): Promise<void> {
    if (this.processedAddresses.has(address) || currentDepth > maxDepth) {
      return;
    }

    const maxAddressesPerDepth = currentDepth === 0 ? 1 : currentDepth === 1 ? 10 : currentDepth === 2 ? 20 : 30;
    const addressesAtDepth = Array.from(this.addressProfiles.values()).filter(a => a.depth === currentDepth).length;
    
    if (addressesAtDepth >= maxAddressesPerDepth && currentDepth > 0) {
      return;
    }

    this.processedAddresses.add(address);
    console.log(`\n${'  '.repeat(currentDepth)}📥 Depth ${currentDepth}: ${address.substring(0, 30)}...`);

    const transactions = await this.helius.getTransactionsForAddress(address, 100);
    console.log(`${'  '.repeat(currentDepth)}   Found ${transactions.length} transactions`);

    if (!this.addressProfiles.has(address)) {
      this.addressProfiles.set(address, {
        address,
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        firstSeen: '',
        lastSeen: '',
        depth: currentDepth,
        isEndpoint: false,
        counterparties: [],
        netFlow: 0
      });
    }

    const profile = this.addressProfiles.get(address)!;
    const counterparties = new Set<string>();
    const nextTargets = new Set<string>();

    for (const tx of transactions) {
      try {
        const flows = this.extractFlows(tx, address);
        
        for (const flow of flows) {
          profile.transactionCount++;
          
          if (!profile.firstSeen || flow.timestamp < profile.firstSeen) {
            profile.firstSeen = flow.timestamp;
          }
          if (!profile.lastSeen || flow.timestamp > profile.lastSeen) {
            profile.lastSeen = flow.timestamp;
          }

          if (flow.from === address) {
            profile.totalSent += flow.amount;
            counterparties.add(flow.to);
            if (nextTargets.size < 10) nextTargets.add(flow.to);
          }

          if (flow.to === address) {
            profile.totalReceived += flow.amount;
            counterparties.add(flow.from);
            if (nextTargets.size < 10) nextTargets.add(flow.from);
          }

          this.flows.push({
            ...flow,
            depth: currentDepth,
            path: [...path]
          });
        }
      } catch (error) {
        // Skip
      }
    }

    profile.netFlow = profile.totalReceived - profile.totalSent;
    profile.counterparties = Array.from(counterparties);
    
    if (profile.totalSent === 0 && currentDepth > 0) {
      profile.isEndpoint = true;
    }

    if (currentDepth < maxDepth) {
      let processed = 0;
      for (const target of nextTargets) {
        if (processed >= 5) break;
        await this.analyzeRecursive(target, currentDepth + 1, maxDepth, [...path, target]);
        await new Promise(resolve => setTimeout(resolve, 100));
        processed++;
      }
    }
  }

  // ============================================================================
  // FORENSIC: Full visualization with graphs
  // ============================================================================
  async runForensic(maxDepth: number): Promise<ForensicGraph> {
    console.log('\n🔍 FORENSIC VISUALIZATION');
    console.log('═'.repeat(80));
    console.log(`Target: ${this.targetAddress}`);
    console.log(`Depth: ${maxDepth}`);
    console.log('═'.repeat(80));

    await this.buildGraph(this.targetAddress, 0, maxDepth);

    console.log('\n🔬 Detecting clusters...');
    this.detectClusters();

    console.log('⚠️  Calculating risk scores...');
    this.calculateRiskScores();

    const graph: ForensicGraph = {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      metadata: {
        targetAddress: this.targetAddress,
        depth: maxDepth,
        totalNodes: this.nodes.size,
        totalEdges: this.edges.size,
        totalVolume: this.calculateTotalVolume(),
        analysisDate: new Date().toISOString()
      }
    };

    this.saveForensicData(graph);
    return graph;
  }

  private async buildGraph(address: string, currentDepth: number, maxDepth: number): Promise<void> {
    if (this.processedAddresses.has(address) || currentDepth > maxDepth) {
      return;
    }

    this.processedAddresses.add(address);
    console.log(`\n📍 Processing: ${address.substring(0, 30)}... (Depth: ${currentDepth}/${maxDepth})`);

    const transactions = await this.helius.getTransactionsForAddress(address, 100);
    console.log(`   Found ${transactions.length} transactions`);

    if (!this.nodes.has(address)) {
      this.nodes.set(address, {
        id: address,
        label: `${address.substring(0, 8)}...${address.substring(address.length - 6)}`,
        type: currentDepth === 0 ? 'target' : 'counterparty',
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        firstSeen: '',
        lastSeen: '',
        riskScore: 0,
        tags: []
      });
    }

    const node = this.nodes.get(address)!;
    node.transactionCount = transactions.length;

    for (const tx of transactions) {
      await this.processTransactionForGraph(tx, address, currentDepth, maxDepth);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async processTransactionForGraph(tx: any, currentAddress: string, currentDepth: number, maxDepth: number): Promise<void> {
    try {
      const signature = tx.transaction?.signatures?.[0] || tx.signature;
      const blockTime = tx.blockTime;
      const timestamp = new Date(blockTime * 1000).toISOString();

      const accounts = tx.transaction?.message?.accountKeys || [];
      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];

      for (let i = 0; i < accounts.length; i++) {
        const account = typeof accounts[i] === 'string' ? accounts[i] : accounts[i].pubkey;
        const balanceChange = postBalances[i] - preBalances[i];

        if (Math.abs(balanceChange) > 1000 && account !== currentAddress) {
          const amount = Math.abs(balanceChange);
          const from = balanceChange < 0 ? account : currentAddress;
          const to = balanceChange < 0 ? currentAddress : account;

          this.createOrUpdateEdge(from, to, amount, {
            signature,
            timestamp,
            amount,
            amountSol: amount / 1e9,
            from,
            to,
            type: 'SOL',
            status: tx.meta?.err ? 'failed' : 'success'
          });

          this.updateNodeStats(from, to, amount, timestamp);

          if (currentDepth < maxDepth && !this.processedAddresses.has(account)) {
            await this.buildGraph(account, currentDepth + 1, maxDepth);
          }
        }
      }
    } catch (error) {
      // Skip
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================
  private extractFlows(tx: any, focusAddress: string): TransactionFlow[] {
    const flows: TransactionFlow[] = [];
    
    try {
      // Use Enhanced Transaction format from Helius
      const signature = tx.signature;
      const timestamp = new Date(tx.timestamp * 1000).toISOString();

      // Extract native transfers (SOL)
      if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
        for (const transfer of tx.nativeTransfers) {
          flows.push({
            signature,
            timestamp,
            from: transfer.fromUserAccount,
            to: transfer.toUserAccount,
            amount: transfer.amount,
            amountSol: transfer.amount / 1e9,
            type: 'SOL',
            status: tx.transactionError ? 'failed' : 'success'
          });
        }
      }

      // Extract token transfers
      if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
        for (const transfer of tx.tokenTransfers) {
          flows.push({
            signature,
            timestamp,
            from: transfer.fromUserAccount,
            to: transfer.toUserAccount,
            amount: Math.floor(transfer.tokenAmount * 1e9), // Convert to lamports equivalent
            amountSol: transfer.tokenAmount,
            type: 'TOKEN',
            status: tx.transactionError ? 'failed' : 'success'
          });
        }
      }

      // Fallback: parse from raw transaction data if enhanced data not available
      if (flows.length === 0 && tx.transaction) {
        const accounts = tx.transaction?.message?.accountKeys || [];
        const preBalances = tx.meta?.preBalances || [];
        const postBalances = tx.meta?.postBalances || [];

        for (let i = 0; i < accounts.length; i++) {
          const account = typeof accounts[i] === 'string' ? accounts[i] : accounts[i].pubkey;
          const balanceChange = postBalances[i] - preBalances[i];

          if (Math.abs(balanceChange) > 1000) {
            if (balanceChange < 0) {
              for (let j = 0; j < accounts.length; j++) {
                if (i !== j && postBalances[j] - preBalances[j] > 1000) {
                  const recipient = typeof accounts[j] === 'string' ? accounts[j] : accounts[j].pubkey;
                  flows.push({
                    signature,
                    timestamp,
                    from: account,
                    to: recipient,
                    amount: Math.abs(balanceChange),
                    amountSol: Math.abs(balanceChange) / 1e9,
                    type: 'SOL',
                    status: tx.meta?.err ? 'failed' : 'success'
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Skip
    }

    return flows;
  }

  private updateCounterparty(
    counterparties: Map<string, AddressProfile>,
    address: string,
    sent: number,
    received: number,
    timestamp: string
  ): void {
    if (!counterparties.has(address)) {
      counterparties.set(address, {
        address,
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        firstSeen: timestamp,
        lastSeen: timestamp
      });
    }

    const profile = counterparties.get(address)!;
    profile.transactionCount++;
    profile.totalSent += sent;
    profile.totalReceived += received;
    
    if (timestamp < profile.firstSeen) profile.firstSeen = timestamp;
    if (timestamp > profile.lastSeen) profile.lastSeen = timestamp;
  }

  private createOrUpdateEdge(from: string, to: string, amount: number, transaction: TransactionFlow): void {
    const edgeId = `${from}-${to}`;
    const reverseEdgeId = `${to}-${from}`;

    if (this.edges.has(edgeId)) {
      const edge = this.edges.get(edgeId)!;
      edge.weight += amount;
      edge.transactionCount++;
      edge.transactions.push(transaction);
    } else if (this.edges.has(reverseEdgeId)) {
      const edge = this.edges.get(reverseEdgeId)!;
      edge.weight += amount;
      edge.transactionCount++;
      edge.direction = 'bidirectional';
      edge.transactions.push(transaction);
    } else {
      this.edges.set(edgeId, {
        id: edgeId,
        source: from,
        target: to,
        weight: amount,
        transactionCount: 1,
        direction: 'unidirectional',
        type: 'SOL',
        transactions: [transaction]
      });
    }
  }

  private updateNodeStats(from: string, to: string, amount: number, timestamp: string): void {
    if (!this.nodes.has(from)) {
      this.nodes.set(from, {
        id: from,
        label: `${from.substring(0, 8)}...${from.substring(from.length - 6)}`,
        type: 'counterparty',
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        firstSeen: '',
        lastSeen: '',
        riskScore: 0,
        tags: []
      });
    }

    if (!this.nodes.has(to)) {
      this.nodes.set(to, {
        id: to,
        label: `${to.substring(0, 8)}...${to.substring(to.length - 6)}`,
        type: 'counterparty',
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0,
        firstSeen: '',
        lastSeen: '',
        riskScore: 0,
        tags: []
      });
    }

    const senderNode = this.nodes.get(from)!;
    senderNode.totalSent += amount;
    if (!senderNode.firstSeen || timestamp < senderNode.firstSeen) senderNode.firstSeen = timestamp;
    if (!senderNode.lastSeen || timestamp > senderNode.lastSeen) senderNode.lastSeen = timestamp;

    const receiverNode = this.nodes.get(to)!;
    receiverNode.totalReceived += amount;
    if (!receiverNode.firstSeen || timestamp < receiverNode.firstSeen) receiverNode.firstSeen = timestamp;
    if (!receiverNode.lastSeen || timestamp > receiverNode.lastSeen) receiverNode.lastSeen = timestamp;
  }

  private identifyClusters(): void {
    console.log('\n🔍 Identifying clusters...');
    
    const clusterMap = new Map<string, Set<string>>();
    let clusterId = 0;

    for (const [address, profile] of this.addressProfiles) {
      if (profile.counterparties && profile.counterparties.length > 5) {
        const clusterKey = `CLUSTER_${clusterId++}`;
        clusterMap.set(clusterKey, new Set([address, ...profile.counterparties.slice(0, 10)]));
        profile.cluster = clusterKey;
      }
    }

    console.log(`   Found ${clusterMap.size} clusters`);
  }

  private detectClusters(): void {
    const clusters = new Map<string, string[]>();
    
    for (const edge of this.edges.values()) {
      const pattern = this.identifyPattern(edge);
      if (!clusters.has(pattern)) {
        clusters.set(pattern, []);
      }
      clusters.get(pattern)!.push(edge.source, edge.target);
    }

    let clusterId = 1;
    for (const [pattern, addresses] of clusters.entries()) {
      const uniqueAddresses = [...new Set(addresses)];
      if (uniqueAddresses.length >= 3) {
        const totalVolume = this.calculateClusterVolume(uniqueAddresses);
        const transactionCount = this.calculateClusterTransactions(uniqueAddresses);
        
        this.clusters.push({
          clusterId: `CLUSTER_${clusterId++}`,
          addresses: uniqueAddresses,
          totalVolume,
          transactionCount,
          pattern: pattern as any,
          riskLevel: this.assessClusterRisk(pattern, totalVolume, transactionCount)
        });
      }
    }

    console.log(`   Detected ${this.clusters.length} clusters`);
  }

  private identifyPattern(edge: Edge): string {
    const avgAmount = edge.weight / edge.transactionCount;
    const frequency = edge.transactionCount;

    if (frequency > 50 && avgAmount < 1e9) return 'mixing';
    if (frequency < 5 && avgAmount > 10e9) return 'accumulation';
    if (frequency > 20 && edge.direction === 'unidirectional') return 'distribution';
    return 'normal';
  }

  private calculateClusterVolume(addresses: string[]): number {
    let total = 0;
    for (const address of addresses) {
      const node = this.nodes.get(address);
      if (node) {
        total += node.totalReceived + node.totalSent;
      }
    }
    return total;
  }

  private calculateClusterTransactions(addresses: string[]): number {
    let total = 0;
    for (const address of addresses) {
      const node = this.nodes.get(address);
      if (node) {
        total += node.transactionCount;
      }
    }
    return total;
  }

  private assessClusterRisk(pattern: string, volume: number, txCount: number): 'low' | 'medium' | 'high' | 'critical' {
    if (pattern === 'mixing' && txCount > 100) return 'critical';
    if (pattern === 'accumulation' && volume > 100e9) return 'high';
    if (pattern === 'distribution' && txCount > 50) return 'medium';
    return 'low';
  }

  private calculateRiskScores(): void {
    for (const node of this.nodes.values()) {
      let score = 0;

      if (node.totalReceived + node.totalSent > 100e9) score += 30;
      if (node.transactionCount > 100) score += 20;
      
      const imbalance = Math.abs(node.totalReceived - node.totalSent);
      if (imbalance > 50e9) score += 25;
      
      if (node.lastSeen) {
        const daysSinceLastSeen = (Date.now() - new Date(node.lastSeen).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastSeen < 7) score += 15;
      }

      const inHighRiskCluster = this.clusters.some(c => 
        c.addresses.includes(node.id) && (c.riskLevel === 'high' || c.riskLevel === 'critical')
      );
      if (inHighRiskCluster) score += 10;

      node.riskScore = Math.min(score, 100);

      if (node.riskScore >= 70) node.tags.push('HIGH_RISK');
      if (node.transactionCount > 100) node.tags.push('HIGH_ACTIVITY');
      if (imbalance > 50e9) node.tags.push('IMBALANCED_FLOW');
      if (inHighRiskCluster) node.tags.push('CLUSTER_MEMBER');
    }

    console.log(`   Calculated risk scores for ${this.nodes.size} nodes`);
  }

  private calculateTotalVolume(): number {
    return Array.from(this.edges.values()).reduce((sum, edge) => sum + edge.weight, 0);
  }

  // ============================================================================
  // Save Methods
  // ============================================================================
  private saveTraceData(
    totalReceived: number,
    totalSent: number,
    firstSeen: string,
    lastSeen: string,
    counterparties: Map<string, AddressProfile>
  ): void {
    const outputDir = path.join(process.cwd(), 'data', 'trace');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const prefix = this.targetAddress.substring(0, 20);

    // Transactions CSV
    const txCsv = 'signature,timestamp,from,to,amount_sol,type,status\n' +
      this.flows.map(f => `${f.signature},${f.timestamp},${f.from},${f.to},${f.amountSol},${f.type},${f.status}`).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_transactions.csv`), txCsv);

    // Counterparties CSV
    const cpCsv = 'address,total_received_sol,total_sent_sol,transaction_count,first_seen,last_seen\n' +
      Array.from(counterparties.values()).map(p =>
        `${p.address},${(p.totalReceived/1e9).toFixed(9)},${(p.totalSent/1e9).toFixed(9)},${p.transactionCount},${p.firstSeen},${p.lastSeen}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_counterparties.csv`), cpCsv);

    // Summary JSON
    const summary = {
      targetAddress: this.targetAddress,
      totalReceived: totalReceived / 1e9,
      totalSent: totalSent / 1e9,
      netFlow: (totalReceived - totalSent) / 1e9,
      transactionCount: this.flows.length,
      counterpartiesCount: counterparties.size,
      firstSeen,
      lastSeen,
      generatedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(outputDir, `${prefix}_summary.json`), JSON.stringify(summary, null, 2));

    console.log(`\n✅ Saved to: data/trace/`);
  }

  private saveAuditReport(maxDepth: number): void {
    const outputDir = path.join(process.cwd(), 'data', 'audit');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const prefix = `${this.targetAddress.substring(0, 20)}_depth${maxDepth}`;
    
    // Markdown report
    const md = this.generateAuditMarkdown(maxDepth);
    fs.writeFileSync(path.join(outputDir, `${prefix}_report.md`), md);

    // Flows CSV
    const flowsCsv = 'signature,timestamp,from,to,amount_sol,depth,path\n' +
      this.flows.map(f => `${f.signature},${f.timestamp},${f.from},${f.to},${f.amountSol.toFixed(9)},${f.depth},"${f.path?.join(' → ')}"`).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_flows.csv`), flowsCsv);

    // Addresses CSV
    const addressCsv = 'address,total_received_sol,total_sent_sol,net_flow_sol,tx_count,depth,is_endpoint,cluster\n' +
      Array.from(this.addressProfiles.values()).map(a =>
        `${a.address},${(a.totalReceived/1e9).toFixed(9)},${(a.totalSent/1e9).toFixed(9)},${(a.netFlow!/1e9).toFixed(9)},${a.transactionCount},${a.depth},${a.isEndpoint},${a.cluster||'N/A'}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_addresses.csv`), addressCsv);

    console.log(`\n✅ Saved to: data/audit/`);
  }

  private generateAuditMarkdown(maxDepth: number): string {
    const target = this.addressProfiles.get(this.targetAddress)!;
    
    let md = `# KYT/KYA AUDIT REPORT\n\n`;
    md += `**Generated:** ${new Date().toISOString()}\n`;
    md += `**Target:** \`${this.targetAddress}\`\n`;
    md += `**Depth:** ${maxDepth}\n\n`;
    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Received | ${(target.totalReceived / 1e9).toFixed(4)} SOL |\n`;
    md += `| Total Sent | ${(target.totalSent / 1e9).toFixed(4)} SOL |\n`;
    md += `| Net Flow | ${(target.netFlow! / 1e9).toFixed(4)} SOL |\n`;
    md += `| Transactions | ${target.transactionCount} |\n`;
    md += `| Counterparties | ${target.counterparties?.length || 0} |\n`;
    md += `| Addresses Analyzed | ${this.addressProfiles.size} |\n`;
    md += `| Transaction Flows | ${this.flows.length} |\n\n`;

    return md;
  }

  private saveForensicData(graph: ForensicGraph): void {
    const outputDir = path.join(process.cwd(), 'data', 'forensic', this.targetAddress.substring(0, 20));
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Nodes CSV
    const nodesCsv = 'Id,Label,Type,TotalReceived,TotalSent,TransactionCount,RiskScore,Tags\n' +
      graph.nodes.map(n => 
        `${n.id},${n.label},${n.type},${n.totalReceived / 1e9},${n.totalSent / 1e9},${n.transactionCount},${n.riskScore},"${n.tags.join(';')}"`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, 'nodes.csv'), nodesCsv);

    // Edges CSV
    const edgesCsv = 'Source,Target,Weight,TransactionCount,Direction,Type\n' +
      graph.edges.map(e => 
        `${e.source},${e.target},${e.weight / 1e9},${e.transactionCount},${e.direction},${e.type}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, 'edges.csv'), edgesCsv);

    // Transactions table
    const allTransactions: any[] = [];
    for (const edge of graph.edges) {
      for (const tx of edge.transactions) {
        allTransactions.push({
          signature: tx.signature,
          timestamp: tx.timestamp,
          from: tx.from,
          to: tx.to,
          amount: tx.amountSol,
          type: tx.type,
          status: tx.status,
          edgeId: edge.id
        });
      }
    }
    const txCsv = 'Signature,Timestamp,From,To,Amount_SOL,Type,Status,EdgeId\n' +
      allTransactions.map(tx => 
        `${tx.signature},${tx.timestamp},${tx.from},${tx.to},${tx.amount},${tx.type},${tx.status},${tx.edgeId}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, 'transactions.csv'), txCsv);

    // Clusters
    const clustersCsv = 'ClusterId,AddressCount,TotalVolume_SOL,TransactionCount,Pattern,RiskLevel\n' +
      this.clusters.map(c => 
        `${c.clusterId},${c.addresses.length},${c.totalVolume / 1e9},${c.transactionCount},${c.pattern},${c.riskLevel}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, 'clusters.csv'), clustersCsv);

    // Graph JSON
    fs.writeFileSync(path.join(outputDir, 'graph.json'), JSON.stringify(graph, null, 2));

    // HTML Visualization
    this.generateHTML(graph, outputDir);

    console.log(`\n✅ Saved to: data/forensic/${this.targetAddress.substring(0, 20)}/`);
  }

  private generateHTML(graph: ForensicGraph, outputPath: string): void {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Forensic Analysis - ${graph.metadata.targetAddress.substring(0, 20)}</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; }
    #graph { width: 100vw; height: 100vh; }
    .node { cursor: pointer; }
    .node.target { fill: #ff4444; }
    .node.counterparty { fill: #4444ff; }
    .link { stroke: #999; stroke-opacity: 0.6; }
    .link.unidirectional { stroke-dasharray: 5,5; }
    .link.bidirectional { stroke-width: 2; }
    #info { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; max-width: 400px; }
    #legend { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; }
    .legend-item { margin: 5px 0; }
    .legend-color { display: inline-block; width: 20px; height: 20px; margin-right: 10px; vertical-align: middle; }
  </style>
</head>
<body>
  <div id="graph"></div>
  <div id="info">
    <h2>Forensic Analysis</h2>
    <p><strong>Target:</strong> ${graph.metadata.targetAddress.substring(0, 30)}...</p>
    <p><strong>Nodes:</strong> ${graph.metadata.totalNodes}</p>
    <p><strong>Edges:</strong> ${graph.metadata.totalEdges}</p>
    <p><strong>Volume:</strong> ${(graph.metadata.totalVolume / 1e9).toFixed(2)} SOL</p>
    <div id="node-details"></div>
  </div>
  <div id="legend">
    <h3>Legend</h3>
    <div class="legend-item"><span class="legend-color" style="background: #ff4444;"></span>Target</div>
    <div class="legend-item"><span class="legend-color" style="background: #4444ff;"></span>Counterparty</div>
    <div class="legend-item">━━━ Bidirectional</div>
    <div class="legend-item">- - - Unidirectional</div>
  </div>
  <script>
    const graphData = ${JSON.stringify(graph)};
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height);
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    const link = svg.append("g").selectAll("line").data(graphData.edges).enter().append("line")
      .attr("class", d => "link " + d.direction)
      .attr("stroke-width", d => Math.sqrt(d.weight / 1e9));
    
    const node = svg.append("g").selectAll("circle").data(graphData.nodes).enter().append("circle")
      .attr("class", d => "node " + d.type)
      .attr("r", d => 5 + Math.sqrt(d.transactionCount))
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))
      .on("click", showNodeDetails);
    
    node.append("title").text(d => d.label + "\\nRisk: " + d.riskScore);
    
    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
    
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x; d.fy = d.y;
    }
    function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null; d.fy = null;
    }
    function showNodeDetails(event, d) {
      document.getElementById("node-details").innerHTML = \`<hr><h3>Node Details</h3>
        <p><strong>Address:</strong> \${d.id.substring(0, 30)}...</p>
        <p><strong>Received:</strong> \${(d.totalReceived / 1e9).toFixed(4)} SOL</p>
        <p><strong>Sent:</strong> \${(d.totalSent / 1e9).toFixed(4)} SOL</p>
        <p><strong>Transactions:</strong> \${d.transactionCount}</p>
        <p><strong>Risk:</strong> \${d.riskScore}/100</p>
        <p><strong>Tags:</strong> \${d.tags.join(', ') || 'None'}</p>\`;
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(outputPath, 'visualization.html'), html);
  }
}

// ============================================================================
// Main Execution
// ============================================================================
async function main() {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

  if (!HELIUS_API_KEY) {
    console.error('\n❌ Missing HELIUS_API_KEY in .env file');
    console.error('Get your free API key at: https://www.helius.dev/');
    process.exit(1);
  }

  const analyzer = new SolanaForensicAnalyzer(HELIUS_API_KEY, address);

  try {
    switch (command.toLowerCase()) {
      case 'trace':
        await analyzer.runTrace();
        break;

      case 'audit':
        await analyzer.runAudit(depth);
        break;

      case 'forensic':
        await analyzer.runForensic(depth);
        break;

      case 'all':
        console.log('\n🚀 Running all analyses...\n');
        await analyzer.runTrace();
        console.log('\n' + '═'.repeat(80) + '\n');
        await analyzer.runAudit(depth);
        console.log('\n' + '═'.repeat(80) + '\n');
        await analyzer.runForensic(depth);
        break;

      default:
        console.error(`\n❌ Unknown command: ${command}`);
        console.error('Valid commands: trace, audit, forensic, all');
        process.exit(1);
    }

    console.log('\n═'.repeat(80));
    console.log('✅ ANALYSIS COMPLETE');
    console.log('═'.repeat(80));
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
