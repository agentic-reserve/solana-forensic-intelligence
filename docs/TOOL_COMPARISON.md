# 🔧 Tool Comparison Guide

## Which Tool Should I Use?

### Quick Decision Tree

```
Need visualization? 
├─ YES → Use Forensic Visualizer ⭐
└─ NO
   ├─ Need deep analysis?
   │  └─ YES → Use KYT Audit
   └─ NO
      ├─ Need quick check?
      │  └─ YES → Use Trace Single Address
      └─ NO
         └─ Need real-time monitoring?
            └─ YES → Use Monitor Address
```

## Tool Overview

### 1. Forensic Visualizer ⭐ NEW!

**Best for:** Visual investigation, pattern detection, due diligence

```bash
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 3
```

**Features:**
- ✅ Interactive D3.js graph visualization
- ✅ Automatic cluster detection
- ✅ Risk scoring (0-100)
- ✅ Transaction tables
- ✅ Multiple export formats (HTML, CSV, JSON, Gephi)
- ✅ Pattern identification (mixing, accumulation, distribution)
- ✅ Node and edge analysis

**Output:**
- `visualization.html` - Interactive graph
- `nodes.csv` - Address data
- `edges.csv` - Transaction flows
- `transactions_table.csv` - All transactions
- `clusters.csv` - Pattern analysis
- `graph.json` - Complete data

**Use Cases:**
- 🔍 Forensic investigation
- 📊 Visual presentation of findings
- 🎯 Due diligence on counterparties
- 🕵️ Tracking fund flows
- 📈 Pattern detection
- 🚨 Risk assessment

**Pros:**
- Most comprehensive analysis
- Visual and intuitive
- Best for presentations
- Automatic risk scoring
- Cluster detection

**Cons:**
- Slower (2-10 minutes)
- Requires modern browser
- More complex output

**Recommended Depth:** 3 (balanced)

---

### 2. KYT Audit Single Address

**Best for:** Compliance reports, detailed analysis, documentation

```bash
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> 3
```

**Features:**
- ✅ Comprehensive KYT/KYA report
- ✅ Multi-level depth analysis
- ✅ Transaction flow tracking
- ✅ CSV exports
- ✅ Markdown report generation
- ✅ Address clustering

**Output:**
- `<ADDRESS>_depth<N>_KYT_AUDIT_REPORT.md` - Full report
- `<ADDRESS>_depth<N>_flows.csv` - Transaction flows
- `<ADDRESS>_depth<N>_addresses.csv` - All addresses

**Use Cases:**
- 📋 Compliance documentation
- 🏦 Exchange KYC/AML
- 📝 Audit trails
- 🔐 Risk assessment reports
- 📊 Detailed analysis

**Pros:**
- Detailed written reports
- Good for compliance
- CSV exports for analysis
- Multi-level tracking

**Cons:**
- No visualization
- Text-heavy output
- Slower for deep analysis

**Recommended Depth:** 3-5

---

### 3. Trace Single Address

**Best for:** Quick checks, basic analysis, simple tracking

```bash
npx tsx src/scripts/trace-single-address.ts <ADDRESS>
```

**Features:**
- ✅ Fast execution (30 seconds)
- ✅ Transaction history
- ✅ Counterparty identification
- ✅ Basic statistics
- ✅ CSV exports
- ✅ JSON summary

**Output:**
- `<ADDRESS>_transactions.csv` - Transaction list
- `<ADDRESS>_counterparties.csv` - Counterparty data
- `<ADDRESS>_summary.json` - Summary stats

**Use Cases:**
- ⚡ Quick address check
- 📊 Basic statistics
- 🔍 Initial investigation
- 📈 Transaction history
- 💰 Balance tracking

**Pros:**
- Very fast (30 seconds)
- Simple output
- Easy to understand
- Good for quick checks

**Cons:**
- No depth analysis
- No visualization
- No risk scoring
- No cluster detection

**Recommended Depth:** N/A (single level)

---

### 4. Monitor Address

**Best for:** Real-time tracking, ongoing surveillance, alerts

