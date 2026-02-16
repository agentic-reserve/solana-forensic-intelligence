import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Get address from command line argument
const TARGET_ADDRESS = process.argv[2];
const DEPTH = parseInt(process.argv[3] || '3');

if (!TARGET_ADDRESS) {
  console.log('\n❌ Usage: npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> [DEPTH]');
  console.log('\nExample:');
  console.log('  npx tsx src/scripts/forensic-visualizer.ts 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3');
  console.log('\n📝 Note: DEPTH defaults to 3 (recommended: 2-5)');
  process.exit(1);
}

interface Node {
  id: string;
  label: string;
  type: 'target' | 'counterparty' | 'cluster';
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
  weight: number; // Total volume
  transactionCount: number;
  direction: 'unidirectional' | 'bidirectional';
  type: 'SOL' | 'TOKEN' | 'MIXED';
  transactions: TransactionDetail[];
}

interface TransactionDetail {
  signature: string;
  timestamp: string;
  amount: number;
  type: 'SOL' | 'TOKEN';
  status: 'success' | 'failed';
  from: string;
  to: string;
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

class ForensicVisualizer {
  private helius: HeliusService;
  private nodes: Map<string, Node> = new Map();
  private edges: Map<string, Edge> = new Map();
  private processedAddresses: Set<string> = new Set();
  private clusters: ClusterAnalysis[] = [];

  constructor(apiKey: string) {
    this.helius = new HeliusService(apiKey);
  }

  async analyze(targetAddress: string, depth: number): Promise<ForensicGraph> {
    console.log('\n🔍 FORENSIC VISUALIZER - ADVANCED BLOCKCHAIN ANALYSIS');
    console.log('═'.repeat(80));
    console.log(`Target Address: ${targetAddress}`);
    console.log(`Analysis Depth: ${depth}`);
    console.log('═'.repeat(80));

    // Initialize target node
    await this.processAddress(targetAddress, 0, depth, 'target');

    // Detect clusters
    console.log('\n🔬 Detecting transaction clusters...');
    this.detectClusters();

    // Calculate risk scores
    console.log('⚠️  Calculating risk scores...');
    this.calculateRiskScores();

    // Build graph
    const graph: ForensicGraph = {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      metadata: {
        targetAddress,
        depth,
        totalNodes: this.nodes.size,
        totalEdges: this.edges.size,
        totalVolume: this.calculateTotalVolume(),
        analysisDate: new Date().toISOString()
      }
    };

    return graph;
  }

