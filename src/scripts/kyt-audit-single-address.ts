import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Get address and depth from command line
const TARGET_ADDRESS = process.argv[2];
const MAX_DEPTH = parseInt(process.argv[3] || '5');

if (!TARGET_ADDRESS) {
  console.log('\n❌ Usage: npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> [DEPTH]');
  console.log('\nExample:');
  console.log('  npx tsx src/scripts/kyt-audit-single-address.ts 6LMcuyBsNDWnafgxp4LZZqm3D5tJdjGizdnn9ckFS5Ly 5');
  console.log('\n📝 Note: This tool only requires Helius API key');
  console.log('   Get your free API key at: https://www.helius.dev/');
  process.exit(1);
}

interface TransactionFlow {
  signature: string;
  timestamp: string;
  from: string;
  to: string;
  amount: number;
  amountSol: number;
  depth: number;
  path: string[];
}

interface AddressAnalysis {
  address: string;
  totalReceived: number;
  totalSent: number;
  netFlow: number;
  transactionCount: number;
  depth: number;
  isEndpoint: boolean;
  cluster?: string;
  firstSeen: string;
  lastSeen: string;
  counterparties: string[];
}

class KYTAuditor {
  private helius: HeliusService;
  private flows: TransactionFlow[] = [];
  private addressAnalysis: Map<string, AddressAnalysis> = new Map();
  private processedAddresses: Set<string> = new Set();
  private clusters: Map<string, Set<string>> = new Map();

  constructor(heliusApiKey: string) {
    this.helius = new HeliusService(heliusApiKey);
  }

