# Real-Time Address Monitoring

Monitor Solana addresses in real-time using WebSocket connections for instant notifications of balance changes and account updates.

## Overview

The monitoring tool uses Helius WebSocket API with `accountSubscribe` to receive live updates whenever an account's state changes. This is perfect for:

- Live surveillance of suspicious addresses
- Instant alerts for large transactions
- Ongoing monitoring of exchange wallets
- Real-time tracking of fund movements

## Quick Start

```bash
npx tsx src/scripts/monitor.ts <ADDRESS>
```

Example:
```bash
npx tsx src/scripts/monitor.ts Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21
```

## Features

### Real-Time Updates
- Instant notifications when account balance changes
- Live tracking of lamports (SOL) changes
- Account owner and executable status
- Slot number for each update

### Reliability
- Automatic reconnection on connection loss
- Exponential backoff retry strategy
- Health checks with ping every 60 seconds
- 10-minute inactivity timer handled automatically

### Data Persistence
- Automatic log saving every 10 updates
- JSON format for easy parsing
- Complete history of all updates
- Graceful shutdown with Ctrl+C

## Output Format

### Console Output

```
🔴 REAL-TIME ADDRESS MONITOR
════════════════════════════════════════════════════════════════════════════════
Target: Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21
════════════════════════════════════════════════════════════════════════════════

⏳ Connecting to WebSocket...
✅ WebSocket connected
📡 Subscribing to address updates...
✅ Monitoring active (Subscription ID: 12345)

📊 Waiting for account changes...
   Press Ctrl+C to stop

────────────────────────────────────────────────────────────────────────────────
🔔 ACCOUNT UPDATE
   Time:     2026-02-16T14:30:45.123Z
   Slot:     123456789
   Balance:  26.106689241 SOL
   Change:   📈 +0.001000000 SOL
   Owner:    11111111111111111111111111111111
────────────────────────────────────────────────────────────────────────────────
```

### JSON Log File

Location: `data/monitor/<ADDRESS>_monitor.json`

```json
{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
  "startTime": "2026-02-16T14:30:00.000Z",
  "lastUpdate": "2026-02-16T14:35:00.000Z",
  "totalUpdates": 15,
  "logs": [
    {
      "timestamp": "2026-02-16T14:30:45.123Z",
      "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
      "slot": 123456789,
      "lamports": 26106689241,
      "lamportsChange": 1000000,
      "owner": "11111111111111111111111111111111",
      "executable": false
    }
  ]
}
```

## Configuration

### Commitment Level

Default: `confirmed`

The monitoring uses `confirmed` commitment level for a balance between speed and finality. You can modify this in the code:

```typescript
this.subscriptionId = await this.ws.subscribeToAccount(
  address,
  (data) => this.handleAccountUpdate(address, data),
  {
    encoding: 'jsonParsed',
    commitment: 'confirmed'  // or 'finalized' for more security
  }
);
```

### Encoding

Default: `jsonParsed`

Uses human-readable parsed data format. Other options:
- `base58` - Slow but compatible
- `base64` - Fast binary format
- `base64+zstd` - Compressed format

## Use Cases

### 1. Exchange Hot Wallet Monitoring

Monitor exchange deposit/withdrawal addresses for suspicious activity:

```bash
npx tsx src/scripts/monitor.ts <EXCHANGE_HOT_WALLET>
```

### 2. Scam Investigation

Track suspected scammer addresses in real-time:

```bash
npx tsx src/scripts/monitor.ts <SCAMMER_ADDRESS>
```

### 3. Large Transaction Alerts

Monitor whale addresses for significant movements:

```bash
npx tsx src/scripts/monitor.ts <WHALE_ADDRESS>
```

### 4. Smart Contract Monitoring

Watch program-owned accounts for state changes:

```bash
npx tsx src/scripts/monitor.ts <PROGRAM_ACCOUNT>
```

## Advanced Usage

### Multiple Address Monitoring

To monitor multiple addresses, run multiple instances:

```bash
# Terminal 1
npx tsx src/scripts/monitor.ts ADDRESS_1

# Terminal 2
npx tsx src/scripts/monitor.ts ADDRESS_2

# Terminal 3
npx tsx src/scripts/monitor.ts ADDRESS_3
```