  private async processAddress(
    address: string,
    currentDepth: number,
    maxDepth: number,
    nodeType: 'target' | 'counterparty' | 'cluster'
  ): Promise<void> {
    if (this.processedAddresses.has(address) || currentDepth > maxDepth) {
      return;
    }

    this.processedAddresses.add(address);
    console.log(`\n📍 Processing: ${address.substring(0, 30)}... (Depth: ${currentDepth}/${maxDepth})`);

    // Fetch transactions
    const transactions = await this.fetchTransactions(address);
    console.log(`   Found ${transactions.length} transactions`);

    // Create or update node
    if (!this.nodes.has(address)) {
      this.nodes.set(address, {
        id: address,
        label: this.generateLabel(address),
        type: nodeType,
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

    // Process each transaction
    for (const tx of transactions) {
      await this.processTransaction(tx, address, currentDepth, maxDepth);
    }

    // Update node stats
    node.transactionCount = transactions.length;
  }

  private async fetchTransactions(address: string): Promise<any[]> {
    try {
      const limit = 100;
      const transactions = await this.helius.getTransactionsForAddress(address, limit);
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      return transactions;
    } catch (error) {
      console.error(`   ⚠️  Error fetching transactions: ${error}`);
      return [];
    }
  }

  private async processTransaction(
    tx: any,
    currentAddress: string,
    currentDepth: number,
    maxDepth: number
  ): Promise<void> {
    try {
      const signature = tx.transaction?.signatures?.[0] || tx.signature;
      const blockTime = tx.blockTime;
      const timestamp = new Date(blockTime * 1000).toISOString();

      const accounts = tx.transaction?.message?.accountKeys || [];
      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];

      // Analyze balance changes
      for (let i = 0; i < accounts.length; i++) {
        const account = typeof accounts[i] === 'string' ? accounts[i] : accounts[i].pubkey;
        const balanceChange = postBalances[i] - preBalances[i];

        if (Math.abs(balanceChange) > 1000 && account !== currentAddress) {
          const amount = Math.abs(balanceChange);
          const from = balanceChange < 0 ? account : currentAddress;
          const to = balanceChange < 0 ? currentAddress : account;

          // Create edge
          this.createOrUpdateEdge(from, to, amount, {
            signature,
            timestamp,
            amount,
            type: 'SOL',
            status: tx.meta?.err ? 'failed' : 'success',
            from,
            to
          });

          // Update node stats
          this.updateNodeStats(from, to, amount, timestamp);

          // Recursively process counterparty
          if (currentDepth < maxDepth && !this.processedAddresses.has(account)) {
            await this.processAddress(account, currentDepth + 1, maxDepth, 'counterparty');
          }
        }
      }
    } catch (error) {
      // Skip failed transactions
    }
  }

  private createOrUpdateEdge(
    from: string,
    to: string,
    amount: number,
    transaction: TransactionDetail
  ): void {
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
    // Update sender
    if (!this.nodes.has(from)) {
      this.nodes.set(from, this.createEmptyNode(from));
    }
    const senderNode = this.nodes.get(from)!;
    senderNode.totalSent += amount;
    if (!senderNode.firstSeen || timestamp < senderNode.firstSeen) {
      senderNode.firstSeen = timestamp;
    }
    if (!senderNode.lastSeen || timestamp > senderNode.lastSeen) {
      senderNode.lastSeen = timestamp;
    }

    // Update receiver
    if (!this.nodes.has(to)) {
      this.nodes.set(to, this.createEmptyNode(to));
    }
    const receiverNode = this.nodes.get(to)!;
    receiverNode.totalReceived += amount;
    if (!receiverNode.firstSeen || timestamp < receiverNode.firstSeen) {
      receiverNode.firstSeen = timestamp;
    }
    if (!receiverNode.lastSeen || timestamp > receiverNode.lastSeen) {
      receiverNode.lastSeen = timestamp;
    }
  }

  private createEmptyNode(address: string): Node {
    return {
      id: address,
      label: this.generateLabel(address),
      type: 'counterparty',
      totalReceived: 0,
      totalSent: 0,
      transactionCount: 0,
      firstSeen: '',
      lastSeen: '',
      riskScore: 0,
      tags: []
    };
  }

  private generateLabel(address: string): string {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  }

  private detectClusters(): void {
    // Group addresses by transaction patterns
    const clusters = new Map<string, string[]>();
    
    for (const edge of this.edges.values()) {
      const pattern = this.identifyPattern(edge);
      if (!clusters.has(pattern)) {
        clusters.set(pattern, []);
      }
      clusters.get(pattern)!.push(edge.source, edge.target);
    }

    // Create cluster analysis
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

    console.log(`   Detected ${this.clusters.length} transaction clusters`);
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

      // High transaction volume
      if (node.totalReceived + node.totalSent > 100e9) score += 30;
      
      // Many transactions
      if (node.transactionCount > 100) score += 20;
      
      // Imbalanced flow
      const imbalance = Math.abs(node.totalReceived - node.totalSent);
      if (imbalance > 50e9) score += 25;
      
      // Recent activity
      if (node.lastSeen) {
        const daysSinceLastSeen = (Date.now() - new Date(node.lastSeen).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastSeen < 7) score += 15;
      }

      // Cluster membership
      const inHighRiskCluster = this.clusters.some(c => 
        c.addresses.includes(node.id) && (c.riskLevel === 'high' || c.riskLevel === 'critical')
      );
      if (inHighRiskCluster) score += 10;

      node.riskScore = Math.min(score, 100);

      // Add tags
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

  exportToGephi(graph: ForensicGraph, outputPath: string): void {
    // Export nodes
    const nodesCsv = 'Id,Label,Type,TotalReceived,TotalSent,TransactionCount,RiskScore,Tags\n' +
      graph.nodes.map(n => 
        `${n.id},${n.label},${n.type},${n.totalReceived / 1e9},${n.totalSent / 1e9},${n.transactionCount},${n.riskScore},"${n.tags.join(';')}"`
      ).join('\n');
    
    fs.writeFileSync(path.join(outputPath, 'nodes.csv'), nodesCsv);

    // Export edges
    const edgesCsv = 'Source,Target,Weight,TransactionCount,Direction,Type\n' +
      graph.edges.map(e => 
        `${e.source},${e.target},${e.weight / 1e9},${e.transactionCount},${e.direction},${e.type}`
      ).join('\n');
    
    fs.writeFileSync(path.join(outputPath, 'edges.csv'), edgesCsv);

    console.log('✅ Exported Gephi-compatible files');
  }

  exportTransactionTable(graph: ForensicGraph, outputPath: string): void {
    const allTransactions: any[] = [];
    
    for (const edge of graph.edges) {
      for (const tx of edge.transactions) {
        allTransactions.push({
          signature: tx.signature,
          timestamp: tx.timestamp,
          from: tx.from,
          to: tx.to,
          amount: tx.amount / 1e9,
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
    
    fs.writeFileSync(path.join(outputPath, 'transactions_table.csv'), txCsv);
    console.log('✅ Exported transaction table');
  }

  exportClusterAnalysis(outputPath: string): void {
    const clustersCsv = 'ClusterId,AddressCount,TotalVolume_SOL,TransactionCount,Pattern,RiskLevel\n' +
      this.clusters.map(c => 
        `${c.clusterId},${c.addresses.length},${c.totalVolume / 1e9},${c.transactionCount},${c.pattern},${c.riskLevel}`
      ).join('\n');
    
    fs.writeFileSync(path.join(outputPath, 'clusters.csv'), clustersCsv);

    // Detailed cluster members
    const membersCsv = 'ClusterId,Address\n' +
      this.clusters.flatMap(c => 
        c.addresses.map(addr => `${c.clusterId},${addr}`)
      ).join('\n');
    
    fs.writeFileSync(path.join(outputPath, 'cluster_members.csv'), membersCsv);
    console.log('✅ Exported cluster analysis');
  }

  generateHTMLVisualization(graph: ForensicGraph, outputPath: string): void {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Forensic Visualization - ${graph.metadata.targetAddress.substring(0, 20)}</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; }
    #graph { width: 100vw; height: 100vh; }
    .node { cursor: pointer; }
    .node.target { fill: #ff4444; }
    .node.counterparty { fill: #4444ff; }
    .node.cluster { fill: #44ff44; }
    .link { stroke: #999; stroke-opacity: 0.6; }
    .link.unidirectional { stroke-dasharray: 5,5; }
    .link.bidirectional { stroke-width: 2; }
    #info { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; max-width: 400px; }
    #legend { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; }
    .legend-item { margin: 5px 0; }
    .legend-color { display: inline-block; width: 20px; height: 20px; margin-right: 10px; vertical-align: middle; }
    #tx-table { position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(0,0,0,0.9); padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto; display: none; }
    table { width: 100%; color: #fff; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #444; }
    th { background: #333; }
  </style>
</head>
<body>
  <div id="graph"></div>
  <div id="info">
    <h2>Forensic Analysis</h2>
    <p><strong>Target:</strong> ${graph.metadata.targetAddress.substring(0, 30)}...</p>
    <p><strong>Nodes:</strong> ${graph.metadata.totalNodes}</p>
    <p><strong>Edges:</strong> ${graph.metadata.totalEdges}</p>
    <p><strong>Total Volume:</strong> ${(graph.metadata.totalVolume / 1e9).toFixed(2)} SOL</p>
    <p><strong>Analysis Date:</strong> ${new Date(graph.metadata.analysisDate).toLocaleString()}</p>
    <div id="node-details"></div>
  </div>
  <div id="legend">
    <h3>Legend</h3>
    <div class="legend-item"><span class="legend-color" style="background: #ff4444;"></span>Target Address</div>
    <div class="legend-item"><span class="legend-color" style="background: #4444ff;"></span>Counterparty</div>
    <div class="legend-item"><span class="legend-color" style="background: #44ff44;"></span>Cluster</div>
    <div class="legend-item">━━━ Bidirectional</div>
    <div class="legend-item">- - - Unidirectional</div>
  </div>
  <div id="tx-table">
    <h3>Transactions</h3>
    <table id="tx-table-content"></table>
  </div>
  <script>
    const graphData = ${JSON.stringify(graph)};
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    const link = svg.append("g")
      .selectAll("line")
      .data(graphData.edges)
      .enter().append("line")
      .attr("class", d => "link " + d.direction)
      .attr("stroke-width", d => Math.sqrt(d.weight / 1e9));
    
    const node = svg.append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", d => "node " + d.type)
      .attr("r", d => 5 + Math.sqrt(d.transactionCount))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", showNodeDetails)
      .on("dblclick", showTransactions);
    
    node.append("title")
      .text(d => d.label + "\\nRisk: " + d.riskScore);
    
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });
    
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    function showNodeDetails(event, d) {
      const details = document.getElementById("node-details");
      details.innerHTML = \`
        <hr>
        <h3>Node Details</h3>
        <p><strong>Address:</strong> \${d.id.substring(0, 30)}...</p>
        <p><strong>Type:</strong> \${d.type}</p>
        <p><strong>Received:</strong> \${(d.totalReceived / 1e9).toFixed(4)} SOL</p>
        <p><strong>Sent:</strong> \${(d.totalSent / 1e9).toFixed(4)} SOL</p>
        <p><strong>Transactions:</strong> \${d.transactionCount}</p>
        <p><strong>Risk Score:</strong> \${d.riskScore}/100</p>
        <p><strong>Tags:</strong> \${d.tags.join(', ') || 'None'}</p>
      \`;
    }
    
    function showTransactions(event, d) {
      const edges = graphData.edges.filter(e => e.source.id === d.id || e.target.id === d.id);
      const txTable = document.getElementById("tx-table");
      const txContent = document.getElementById("tx-table-content");
      
      let html = '<tr><th>Timestamp</th><th>From</th><th>To</th><th>Amount</th><th>Status</th></tr>';
      edges.forEach(edge => {
        edge.transactions.slice(0, 10).forEach(tx => {
          html += \`<tr>
            <td>\${new Date(tx.timestamp).toLocaleString()}</td>
            <td>\${tx.from.substring(0, 10)}...</td>
            <td>\${tx.to.substring(0, 10)}...</td>
            <td>\${(tx.amount / 1e9).toFixed(4)} SOL</td>
            <td>\${tx.status}</td>
          </tr>\`;
        });
      });
      
      txContent.innerHTML = html;
      txTable.style.display = 'block';
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(outputPath, 'visualization.html'), html);
    console.log('✅ Generated interactive HTML visualization');
  }
}

async function main() {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

  if (!HELIUS_API_KEY) {
    console.error('❌ Missing HELIUS_API_KEY in .env file');
    process.exit(1);
  }

  const visualizer = new ForensicVisualizer(HELIUS_API_KEY);
  const graph = await visualizer.analyze(TARGET_ADDRESS, DEPTH);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'data', 'forensic_analysis', TARGET_ADDRESS.substring(0, 20));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export all formats
  console.log('\n💾 Exporting analysis results...');
  visualizer.exportToGephi(graph, outputDir);
  visualizer.exportTransactionTable(graph, outputDir);
  visualizer.exportClusterAnalysis(outputDir);
  visualizer.generateHTMLVisualization(graph, outputDir);

  // Save JSON
  fs.writeFileSync(
    path.join(outputDir, 'graph.json'),
    JSON.stringify(graph, null, 2)
  );

  console.log('\n═'.repeat(80));
  console.log('✅ FORENSIC ANALYSIS COMPLETE');
  console.log('═'.repeat(80));
  console.log(`\n📁 Output directory: ${outputDir}`);
  console.log('\n📊 Generated files:');
  console.log('   • nodes.csv - Node data for Gephi');
  console.log('   • edges.csv - Edge data for Gephi');
  console.log('   • transactions_table.csv - All transactions');
  console.log('   • clusters.csv - Cluster analysis');
  console.log('   • cluster_members.csv - Cluster membership');
  console.log('   • graph.json - Complete graph data');
  console.log('   • visualization.html - Interactive visualization');
  console.log('\n🌐 Open visualization.html in your browser to explore the graph!');
}

main().catch(console.error);
