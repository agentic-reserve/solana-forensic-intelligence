import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import { WebSocketService } from '../services/websocket.service';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const address = process.argv[2];

if (!address) {
  console.log('\n🔴 REAL-TIME ADDRESS MONITOR');
  console.log('═'.repeat(80));
  console.log('\nUsage: npx tsx src/scripts/monitor.ts <ADDRESS>');
  console.log('\nExample:');
  console.log('  npx tsx src/scripts/monitor.ts Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21');
  console.log('\n📝 Note: Press Ctrl+C to stop monitoring');
  console.log('═'.repeat(80));
  process.exit(1);
}

interface MonitorLog {
  timestamp: string;
  address: string;
  slot: number;
  lamports: number;
  lamportsChange: number;
  owner: string;
  executable: boolean;
}

class AddressMonitor {
  private helius: HeliusService;
  private ws: WebSocketService;
  private logs: MonitorLog[] = [];
  private previousLamports: number = 0;
  private subscriptionId: number | null = null;

  constructor(apiKey: string) {
    this.helius = new HeliusService(apiKey);
    const wsUrl = this.helius.getWebSocketUrl();
    this.ws = new WebSocketService(wsUrl);
  }

  async start(address: string): Promise<void> {
    console.log('\n🔴 REAL-TIME ADDRESS MONITOR');
    console.log('═'.repeat(80));
    console.log(`Target: ${address}`);
    console.log('═'.repeat(80));

    try {
      console.log('\n⏳ Connecting to WebSocket...');
      await this.ws.connect();

      console.log('📡 Subscribing to address updates...');
      this.subscriptionId = await this.ws.subscribeToAccount(
        address,
        (data) => this.handleAccountUpdate(address, data),
        {
          encoding: 'jsonParsed',
          commitment: 'confirmed'
        }
      );

      console.log(`✅ Monitoring active (Subscription ID: ${this.subscriptionId})`);
      console.log('\n📊 Waiting for account changes...');
      console.log('   Press Ctrl+C to stop\n');

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        await this.stop();
      });

      process.on('SIGTERM', async () => {
        await this.stop();
      });

    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }

  private handleAccountUpdate(address: string, data: any): void {
    try {
      const { context, value } = data.result;
      const timestamp = new Date().toISOString();

      const lamports = value.lamports || 0;
      const lamportsChange = this.previousLamports > 0 ? lamports - this.previousLamports : 0;
      this.previousLamports = lamports;

      const log: MonitorLog = {
        timestamp,
        address,
        slot: context.slot,
        lamports,
        lamportsChange,
        owner: value.owner || 'Unknown',
        executable: value.executable || false
      };

      this.logs.push(log);

      // Print update
      console.log('─'.repeat(80));
      console.log(`🔔 ACCOUNT UPDATE`);
      console.log(`   Time:     ${timestamp}`);
      console.log(`   Slot:     ${context.slot}`);
      console.log(`   Balance:  ${(lamports / 1e9).toFixed(9)} SOL`);
      
      if (lamportsChange !== 0) {
        const changeStr = lamportsChange > 0 ? '+' : '';
        const emoji = lamportsChange > 0 ? '📈' : '📉';
        console.log(`   Change:   ${emoji} ${changeStr}${(lamportsChange / 1e9).toFixed(9)} SOL`);
      }
      
      console.log(`   Owner:    ${value.owner}`);
      console.log('─'.repeat(80));
      console.log('');

      // Save log every 10 updates
      if (this.logs.length % 10 === 0) {
        this.saveLogs(address);
      }

    } catch (error) {
      console.error('Error handling account update:', error);
    }
  }

  private saveLogs(address: string): void {
    const outputDir = path.join(process.cwd(), 'data', 'monitor');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${address.substring(0, 20)}_monitor.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify({
      address,
      startTime: this.logs[0]?.timestamp,
      lastUpdate: this.logs[this.logs.length - 1]?.timestamp,
      totalUpdates: this.logs.length,
      logs: this.logs
    }, null, 2));
  }

  async stop(): Promise<void> {
    console.log('\n\n🛑 Stopping monitor...');

    if (this.subscriptionId !== null) {
      try {
        await this.ws.unsubscribe(this.subscriptionId);
        console.log('✅ Unsubscribed from updates');
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }

    this.ws.disconnect();
    console.log('✅ WebSocket disconnected');

    if (this.logs.length > 0) {
      this.saveLogs(address);
      console.log(`✅ Saved ${this.logs.length} log entries to data/monitor/`);
    }

    console.log('\n═'.repeat(80));
    console.log('✅ MONITOR STOPPED');
    console.log('═'.repeat(80));

    process.exit(0);
  }
}

async function main() {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

  if (!HELIUS_API_KEY) {
    console.error('\n❌ Missing HELIUS_API_KEY in .env file');
    console.error('Get your free API key at: https://www.helius.dev/');
    process.exit(1);
  }

  const monitor = new AddressMonitor(HELIUS_API_KEY);
  await monitor.start(address);
}

main().catch(console.error);