### Integration with Alerts

Parse the JSON log file to trigger alerts:

```typescript
import * as fs from 'fs';

const logFile = 'data/monitor/ADDRESS_monitor.json';
const data = JSON.parse(fs.readFileSync(logFile, 'utf-8'));

for (const log of data.logs) {
  if (Math.abs(log.lamportsChange) > 100 * 1e9) {
    // Alert: Large transaction detected!
    console.log(`🚨 Large transaction: ${log.lamportsChange / 1e9} SOL`);
  }
}
```

### Custom Callbacks

Modify the `handleAccountUpdate` method to add custom logic:

```typescript
private handleAccountUpdate(address: string, data: any): void {
  const { context, value } = data.result;
  const lamports = value.lamports || 0;
  
  // Custom logic here
  if (lamports > 1000 * 1e9) {
    // Send alert to Telegram, Discord, etc.
    this.sendAlert(`High balance detected: ${lamports / 1e9} SOL`);
  }
  
  // ... rest of the code
}
```

## Troubleshooting

### Connection Issues

If WebSocket fails to connect:

1. Check your API key in `.env`
2. Verify network connectivity
3. Check Helius service status
4. Review firewall settings

### Reconnection Failures

If automatic reconnection fails:

1. Check max reconnection attempts (default: 5)
2. Verify API key is still valid
3. Check for rate limiting
4. Restart the monitor manually

### Missing Updates

If updates are not appearing:

1. Verify the address is correct
2. Check if account has any activity
3. Ensure commitment level is appropriate
4. Review WebSocket connection status

## Performance

### Resource Usage

- CPU: Minimal (~1-2%)
- Memory: ~50-100 MB
- Network: ~1-5 KB/s (idle), ~10-50 KB/s (active)

### Scalability

- Single address: No issues
- Multiple addresses: Run separate instances
- High-frequency updates: Consider batching logs

### Rate Limits

Helius WebSocket connections:
- No explicit rate limit on subscriptions
- 10-minute inactivity timeout (handled automatically)
- Recommended: 1 ping per minute (implemented)

## Best Practices

1. **Always use health checks** - Ping every 60 seconds (implemented)
2. **Handle reconnections** - Automatic retry with exponential backoff (implemented)
3. **Save logs regularly** - Every 10 updates (implemented)
4. **Graceful shutdown** - Unsubscribe before closing (implemented)
5. **Monitor connection status** - Check `isConnected()` method
6. **Use appropriate commitment** - `confirmed` for speed, `finalized` for security

## API Reference

### WebSocketService

```typescript
class WebSocketService {
  constructor(wsUrl: string)
  
  async connect(): Promise<void>
  
  async subscribeToAccount(
    address: string,
    callback: (data: any) => void,
    options?: {
      encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
      commitment?: 'finalized' | 'confirmed' | 'processed';
    }
  ): Promise<number>
  
  async unsubscribe(subscriptionId: number): Promise<void>
  
  disconnect(): void
  
  isConnected(): boolean
}
```

### AddressMonitor

```typescript
class AddressMonitor {
  constructor(apiKey: string)
  
  async start(address: string): Promise<void>
  
  async stop(): Promise<void>
}
```

## Security Considerations

1. **API Key Protection** - Never commit `.env` file
2. **Data Privacy** - Monitor logs may contain sensitive information
3. **Access Control** - Restrict access to monitoring logs
4. **Rate Limiting** - Respect Helius API limits
5. **Error Handling** - Don't expose internal errors to users

## Future Enhancements

Planned features:
- [ ] Multi-address monitoring in single instance
- [ ] Custom alert thresholds
- [ ] Webhook integration
- [ ] Email/SMS notifications
- [ ] Dashboard UI
- [ ] Historical playback
- [ ] Pattern detection
- [ ] Anomaly alerts

## Support

For issues or questions:
- GitHub Issues: [Report a bug](https://github.com/agentic-reserve/solana-forensic-intelligence/issues)
- Documentation: [Full docs](../README.md)
- Helius Docs: [WebSocket API](https://docs.helius.dev/websockets-and-webhooks/websocket-methods)

---

**Professional blockchain forensics for the Solana ecosystem**