```bash
npx tsx src/scripts/monitor-address.ts <ADDRESS>
```

**Features:**
- ✅ Real-time monitoring
- ✅ WebSocket connection
- ✅ Instant notifications
- ✅ Continuous tracking
- ✅ Live updates

**Output:**
- Console logs (real-time)
- Optional webhook notifications

**Use Cases:**
- 🔴 Live monitoring
- 🚨 Alert systems
- 👀 Surveillance
- ⏰ Real-time tracking
- 🔔 Instant notifications

**Pros:**
- Real-time updates
- Instant alerts
- Continuous monitoring
- Low latency

**Cons:**
- No historical analysis
- No visualization
- Requires constant connection
- No depth tracking

**Recommended Depth:** N/A (real-time only)

---

## Feature Comparison Matrix

| Feature | Forensic Visualizer | KYT Audit | Trace Single | Monitor |
|---------|-------------------|-----------|--------------|---------|
| **Visualization** | ✅ Interactive | ❌ | ❌ | ❌ |
| **Risk Scoring** | ✅ Automatic | ⚠️ Manual | ❌ | ❌ |
| **Cluster Detection** | ✅ Yes | ⚠️ Basic | ❌ | ❌ |
| **Depth Analysis** | ✅ 1-5 levels | ✅ 1-5 levels | ❌ Single | ❌ Real-time |
| **Speed** | ⚠️ 2-10 min | ⚠️ 2-10 min | ✅ 30 sec | ✅ Instant |
| **Export Formats** | ✅ 6 formats | ⚠️ 3 formats | ⚠️ 3 formats | ❌ |
| **Real-time** | ❌ | ❌ | ❌ | ✅ |
| **Compliance Reports** | ⚠️ Basic | ✅ Detailed | ❌ | ❌ |
| **Pattern Detection** | ✅ Advanced | ⚠️ Basic | ❌ | ❌ |
| **Transaction Table** | ✅ Interactive | ⚠️ CSV only | ⚠️ CSV only | ❌ |
| **Gephi Export** | ✅ Yes | ❌ | ❌ | ❌ |
| **HTML Output** | ✅ Yes | ❌ | ❌ | ❌ |

Legend:
- ✅ Full support
- ⚠️ Partial support
- ❌ Not supported

## Use Case Recommendations

### Scenario 1: Investigating Suspicious Address

**Recommended:** Forensic Visualizer

**Why:**
- Visual pattern detection
- Risk scoring
- Cluster identification
- Easy to spot anomalies

**Workflow:**
```bash
# 1. Run forensic analysis
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 3

# 2. Open visualization
open data/forensic_analysis/<ADDRESS>/visualization.html

# 3. Check risk scores and clusters
# 4. Export findings for report
```

---

### Scenario 2: Compliance/KYC Check

**Recommended:** KYT Audit + Forensic Visualizer

**Why:**
- Detailed written report
- Visual evidence
- Multiple export formats
- Comprehensive documentation

**Workflow:**
```bash
# 1. Generate KYT report
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> 3

# 2. Generate visualization
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 3

# 3. Combine both for complete report
```

---

### Scenario 3: Quick Address Check

**Recommended:** Trace Single Address

**Why:**
- Fast results
- Simple output
- Easy to understand
- Good for initial screening

**Workflow:**
```bash
# 1. Quick trace
npx tsx src/scripts/trace-single-address.ts <ADDRESS>

# 2. Review summary.json
# 3. If suspicious, run forensic analysis
```

---

### Scenario 4: Ongoing Monitoring

**Recommended:** Monitor Address

**Why:**
- Real-time updates
- Instant alerts
- Continuous tracking
- Low latency

**Workflow:**
```bash
# 1. Start monitoring
npx tsx src/scripts/monitor-address.ts <ADDRESS>

# 2. Keep running in background
# 3. Receive instant notifications
```

---

### Scenario 5: Due Diligence on Business Partner

**Recommended:** Forensic Visualizer + KYT Audit

**Why:**
- Visual presentation
- Risk assessment
- Detailed report
- Professional documentation

