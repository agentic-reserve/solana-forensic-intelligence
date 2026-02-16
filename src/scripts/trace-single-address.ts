import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Get address from command line argument
const TARGET_ADDRESS = process.argv[2];

if (!TARGET_ADDRESS) {
  console.log('\n❌ Usage: npx tsx src/scripts/trace-single-address.ts <ADDRESS>');
  console.log('\nExample:');
  console.log('  npx tsx src/scripts/trace-single-address.ts 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH');
  console.log('\n📝 Note: Only requires Helius API key');
  process.exit(1);
}

interface TransactionFlow {
  signature: string;
  slot: number;
  blockTime: number;
  timestamp: string;
  from: string;
  to: string;
  amount: number;
  type: 'SOL' | 'TOKEN';
  status: 'success' | 'failed';
}

interface AddressProfile {
  address: string;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
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

  console.log('\n🔍 BLOCKCHAIN SLEUTH - SINGLE ADDRESS TRACER');
  console.log('═'.repeat(80));
  console.log(`Target Address: ${TARGET_ADDRESS}`);
  console.log('═'.repeat(80));

  const helius = new HeliusService(HELIUS_API_KEY);

  // Step 1: Fetch transaction history
  console.log('\n📥 Step 1: Fetching transaction history...');
  let allTransactions: any[] = [];
  let hasMore = true;
  let iterations = 0;
  const maxTransactions = 1000;

  while (hasMore && allTransactions.length < maxTransactions) {
    console.log(`   Batch ${iterations + 1}...`);
    
    const batch = await helius.getTransactionsForAddress(
      TARGET_ADDRESS,
      Math.min(100, maxTransactions - allTransactions.length)
    );

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    allTransactions = allTransactions.concat(batch);
    console.log(`   Retrieved: ${batch.length} transactions (Total: ${allTransactions.length})`);

    if (batch.length < 100) {
      hasMore = false;
    }

    iterations++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`✅ Total transactions collected: ${allTransactions.length}`);

  // Step 2: Analyze transactions
  console.log('\n📊 Step 2: Analyzing transactions...');
  
  const transactions: TransactionFlow[] = [];
  const counterparties = new Map<string, AddressProfile>();
  let totalReceived = 0;
  let totalSent = 0;
  let firstSeen = '';
  let lastSeen = '';

