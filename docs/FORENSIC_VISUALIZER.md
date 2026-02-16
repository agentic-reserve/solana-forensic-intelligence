# 🔬 Forensic Visualizer - Advanced Guide

## Overview

The Forensic Visualizer is an advanced blockchain intelligence tool that creates interactive graph visualizations of Solana address transaction networks. It helps investigators trace funding patterns, identify suspicious clusters, and perform comprehensive due diligence.

## Key Features

### 1. Graph Visualization

#### Nodes
- **Visual Representation**: Circles sized by transaction count
- **Color Coding**:
  - 🔴 Red: Target address (the address being investigated)
  - 🔵 Blue: Counterparty addresses
  - 🟢 Green: Cluster members
- **Node Size**: Proportional to transaction activity
- **Interactive**: Click to view details, double-click to see transactions

#### Edges (Connections)
- **Solid Lines**: Bidirectional transactions (money flows both ways)
- **Dashed Lines**: Unidirectional transactions (money flows one way)
- **Line Thickness**: Proportional to total transaction volume
- **Interactive**: Click to explore all transactions between two addresses

### 2. Transaction Tables

When you click on an edge, you can explore detailed transaction data:

```
Timestamp          | From      | To        | Amount    | Status
2024-01-15 10:30  | 3nMN...   | 6LMc...   | 1.5 SOL   | success
2024-01-15 11:45  | 6LMc...   | 3nMN...   | 0.8 SOL   | success
```

Features:
- View all transactions between two addresses
- Sort by timestamp, amount, or status
- Filter by transaction type (SOL, TOKEN)
- Export to CSV for further analysis

### 3. Node Deep Dive

Click on any node to see comprehensive statistics:

```
Address: 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH
Type: counterparty
Total Received: 125.4567 SOL
Total Sent: 98.7654 SOL
Net Flow: +26.6913 SOL
Transaction Count: 234
Risk Score: 67/100
Tags: HIGH_ACTIVITY, IMBALANCED_FLOW
First Seen: 2024-01-01 08:30:00
Last Seen: 2024-01-15 16:45:00
```

### 4. Cluster Detection

The tool automatically identifies transaction clusters based on patterns:

#### Pattern Types

**Mixing Pattern**
- High frequency (>50 transactions)
- Low average amount (<1 SOL)
- Risk: Often associated with tumbling/mixing services
- Risk Level: CRITICAL

**Accumulation Pattern**
- Low frequency (<5 transactions)
- High average amount (>10 SOL)
- Risk: Potential whale accumulation or exchange deposits
- Risk Level: HIGH

**Distribution Pattern**
- High frequency (>20 transactions)
- Unidirectional flow
- Risk: Potential airdrop, payment distribution, or scam
- Risk Level: MEDIUM

**Normal Pattern**
- Standard transaction frequency and amounts
- Risk Level: LOW

### 5. Risk Scoring

Automated risk assessment (0-100 scale):

#### Risk Factors
- **High Volume** (+30 points): >100 SOL total volume
- **High Activity** (+20 points): >100 transactions
- **Imbalanced Flow** (+25 points): >50 SOL difference between received/sent
- **Recent Activity** (+15 points): Active within last 7 days
- **Cluster Membership** (+10 points): Member of high-risk cluster

#### Risk Tags
- `HIGH_RISK`: Score ≥70
- `HIGH_ACTIVITY`: >100 transactions
- `IMBALANCED_FLOW`: >50 SOL imbalance
- `CLUSTER_MEMBER`: Part of identified cluster

## Usage Examples

### Basic Investigation

```bash
# Investigate an address with depth 3 (recommended)
npx tsx src/scripts/forensic-visualizer.ts 3nMNd89AxwHUa1AFvQGqohRkxFEQsTsgiEyEyqXFHyyH 3
```

Output:
```
data/forensic_analysis/3nMNd89AxwHUa1AFvQ/
├── visualization.html          # Open this in browser!
├── nodes.csv                   # Import to Gephi
├── edges.csv                   # Import to Gephi
├── transactions_table.csv      # All transactions
├── clusters.csv                # Cluster analysis
├── cluster_members.csv         # Cluster membership
└── graph.json                  # Complete data
```

### Deep Investigation

```bash
# Deep dive with depth 5 (may take 10+ minutes)
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 5
```

### Quick Check

```bash
# Quick check with depth 2 (faster, less comprehensive)
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 2
```

## Workflow Guide

### 1. Initial Investigation

```bash
# Start with depth 3
npx tsx src/scripts/forensic-visualizer.ts <SUSPICIOUS_ADDRESS> 3
```

### 2. Open Visualization

```bash
# Open in browser
open data/forensic_analysis/<ADDRESS>/visualization.html
```

### 3. Explore the Graph

1. **Identify the target** (red node in center)
2. **Look for large nodes** (high transaction count)
3. **Check edge thickness** (high volume flows)
4. **Click nodes** to view risk scores
5. **Double-click nodes** to see transaction details