**Workflow:**
```bash
# 1. Run forensic analysis
npx tsx src/scripts/forensic-visualizer.ts <ADDRESS> 3

# 2. Generate KYT report
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> 3

# 3. Present visualization to stakeholders
# 4. Provide written report for records
```

---

### Scenario 6: Tracking Stolen Funds

**Recommended:** Forensic Visualizer (depth 5)

**Why:**
- Deep tracking
- Visual fund flow
- Cluster detection
- Pattern identification

**Workflow:**
```bash
# 1. Deep forensic analysis
npx tsx src/scripts/forensic-visualizer.ts <VICTIM_ADDRESS> 5

# 2. Identify mixing patterns
# 3. Track to final destinations
# 4. Export evidence
```

---

## Performance Comparison

### Speed

```
Monitor Address:        Instant (real-time)
Trace Single Address:   ~30 seconds
Forensic Visualizer:    2-10 minutes (depth dependent)
KYT Audit:             2-10 minutes (depth dependent)
```

### Depth vs Time

```
Depth 2:  ~30 seconds  (10-20 addresses)
Depth 3:  ~2 minutes   (30-50 addresses) ← Recommended
Depth 5:  ~10 minutes  (100+ addresses)
```

### Output Size

```
Trace Single:          ~100 KB
KYT Audit:            ~500 KB
Forensic Visualizer:  ~2-5 MB (includes HTML)
Monitor:              N/A (real-time)
```

## Cost Comparison (API Credits)

All tools use Helius API. Approximate credit usage:

```
Trace Single:          100-200 credits
KYT Audit (depth 3):   300-500 credits
Forensic Visualizer:   300-500 credits
Monitor (per hour):    Variable (depends on activity)
```

**Note:** Free tier includes 100,000 credits/month

## Recommended Workflow

### For Most Users

```
1. Quick Check
   └─ Trace Single Address (30 sec)
      ├─ If suspicious → Continue
      └─ If clean → Done

2. Visual Investigation
   └─ Forensic Visualizer (2 min)
      ├─ Check risk scores
      ├─ Review clusters
      └─ Analyze patterns

3. Documentation
   └─ KYT Audit (2 min)
      └─ Generate compliance report
```

### For Investigators

```
1. Forensic Visualizer (depth 3)
   └─ Visual analysis

2. If high risk detected
   └─ Forensic Visualizer (depth 5)
      └─ Deep dive

3. Export all evidence
   └─ HTML, CSV, JSON, Gephi
```

### For Compliance Teams

```
1. KYT Audit (depth 3)
   └─ Generate report

2. Forensic Visualizer (depth 3)
   └─ Visual evidence

3. Archive all outputs
   └─ For audit trail
```

## Tips for Choosing

### Choose Forensic Visualizer if:
- ✅ You need visual analysis
- ✅ You want automatic risk scoring
- ✅ You need to present findings
- ✅ You want cluster detection
- ✅ You need multiple export formats

### Choose KYT Audit if:
- ✅ You need compliance documentation
- ✅ You want detailed written reports
- ✅ You need audit trails
- ✅ You prefer text-based analysis

### Choose Trace Single if:
- ✅ You need quick results
- ✅ You want simple output
- ✅ You're doing initial screening
- ✅ You don't need depth analysis

### Choose Monitor if:
- ✅ You need real-time tracking
- ✅ You want instant alerts
- ✅ You're doing ongoing surveillance
- ✅ You need live updates

## Conclusion

**For most use cases, we recommend starting with the Forensic Visualizer** as it provides the most comprehensive analysis with visual insights, automatic risk scoring, and multiple export formats.

**Quick Reference:**
- 🔍 Investigation → Forensic Visualizer
- 📋 Compliance → KYT Audit + Forensic Visualizer
- ⚡ Quick Check → Trace Single Address
- 🔴 Real-time → Monitor Address

---

**Need help deciding?** Check the [Quick Start Guide](./QUICK_START_FORENSIC.md) or [Full Documentation](./FORENSIC_VISUALIZER.md)

**create for solana superteam indonesia**
*created by:@XBT_kw*