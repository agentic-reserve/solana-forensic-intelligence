import * as fs from 'fs';
import * as path from 'path';

/**
 * Quick check untuk melihat detail address tertentu dari hasil analisis
 */

const ADDRESS_TO_CHECK = process.argv[2];

if (!ADDRESS_TO_CHECK) {
  console.log('\n❌ Usage: npx tsx src/scripts/check-address.ts <ADDRESS>');
  console.log('\nContoh:');
  console.log('  npx tsx src/scripts/check-address.ts astraubkDw81n4LuutzSQ8uzHCv4BhPVhfvTcYv8SKC');
  process.exit(1);
}

interface AddressAnalysis {
  address: string;
  total_received_sol: number;
  total_sent_sol: number;
  net_flow_sol: number;
  transaction_count: number;
  depth: number;
  is_endpoint: string;
  is_suspicious: string;
  suspicion_reasons: string;
  risk_score: string;
  risk_level: string;
  malicious_connections: number;
  first_seen: string;
  last_seen: string;
}

function parseCSV(filePath: string): AddressAnalysis[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  const data: AddressAnalysis[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const obj: any = {};
    
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim().replace(/"/g, '');
    });
    
    data.push(obj as AddressAnalysis);
  }
  
  return data;
}

function findAddress(address: string): AddressAnalysis | null {
  const dataPath = path.join(process.cwd(), 'data', 'scammer_outflows', 'address_analysis.csv');
  
  if (!fs.existsSync(dataPath)) {
    console.log('\n❌ Data tidak ditemukan. Jalankan dulu: npx tsx src/scripts/track-scammer-outflows.ts');
    return null;
  }
  
  const allAddresses = parseCSV(dataPath);
  return allAddresses.find(a => a.address === address) || null;
}

function findTransactions(address: string): any[] {
  const txPath = path.join(process.cwd(), 'data', 'scammer_outflows', 'outflow_transactions.csv');
  
  if (!fs.existsSync(txPath)) {
    return [];
  }
  
  const content = fs.readFileSync(txPath, 'utf-8');
  const lines = content.split('\n');
  
  const transactions: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const parts = lines[i].split(',');
    const from = parts[2];
    const to = parts[3];
    
    if (from === address || to === address) {
      transactions.push({
        signature: parts[0],
        timestamp: parts[1],
        from: parts[2],
        to: parts[3],
        amount_sol: parseFloat(parts[5]),
        depth: parseInt(parts[6])
      });
    }
  }
  
  return transactions;
}