### 4. Investigate Clusters

1. Open `clusters.csv` in Excel
2. Sort by `RiskLevel` (Critical → High → Medium → Low)
3. Check `cluster_members.csv` for addresses in high-risk clusters
4. Cross-reference with node risk scores

### 5. Transaction Analysis

1. Click on edges between suspicious nodes
2. Review transaction table for patterns:
   - Rapid succession of transactions
   - Round numbers (potential automation)
   - Failed transactions (potential attacks)
3. Export transaction table for timeline analysis

### 6. Advanced Analysis with Gephi

1. Download [Gephi](https://gephi.org/)
2. Import `nodes.csv` and `edges.csv`
3. Apply layout algorithms:
   - Force Atlas 2 (recommended)
   - Fruchterman Reingold
   - Yifan Hu
4. Use built-in metrics:
   - Betweenness Centrality
   - PageRank
   - Modularity (community detection)

## Interpretation Guide

### Red Flags 🚩

1. **High Risk Score (≥70)**
   - Investigate immediately
   - Check cluster membership
   - Review transaction patterns

2. **Mixing Pattern Cluster**
   - Potential tumbling service
   - Money laundering risk
   - Track all cluster members

3. **Rapid Accumulation**
   - Sudden large inflows
   - Potential scam proceeds
   - Check source addresses

4. **Distribution to Many Addresses**
   - Potential airdrop scam
   - Phishing campaign
   - Track recipient addresses

### Green Flags ✅

1. **Low Risk Score (<30)**
   - Normal transaction patterns
   - Balanced flows
   - Low activity

2. **Normal Pattern Cluster**
   - Standard usage
   - No suspicious behavior

3. **Known Exchange Addresses**
   - Legitimate counterparties
   - Verified entities

## Export Formats

### 1. HTML Visualization
- **File**: `visualization.html`
- **Use**: Interactive exploration in browser
- **Features**: Click, drag, zoom, view details

### 2. Gephi Format
- **Files**: `nodes.csv`, `edges.csv`
- **Use**: Advanced network analysis
- **Import**: File → Import Spreadsheet

### 3. Transaction Table
- **File**: `transactions_table.csv`
- **Use**: Excel analysis, Python processing
- **Columns**: Signature, Timestamp, From, To, Amount, Type, Status

### 4. Cluster Analysis
- **Files**: `clusters.csv`, `cluster_members.csv`
- **Use**: Risk assessment, pattern identification
- **Columns**: ClusterId, AddressCount, Volume, Pattern, RiskLevel

### 5. JSON Data
- **File**: `graph.json`
- **Use**: Custom processing, API integration
- **Structure**: Complete graph with nodes, edges, metadata

## Performance Tips

### Depth Selection

- **Depth 2**: ~30 seconds, 10-20 addresses
  - Quick check
  - Immediate counterparties only

- **Depth 3**: ~2 minutes, 30-50 addresses (RECOMMENDED)
  - Good balance
  - Captures most patterns

- **Depth 5**: ~10 minutes, 100+ addresses
  - Comprehensive analysis
  - May hit rate limits

### Rate Limiting

The tool includes automatic rate limiting:
- 100ms delay between API calls
- Respects Helius API limits
- Handles errors gracefully

### Memory Usage

For large investigations:
- Close other applications
- Use depth 3 or lower
- Process in batches if needed

## Troubleshooting

### Issue: "Rate limit exceeded"
**Solution**: Wait 1 minute and retry, or reduce depth

### Issue: "No transactions found"
**Solution**: Check address is correct, try different network (mainnet/devnet)

### Issue: "Visualization not loading"
**Solution**: Open HTML in modern browser (Chrome, Firefox, Edge)

### Issue: "Too many nodes"
**Solution**: Reduce depth or filter by transaction volume

## Best Practices

1. **Start Small**: Begin with depth 2-3
2. **Document Findings**: Take screenshots, export CSVs
3. **Cross-Reference**: Verify with blockchain explorers
4. **Check Multiple Depths**: Compare results at different depths
5. **Use Gephi**: For large networks (>100 nodes)
6. **Save Everything**: Keep all output files for reports

## Legal & Ethical Considerations

⚠️ **Important Disclaimers**:

1. This tool is for **investigative purposes only**
2. Always verify findings with multiple sources
3. Respect privacy laws and regulations
4. Do not use for harassment or illegal activities
5. Consult legal counsel for compliance matters
6. Not financial or legal advice

## Support & Resources

- **Documentation**: See `docs/` folder
- **Examples**: Check `data/` for sample outputs
- **Issues**: Report bugs on GitHub
- **Community**: Join Solana developer forums

## Advanced Features (Coming Soon)

- [ ] Token flow tracking
- [ ] NFT transaction analysis
- [ ] Real-time monitoring
- [ ] Automated alerts
- [ ] Machine learning risk models
- [ ] Multi-chain support

---

**create for solana superteam indonesia**
*created by:@XBT_kw*