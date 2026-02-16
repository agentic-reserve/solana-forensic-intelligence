import dotenv from 'dotenv';
import { HeliusService } from '../services/helius.service';
import { WebSocketService } from '../services/websocket.service';

dotenv.config();

const BAD_ACTOR = 'Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21';
const VICTIM = 'DCEh5F6mYcvde4ABaFPaXEufsaNas26ZjMyB3BqXn8EJ';

async function monitorAddresses() {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

  if (!HELIUS_API_KEY) {
    console.error('❌ Missing HELIUS_API_KEY in .env file');
    process.exit(1);
  }

  const helius = new HeliusService(HELIUS_API_KEY);
  const wsUrl = helius.getWebSocketUrl();
  const ws = new WebSocketService(wsUrl);

  console.log('\n🔴 MONITORING ADDRESSES IN REAL-TIME');
  console.log('═'.repeat(80));
  console.log(`🔴 BAD ACTOR: ${BAD_ACTOR}`);
  console.log(`🟢 VICTIM: ${VICTIM}`);
  console.log('═'.repeat(80));
  console.log('\n⏳ Connecting to WebSocket...\n');

  try {
    await ws.connect();

    // Monitor BAD_ACTOR
    console.log('👁️  Monitoring BAD_ACTOR transactions...');
    ws.subscribeToAddress(BAD_ACTOR, (data) => {
      console.log('\n🚨 NEW TRANSACTION FROM BAD_ACTOR:');
      console.log('─'.repeat(80));
      console.log('Signature:', data.result?.transaction?.signatures?.[0]);
      console.log('Slot:', data.result?.slot);
      console.log('Time:', new Date().toISOString());
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('─'.repeat(80));
    });

    // Monitor VICTIM
    console.log('👁️  Monitoring VICTIM transactions...');
    ws.subscribeToAddress(VICTIM, (data) => {
      console.log('\n🟢 NEW TRANSACTION FROM VICTIM:');
      console.log('─'.repeat(80));
      console.log('Signature:', data.result?.transaction?.signatures?.[0]);
      console.log('Slot:', data.result?.slot);
      console.log('Time:', new Date().toISOString());
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('─'.repeat(80));
    });

    console.log('\n✅ Monitoring active. Press Ctrl+C to stop.\n');

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping monitor...');
      ws.disconnect();
      process.exit(0);
    });

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

monitorAddresses();
