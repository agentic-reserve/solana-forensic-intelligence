# 🚀 Quick Start - Forensic Visualizer

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Get API Key

1. Visit [helius.dev](https://www.helius.dev/)
2. Sign up for free account
3. Copy your API key

### Step 3: Configure

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
HELIUS_API_KEY=your_key_here
```

### Step 4: Run Analysis

```bash
# Replace with address you want to investigate
npx tsx src/scripts/forensic-visualizer.ts 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3
```

### Step 5: View Results

```bash
# Open the visualization in your browser
open data/forensic_analysis/3nMNd89AxwHUa1AFvQ/visualization.html
```

## What You'll See

### Interactive Graph
- 🔴 Red node = Target address
- 🔵 Blue nodes = Counterparties
- Lines = Transaction flows
- Thicker lines = Higher volume

### Click & Explore
- **Click node**: View details
- **Double-click node**: See transactions
- **Drag nodes**: Rearrange graph
- **Zoom**: Mouse wheel

## Understanding the Output

### Files Generated

```
data/forensic_analysis/<ADDRESS>/
├── visualization.html          ← Open this first!
├── nodes.csv                   ← Address data
├── edges.csv                   ← Transaction flows
├── transactions_table.csv      ← All transactions
├── clusters.csv                ← Pattern analysis
├── cluster_members.csv         ← Cluster details
└── graph.json                  ← Raw data
```

### Risk Scores

- **0-30**: Low risk (normal activity)
- **31-50**: Medium risk (monitor)
- **51-70**: High risk (investigate)
- **71-100**: Critical risk (urgent)

### Pattern Types

- **Mixing**: High-frequency, low-value (⚠️ suspicious)
- **Accumulation**: Low-frequency, high-value (📈 whale)
- **Distribution**: Many outflows (📤 airdrop/scam)
- **Normal**: Standard activity (✅ safe)

## Common Use Cases

### 1. Investigate Suspicious Address

```bash
# Check if address is involved in scams
npx tsx src/scripts/forensic-visualizer.ts <SUSPICIOUS_ADDRESS> 3
```

Look for:
- High risk scores
- Mixing patterns
- Connections to known bad actors

### 2. Due Diligence on Counterparty

```bash
# Before doing business with an address
npx tsx src/scripts/forensic-visualizer.ts <COUNTERPARTY_ADDRESS> 3
```

Check:
- Transaction history
- Risk score
- Cluster membership

### 3. Track Stolen Funds

```bash
# Follow the money trail
npx tsx src/scripts/forensic-visualizer.ts <VICTIM_ADDRESS> 5
```

Analyze:
- Where funds went
- Mixing attempts
- Final destinations

### 4. Exchange Compliance

```bash
# Monitor deposit addresses
npx tsx src/scripts/forensic-visualizer.ts <DEPOSIT_ADDRESS> 3
```

Review:
- Source of funds
- Risk levels
- Suspicious patterns

## Tips for Beginners

### Start Simple
1. Use depth 3 (good balance)
2. Open visualization.html first
3. Click around to explore
4. Check risk scores

### Look for Red Flags
- Risk score >70
- Mixing pattern clusters
- Many small transactions
- Connections to high-risk addresses

### Export for Analysis
1. Open clusters.csv in Excel
2. Sort by risk level
3. Investigate high-risk clusters
4. Cross-reference with nodes.csv

## Next Steps

### Learn More
- Read [FORENSIC_VISUALIZER.md](./FORENSIC_VISUALIZER.md) for advanced features
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code details

### Advanced Analysis
- Import to Gephi for network metrics
- Use Python for custom analysis
- Combine with other tools

### Get Help
- Check documentation in `docs/`
- Review example outputs in `data/`
- Ask questions on GitHub

## Troubleshooting

### "Missing API key"
→ Add `HELIUS_API_KEY` to `.env` file

### "Rate limit exceeded"
→ Wait 1 minute, then retry

### "No transactions found"
→ Check address is correct

### "Visualization not loading"
→ Use Chrome, Firefox, or Edge browser

## Example Workflow

```bash
# 1. Investigate address
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 3

# 2. Open visualization
open data/forensic_analysis/<ADDRESS>/visualization.html

# 3. Check risk scores
# Click on nodes to view details

# 4. Review clusters
open data/forensic_analysis/<ADDRESS>/clusters.csv

# 5. Export transactions
# Use transactions_table.csv for timeline analysis
```

## Pro Tips

💡 **Depth Selection**
- Depth 2: Quick check (30 sec)
- Depth 3: Standard analysis (2 min) ← Recommended
- Depth 5: Deep dive (10 min)

💡 **Performance**
- Close other apps for large analyses
- Use depth 3 for most cases
- Depth 5 only when necessary

💡 **Interpretation**
- Red nodes = investigate
- Thick edges = high volume
- Dashed edges = one-way flow

💡 **Documentation**
- Screenshot findings
- Export all CSVs
- Save graph.json

## Ready to Investigate?

```bash
# Replace with your target address
npx tsx src/scripts/forensic-visualizer.ts YOUR_ADDRESS_HERE 3
```

Happy investigating! 🔍

---

**Need help?** Check the full documentation in `docs/FORENSIC_VISUALIZER.md`

**create for solana superteam indonesia**
*created by:@XBT_kw*