  async analyzeAddress(address: string, maxDepth: number) {
    console.log('\n🔍 KYT/KYA AUDIT - KNOW YOUR TRANSACTION / KNOW YOUR ADDRESS');
    console.log('═'.repeat(80));
    console.log(`Target Address: ${address}`);
    console.log(`Analysis Depth: ${maxDepth} levels`);
    console.log('═'.repeat(80));

    await this.trackRecursive(address, 0, maxDepth, [address]);

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Total flows tracked: ${this.flows.length}`);
    console.log(`   Unique addresses: ${this.addressAnalysis.size}`);
  }

  private async trackRecursive(
    address: string,
    currentDepth: number,
    maxDepth: number,
    path: string[]
  ) {
    if (this.processedAddresses.has(address) || currentDepth > maxDepth) {
      return;
    }

    // Limit addresses per depth to prevent explosion
    const maxAddressesPerDepth = currentDepth === 0 ? 1 : currentDepth === 1 ? 10 : currentDepth === 2 ? 20 : 30;
    const addressesAtDepth = Array.from(this.addressAnalysis.values()).filter(a => a.depth === currentDepth).length;
    
    if (addressesAtDepth >= maxAddressesPerDepth && currentDepth > 0) {
      return;
    }

    this.processedAddresses.add(address);
    console.log(`\n${'  '.repeat(currentDepth)}📥 Depth ${currentDepth}: ${address.substring(0, 30)}...`);

    const transactions = await this.helius.getTransactionsForAddress(address, 100);
    console.log(`${'  '.repeat(currentDepth)}   Found ${transactions.length} transactions`);

    if (!this.addressAnalysis.has(address)) {
      this.addressAnalysis.set(address, {
        address,
        totalReceived: 0,
        totalSent: 0,
        netFlow: 0,
        transactionCount: 0,
        depth: currentDepth,
        isEndpoint: false,
        firstSeen: '',
        lastSeen: '',
        counterparties: []
      });
    }

    const analysis = this.addressAnalysis.get(address)!;
    const counterparties = new Set<string>();
    const nextTargets = new Set<string>();

    for (const tx of transactions) {
      try {
        const flows = this.extractFlows(tx, address);
        
        for (const flow of flows) {
          analysis.transactionCount++;
          
          if (!analysis.firstSeen || flow.timestamp < analysis.firstSeen) {
            analysis.firstSeen = flow.timestamp;
          }
          if (!analysis.lastSeen || flow.timestamp > analysis.lastSeen) {
            analysis.lastSeen = flow.timestamp;
          }

          if (flow.from === address) {
            analysis.totalSent += flow.amount;
            counterparties.add(flow.to);
            if (nextTargets.size < 10) { // Limit next targets
              nextTargets.add(flow.to);
            }
          }

          if (flow.to === address) {
            analysis.totalReceived += flow.amount;
            counterparties.add(flow.from);
            if (nextTargets.size < 10) { // Limit next targets
              nextTargets.add(flow.from);
            }
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

    analysis.netFlow = analysis.totalReceived - analysis.totalSent;
    analysis.counterparties = Array.from(counterparties);
    
    if (analysis.totalSent === 0 && currentDepth > 0) {
      analysis.isEndpoint = true;
    }

    if (currentDepth < maxDepth) {
      let processed = 0;
      for (const target of nextTargets) {
        if (processed >= 5) break; // Max 5 branches per address
        await this.trackRecursive(target, currentDepth + 1, maxDepth, [...path, target]);
        await new Promise(resolve => setTimeout(resolve, 100));
        processed++;
      }
    }
  }

  private extractFlows(tx: any, focusAddress: string): TransactionFlow[] {
    const flows: TransactionFlow[] = [];
    
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
                  depth: 0,
                  path: []
                });
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

  // Risk scoring removed - no longer using Range API

  identifyClusters() {
    console.log('\n🔍 IDENTIFYING CLUSTERS...');
    
    // Simple clustering based on transaction patterns
    const clusterMap = new Map<string, Set<string>>();
    let clusterId = 0;

    for (const [address, analysis] of this.addressAnalysis) {
      if (analysis.counterparties.length > 5) {
        const clusterKey = `CLUSTER_${clusterId++}`;
        clusterMap.set(clusterKey, new Set([address, ...analysis.counterparties.slice(0, 10)]));
        analysis.cluster = clusterKey;
      }
    }

    this.clusters = clusterMap;
    console.log(`   Found ${this.clusters.size} clusters`);
  }

  generateMarkdownReport(): string {
    const target = this.addressAnalysis.get(TARGET_ADDRESS)!;
    const topCounterparties = Array.from(this.addressAnalysis.values())
      .filter(a => a.address !== TARGET_ADDRESS)
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 20);

    let md = `# KYT/KYA AUDIT REPORT\n\n`;
    md += `**Generated:** ${new Date().toISOString()}\n\n`;
    md += `**Analysis Type:** Know Your Transaction / Know Your Address\n\n`;
    md += `**Depth Level:** ${MAX_DEPTH}\n\n`;
    md += `---\n\n`;

    // Executive Summary
    md += `## EXECUTIVE SUMMARY\n\n`;
    md += `This report provides a comprehensive Know Your Transaction (KYT) and Know Your Address (KYA) analysis for the target Solana address. The analysis traces transaction flows up to ${MAX_DEPTH} levels deep to identify patterns, clusters, and potential risks.\n\n`;

    // Target Address Profile
    md += `## 1. TARGET ADDRESS PROFILE\n\n`;
    md += `**Address:** \`${TARGET_ADDRESS}\`\n\n`;
    md += `### Financial Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Received | ${(target.totalReceived / 1e9).toFixed(4)} SOL |\n`;
    md += `| Total Sent | ${(target.totalSent / 1e9).toFixed(4)} SOL |\n`;
    md += `| Net Flow | ${(target.netFlow / 1e9).toFixed(4)} SOL |\n`;
    md += `| Transaction Count | ${target.transactionCount} |\n`;
    md += `| Unique Counterparties | ${target.counterparties.length} |\n`;
    md += `| First Seen | ${target.firstSeen || 'N/A'} |\n`;
    md += `| Last Seen | ${target.lastSeen || 'N/A'} |\n\n`;

    // Network Analysis
    md += `## 2. NETWORK ANALYSIS\n\n`;
    md += `### Network Statistics\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Addresses Analyzed | ${this.addressAnalysis.size} |\n`;
    md += `| Total Transaction Flows | ${this.flows.length} |\n`;
    md += `| Identified Clusters | ${this.clusters.size} |\n`;
    md += `| Endpoint Addresses | ${Array.from(this.addressAnalysis.values()).filter(a => a.isEndpoint).length} |\n`;
    md += `| Maximum Depth Reached | ${MAX_DEPTH} |\n\n`;

    // Top Counterparties
    md += `## 3. TOP COUNTERPARTIES\n\n`;
    md += `The following addresses have the highest interaction frequency with the target address:\n\n`;
    
    topCounterparties.forEach((cp, i) => {
      md += `### ${i + 1}. \`${cp.address}\`\n\n`;
      md += `| Metric | Value |\n`;
      md += `|--------|-------|\n`;
      md += `| Transaction Count | ${cp.transactionCount} |\n`;
      md += `| Total Received | ${(cp.totalReceived / 1e9).toFixed(4)} SOL |\n`;
      md += `| Total Sent | ${(cp.totalSent / 1e9).toFixed(4)} SOL |\n`;
      md += `| Net Flow | ${(cp.netFlow / 1e9).toFixed(4)} SOL |\n`;
      md += `| Depth Level | ${cp.depth} |\n`;
      md += `\n`;
    });

    // Cluster Analysis
    if (this.clusters.size > 0) {
      md += `## 4. CLUSTER ANALYSIS\n\n`;
      md += `Identified ${this.clusters.size} transaction clusters based on interaction patterns:\n\n`;
      
      let clusterNum = 1;
      for (const [clusterId, members] of this.clusters) {
        md += `### Cluster ${clusterNum}: ${clusterId}\n\n`;
        md += `**Members:** ${members.size} addresses\n\n`;
        md += `**Sample Addresses:**\n`;
        Array.from(members).slice(0, 5).forEach(addr => {
          md += `- \`${addr}\`\n`;
        });
        md += `\n`;
        clusterNum++;
      }
    }

    // Recommendations
    md += `## 5. RECOMMENDATIONS\n\n`;
    md += `Based on the analysis:\n\n`;
    
    if (target.counterparties.length > 100) {
      md += `- 📊 High number of counterparties (${target.counterparties.length}). May indicate mixing or high-volume activity.\n`;
    }
    
    const highVolumeAddresses = Array.from(this.addressAnalysis.values())
      .filter(a => Math.abs(a.netFlow) > 100 * 1e9);
    
    if (highVolumeAddresses.length > 0) {
      md += `- 💰 ${highVolumeAddresses.length} addresses with high volume (>100 SOL net flow). Review carefully.\n`;
    }
    
    const endpoints = Array.from(this.addressAnalysis.values()).filter(a => a.isEndpoint);
    if (endpoints.length > 0) {
      md += `- 🎯 ${endpoints.length} endpoint addresses identified (no outflows). Potential fund destinations.\n`;
    }
    
    md += `- 📈 Continue monitoring for ${MAX_DEPTH}+ depth levels for comprehensive coverage.\n`;
    md += `- 🔍 Cross-reference with additional intelligence sources for validation.\n\n`;

    // Methodology
    md += `## 6. METHODOLOGY\n\n`;
    md += `### Data Sources\n`;
    md += `- Helius API: Transaction history and on-chain data\n\n`;
    md += `### Analysis Approach\n`;
    md += `1. Recursive transaction tracing up to depth ${MAX_DEPTH}\n`;
    md += `2. Counterparty identification and profiling\n`;
    md += `3. Cluster identification based on transaction patterns\n`;
    md += `4. Network topology analysis\n`;
    md += `5. Financial flow analysis\n\n`;

    md += `---\n\n`;
    md += `**Report End**\n`;

    return md;
  }