  for (const tx of allTransactions) {
    try {
      const signature = tx.transaction?.signatures?.[0] || tx.signature;
      const slot = tx.slot;
      const blockTime = tx.blockTime;
      const timestamp = new Date(blockTime * 1000).toISOString();

      if (!firstSeen || timestamp < firstSeen) firstSeen = timestamp;
      if (!lastSeen || timestamp > lastSeen) lastSeen = timestamp;

      const accounts = tx.transaction?.message?.accountKeys || [];
      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];

      // Find balance changes
      for (let i = 0; i < accounts.length; i++) {
        const account = typeof accounts[i] === 'string' ? accounts[i] : accounts[i].pubkey;
        const balanceChange = postBalances[i] - preBalances[i];

        if (Math.abs(balanceChange) > 1000) { // More than 0.000001 SOL
          let from = '';
          let to = '';
          let amount = Math.abs(balanceChange);

          if (balanceChange < 0) {
            from = account;
            to = TARGET_ADDRESS;
            if (from !== TARGET_ADDRESS) {
              totalReceived += amount;
            }
          } else {
            from = TARGET_ADDRESS;
            to = account;
            if (to !== TARGET_ADDRESS) {
              totalSent += amount;
            }
          }

          const flow: TransactionFlow = {
            signature,
            slot,
            blockTime,
            timestamp,
            from,
            to,
            amount,
            type: 'SOL',
            status: tx.meta?.err ? 'failed' : 'success'
          };

          transactions.push(flow);

          // Track counterparties
          const counterparty = from === TARGET_ADDRESS ? to : from;
          if (counterparty !== TARGET_ADDRESS) {
            if (!counterparties.has(counterparty)) {
              counterparties.set(counterparty, {
                address: counterparty,
                totalReceived: 0,
                totalSent: 0,
                transactionCount: 0,
                firstSeen: timestamp,
                lastSeen: timestamp
              });
            }

            const profile = counterparties.get(counterparty)!;
            profile.transactionCount++;
            
            if (from === TARGET_ADDRESS) {
              profile.totalReceived += amount;
            } else {
              profile.totalSent += amount;
            }

            if (timestamp < profile.firstSeen) profile.firstSeen = timestamp;
            if (timestamp > profile.lastSeen) profile.lastSeen = timestamp;
          }
        }
      }
    } catch (error) {
      // Skip failed transactions
    }
  }

  console.log(`✅ Analyzed ${transactions.length} transaction flows`);
  console.log(`✅ Identified ${counterparties.size} unique counterparties`);

  // Step 3: Print summary
  console.log('\n\n📊 ANALYSIS SUMMARY');
  console.log('═'.repeat(80));
  console.log(`\n🎯 TARGET ADDRESS: ${TARGET_ADDRESS}`);
  console.log(`\n💰 FINANCIAL PROFILE:`);
  console.log(`   Total Received:    ${(totalReceived / 1e9).toFixed(4)} SOL`);
  console.log(`   Total Sent:        ${(totalSent / 1e9).toFixed(4)} SOL`);
  console.log(`   Net Flow:          ${((totalReceived - totalSent) / 1e9).toFixed(4)} SOL`);
  console.log(`   Transaction Count: ${transactions.length}`);
  console.log(`   First Seen:        ${firstSeen}`);
  console.log(`   Last Seen:         ${lastSeen}`);

  // Top counterparties
  const topCounterparties = Array.from(counterparties.values())
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, 10);

  console.log(`\n🔗 TOP 10 COUNTERPARTIES:`);
  topCounterparties.forEach((profile, i) => {
    const volume = (profile.totalReceived + profile.totalSent) / 1e9;
    console.log(`   ${i + 1}. ${profile.address.substring(0, 30)}...`);
    console.log(`      Transactions: ${profile.transactionCount} | Volume: ${volume.toFixed(4)} SOL`);
  });

  // Step 4: Save data
  console.log('\n💾 Step 4: Saving data...');
  
  const outputDir = path.join(process.cwd(), 'data', 'single_address_trace');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save transactions
  const txCsv = 'signature,timestamp,from,to,amount_lamports,amount_sol,type,status\n' +
    transactions.map(tx => 
      `${tx.signature},${tx.timestamp},${tx.from},${tx.to},${tx.amount},${tx.amount / 1e9},${tx.type},${tx.status}`
    ).join('\n');
  
  const filename = `${TARGET_ADDRESS.substring(0, 20)}_transactions.csv`;
  fs.writeFileSync(path.join(outputDir, filename), txCsv);
  console.log(`✅ Saved: data/single_address_trace/${filename}`);

  // Save counterparties
  const counterpartiesCsv = 'address,total_received_lamports,total_sent_lamports,transaction_count,first_seen,last_seen\n' +
    Array.from(counterparties.values()).map(p =>
      `${p.address},${p.totalReceived},${p.totalSent},${p.transactionCount},${p.firstSeen},${p.lastSeen}`
    ).join('\n');
  
  const cpFilename = `${TARGET_ADDRESS.substring(0, 20)}_counterparties.csv`;
  fs.writeFileSync(path.join(outputDir, cpFilename), counterpartiesCsv);
  console.log(`✅ Saved: data/single_address_trace/${cpFilename}`);

  // Save summary JSON
  const summary = {
    targetAddress: TARGET_ADDRESS,
    analysis: {
      totalReceived: totalReceived / 1e9,
      totalSent: totalSent / 1e9,
      netFlow: (totalReceived - totalSent) / 1e9,
      transactionCount: transactions.length,
      counterpartiesCount: counterparties.size,
      firstSeen,
      lastSeen
    },
    topCounterparties: topCounterparties.map(p => ({
      address: p.address,
      transactionCount: p.transactionCount,
      volume: (p.totalReceived + p.totalSent) / 1e9
    })),
    generatedAt: new Date().toISOString()
  };

  const summaryFilename = `${TARGET_ADDRESS.substring(0, 20)}_summary.json`;
  fs.writeFileSync(path.join(outputDir, summaryFilename), JSON.stringify(summary, null, 2));
  console.log(`✅ Saved: data/single_address_trace/${summaryFilename}`);

  console.log('\n═'.repeat(80));
  console.log('✅ TRACE COMPLETE');
  console.log('═'.repeat(80));
}

main().catch(console.error);