function main() {
  console.log('\n🔍 BLOCKCHAIN SLEUTH - ADDRESS CHECKER');
  console.log('═'.repeat(80));
  console.log(`Mencari address: ${ADDRESS_TO_CHECK}`);
  console.log('═'.repeat(80));
  
  const analysis = findAddress(ADDRESS_TO_CHECK);
  
  if (!analysis) {
    console.log('\n❌ Address tidak ditemukan dalam hasil analisis.');
    console.log('\nKemungkinan:');
    console.log('  1. Address tidak terhubung dengan scammer yang dianalisis');
    console.log('  2. Address berada di depth > 3');
    console.log('  3. Typo dalam penulisan address');
    process.exit(1);
  }
  
  console.log('\n✅ ADDRESS DITEMUKAN!\n');
  
  // Basic Info
  console.log('📊 INFORMASI DASAR');
  console.log('─'.repeat(80));
  console.log(`Address:           ${analysis.address}`);
  console.log(`Depth:             ${analysis.depth} hops dari scammer`);
  console.log(`First Seen:        ${analysis.first_seen}`);
  console.log(`Last Seen:         ${analysis.last_seen}`);
  
  // Financial Info
  console.log('\n💰 INFORMASI KEUANGAN');
  console.log('─'.repeat(80));
  console.log(`Total Received:    ${parseFloat(analysis.total_received_sol).toFixed(4)} SOL`);
  console.log(`Total Sent:        ${parseFloat(analysis.total_sent_sol).toFixed(4)} SOL`);
  console.log(`Net Flow:          ${parseFloat(analysis.net_flow_sol).toFixed(4)} SOL`);
  console.log(`Transaction Count: ${analysis.transaction_count}`);
  
  const avgTx = parseFloat(analysis.total_sent_sol) / parseInt(analysis.transaction_count);
  console.log(`Avg Transaction:   ${avgTx.toFixed(4)} SOL`);
  
  // Status
  console.log('\n🚨 STATUS');
  console.log('─'.repeat(80));
  console.log(`Is Endpoint:       ${analysis.is_endpoint === 'true' ? '✅ YES (no outflows)' : '❌ NO'}`);
  console.log(`Is Suspicious:     ${analysis.is_suspicious === 'true' ? '⚠️  YES' : '✅ NO'}`);
  
  if (analysis.is_suspicious === 'true' && analysis.suspicion_reasons) {
    console.log(`Suspicion Reasons: ${analysis.suspicion_reasons}`);
  }
  
  // Risk Score
  if (analysis.risk_score && analysis.risk_score !== 'N/A') {
    console.log('\n🎯 RISK ASSESSMENT (Range API)');
    console.log('─'.repeat(80));
    console.log(`Risk Score:        ${analysis.risk_score}`);
    console.log(`Risk Level:        ${analysis.risk_level}`);
    console.log(`Malicious Conns:   ${analysis.malicious_connections}`);
  }
  
  // Transactions
  const transactions = findTransactions(ADDRESS_TO_CHECK);
  
  if (transactions.length > 0) {
    console.log(`\n📝 TRANSAKSI TERKAIT (${transactions.length} total)`);
    console.log('─'.repeat(80));
    
    const inflows = transactions.filter(tx => tx.to === ADDRESS_TO_CHECK);
    const outflows = transactions.filter(tx => tx.from === ADDRESS_TO_CHECK);
    
    console.log(`Inflows:  ${inflows.length} transaksi`);
    console.log(`Outflows: ${outflows.length} transaksi`);
    
    // Show top 5 inflows
    if (inflows.length > 0) {
      console.log('\n📥 TOP 5 INFLOWS:');
      inflows
        .sort((a, b) => b.amount_sol - a.amount_sol)
        .slice(0, 5)
        .forEach((tx, i) => {
          console.log(`   ${i + 1}. ${tx.amount_sol.toFixed(4)} SOL from ${tx.from.substring(0, 20)}...`);
          console.log(`      ${tx.timestamp} | Depth: ${tx.depth}`);
        });
    }
    
    // Show top 5 outflows
    if (outflows.length > 0) {
      console.log('\n📤 TOP 5 OUTFLOWS:');
      outflows
        .sort((a, b) => b.amount_sol - a.amount_sol)
        .slice(0, 5)
        .forEach((tx, i) => {
          console.log(`   ${i + 1}. ${tx.amount_sol.toFixed(4)} SOL to ${tx.to.substring(0, 20)}...`);
          console.log(`      ${tx.timestamp} | Depth: ${tx.depth}`);
        });
    }
  }
  
  // Recommendations
  console.log('\n💡 REKOMENDASI');
  console.log('─'.repeat(80));
  
  if (analysis.is_endpoint === 'true' && parseFloat(analysis.net_flow_sol) > 100) {
    console.log('⚠️  ADDRESS INI ADALAH ENDPOINT DENGAN BALANCE TINGGI');
    console.log('   → Kemungkinan address induk/penyimpanan akhir');
    console.log('   → Setup monitoring untuk aktivitas withdrawal');
    console.log('   → Prioritas tinggi untuk investigasi lanjutan');
  }
  
  if (analysis.is_suspicious === 'true') {
    console.log('⚠️  ADDRESS INI DITANDAI SEBAGAI SUSPICIOUS');
    console.log('   → Review manual diperlukan');
    console.log('   → Cek koneksi dengan address lain');
  }
  
  if (parseInt(analysis.depth) === 1) {
    console.log('⚠️  ADDRESS INI DIRECT RECIPIENT DARI SCAMMER');
    console.log('   → Kemungkinan intermediary/mixer');
    console.log('   → Trace path ke endpoint');
  }
  
  console.log('\n═'.repeat(80));
  console.log('✅ ANALISIS SELESAI');
  console.log('═'.repeat(80));
  
  console.log('\n📁 Untuk detail lengkap, lihat:');
  console.log('   - data/scammer_outflows/address_analysis.csv');
  console.log('   - data/scammer_outflows/outflow_transactions.csv');
  console.log('\n🎨 Untuk visualisasi, jalankan: open-gephi.bat');
}

main();