  saveReport() {
    const outputDir = path.join(process.cwd(), 'data', 'kyt_audit');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const prefix = `${TARGET_ADDRESS.substring(0, 20)}_depth${MAX_DEPTH}`;
    
    // Save markdown report
    const mdReport = this.generateMarkdownReport();
    fs.writeFileSync(path.join(outputDir, `${prefix}_KYT_AUDIT_REPORT.md`), mdReport);
    console.log(`✅ Saved: data/kyt_audit/${prefix}_KYT_AUDIT_REPORT.md`);

    // Save CSV data
    const flowsCsv = 'signature,timestamp,from,to,amount_sol,depth,path\n' +
      this.flows.map(f => `${f.signature},${f.timestamp},${f.from},${f.to},${f.amountSol.toFixed(9)},${f.depth},"${f.path.join(' → ')}"`).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_flows.csv`), flowsCsv);

    const addressCsv = 'address,total_received_sol,total_sent_sol,net_flow_sol,tx_count,depth,is_endpoint,cluster,first_seen,last_seen\n' +
      Array.from(this.addressAnalysis.values()).map(a =>
        `${a.address},${(a.totalReceived/1e9).toFixed(9)},${(a.totalSent/1e9).toFixed(9)},${(a.netFlow/1e9).toFixed(9)},${a.transactionCount},${a.depth},${a.isEndpoint},${a.cluster||'N/A'},${a.firstSeen||'N/A'},${a.lastSeen||'N/A'}`
      ).join('\n');
    fs.writeFileSync(path.join(outputDir, `${prefix}_addresses.csv`), addressCsv);

    console.log(`✅ Saved: data/kyt_audit/${prefix}_flows.csv`);
    console.log(`✅ Saved: data/kyt_audit/${prefix}_addresses.csv`);
  }
}

async function main() {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

  if (!HELIUS_API_KEY) {
    console.error('❌ Missing HELIUS_API_KEY in .env file');
    console.error('\nPlease create a .env file with:');
    console.error('HELIUS_API_KEY=your_api_key_here');
    console.error('\nGet your free API key at: https://www.helius.dev/');
    process.exit(1);
  }

  const auditor = new KYTAuditor(HELIUS_API_KEY);

  await auditor.analyzeAddress(TARGET_ADDRESS, MAX_DEPTH);
  auditor.identifyClusters();
  auditor.saveReport();

  console.log('\n═'.repeat(80));
  console.log('✅ KYT/KYA AUDIT COMPLETE');
  console.log('═'.repeat(80));
  console.log('\n📁 Output files saved in: data/kyt_audit/');
  console.log(`\n📊 Summary:`);
  console.log(`   - Addresses analyzed: ${auditor['addressAnalysis'].size}`);
  console.log(`   - Transaction flows: ${auditor['flows'].length}`);
  console.log(`   - Clusters identified: ${auditor['clusters'].size}`);
}

main().catch(console.error);
