# Solana Forensic Intelligence Platform

![Solana Forensic Intelligence](./logo_black_transparent.png)

A professional blockchain intelligence and forensic analysis platform for Solana. Perform comprehensive address investigations, visualize transaction networks, detect suspicious patterns, and generate detailed compliance reports.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Tools Overview](#tools-overview)
- [Output Formats](#output-formats)
- [Use Cases](#use-cases)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Performance](#performance)
- [Legal Disclaimer](#legal-disclaimer)
- [Support](#support)
- [License](#license)

---

## Overview

The Solana Forensic Intelligence Platform is an enterprise-grade toolkit designed for blockchain investigators, compliance officers, and security researchers. It provides comprehensive analysis capabilities for tracking fund flows, identifying suspicious patterns, and performing due diligence on Solana addresses.

### Core Capabilities

**Forensic Visualization**
- Interactive network graph visualization using D3.js
- Automatic cluster detection and pattern recognition
- Risk scoring and assessment algorithms
- Multi-format export capabilities

**Transaction Analysis**
- Deep network traversal up to 5 levels
- Comprehensive transaction history tracking
- Counterparty identification and profiling
- Balance change analysis

**Compliance Tools**
- KYT (Know Your Transaction) audit reports
- KYA (Know Your Address) documentation
- CSV exports for regulatory reporting
- Audit trail generation

**Real-time Monitoring**
- WebSocket-based live tracking
- Instant transaction notifications
- Continuous surveillance capabilities
- Alert system integration

---

## Key Features

### Interactive Graph Visualization

The forensic visualizer creates interactive network graphs that reveal transaction patterns and relationships between addresses.

**Node Representation**
- Target addresses (investigation subject)
- Counterparty addresses (transaction partners)
- Cluster members (grouped by pattern)
- Size proportional to transaction activity

**Edge Visualization**
- Solid lines indicate bidirectional transaction flows
- Dashed lines indicate unidirectional flows
- Line thickness represents transaction volume
- Interactive exploration of transaction details

### Pattern Detection

Automated identification of suspicious transaction patterns:

**Mixing Patterns**
- High-frequency, low-value transactions
- Multiple intermediary hops
- Potential tumbling or laundering activity
- Critical risk classification

**Accumulation Patterns**
- Low-frequency, high-value inflows
- Whale activity indicators
- Exchange deposit patterns
- High risk classification

**Distribution Patterns**
- High-frequency outbound transactions
- Airdrop or payment distribution
- Potential scam indicators
- Medium risk classification

### Risk Scoring System

Automated risk assessment using multi-factor analysis:

**Risk Factors**
- Transaction volume (weight: 30%)
- Activity frequency (weight: 20%)
- Flow imbalance (weight: 25%)
- Recent activity (weight: 15%)
- Cluster membership (weight: 10%)

**Risk Classifications**
- Low Risk: 0-30 (normal activity)
- Medium Risk: 31-50 (monitoring recommended)
- High Risk: 51-70 (investigation required)
- Critical Risk: 71-100 (urgent action needed)

### Cluster Detection

Automatic identification and analysis of transaction clusters:

- Pattern-based grouping algorithms
- Risk level assessment per cluster
- Member address identification
- Volume and frequency analysis

### Transaction Tables

Detailed transaction exploration capabilities:

- Click any edge to view all transactions
- Sortable by timestamp, amount, status
- Filterable by transaction type
- Export to CSV for further analysis

---

## Installation

### Prerequisites

- Node.js version 16 or higher
- npm or yarn package manager
- Helius API key (free tier available)

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-forensic-intelligence
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Edit `.env` file and add your Helius API key:
```
HELIUS_API_KEY=your_api_key_here
```

5. Verify installation:
```bash
npx tsx src/scripts/trace-single-address.ts --help
```

### Obtaining API Key

1. Visit [helius.dev](https://www.helius.dev/)
2. Create a free account
3. Navigate to API Keys section
4. Copy your API key
5. Paste into `.env` file

The free tier includes 100,000 API credits per month, sufficient for most investigative needs.

---

## Quick Start

### Quick Address Trace

Perform rapid initial assessment (30 seconds):

```bash
npx tsx src/scripts/analyze.ts trace <ADDRESS>
```

### KYT/KYA Audit Report

Generate comprehensive compliance documentation with depth analysis:

```bash
npx tsx src/scripts/analyze.ts audit <ADDRESS> 3
```

### Forensic Visualization

Generate interactive graph visualization with automatic risk assessment:

```bash
npx tsx src/scripts/analyze.ts forensic <ADDRESS> 3
```

### Complete Analysis

Run all analyses (trace + audit + forensic):

```bash
npx tsx src/scripts/analyze.ts all <ADDRESS> 3
```

**Parameters:**
- `<ADDRESS>`: Solana address to investigate
- `3`: Analysis depth for audit/forensic (recommended: 2-5)

**Output Locations:**
- Trace: `data/trace/`
- Audit: `data/audit/`
- Forensic: `data/forensic/<ADDRESS>/`

---

## Tools Overview

### Unified Analysis Tool

**Purpose:** All-in-one forensic analysis tool

**Command:**
```bash
npx tsx src/scripts/analyze.ts <COMMAND> <ADDRESS> [DEPTH]
```

**Commands:**
- `trace` - Quick address trace (30 seconds)
- `audit` - KYT/KYA audit with depth analysis
- `forensic` - Full forensic visualization with graphs
- `all` - Run all analyses

**Features:**
- Single script for all tasks
- Consistent output formats
- Integrated analysis pipeline
- Automatic risk scoring
- Pattern detection
- Cluster identification

**Best For:**
- All investigation scenarios
- Streamlined workflow
- Consistent results

**Execution Time:**
- Trace: ~30 seconds
- Audit (depth 3): ~2 minutes
- Forensic (depth 3): ~2 minutes
- All: ~5 minutes

---

## Output Formats

### Forensic Analysis Output

**Location:** `data/forensic_analysis/<ADDRESS>/`

**Files Generated:**

1. **visualization.html**
   - Interactive D3.js graph
   - Click, drag, zoom functionality
   - Node and edge details
   - Transaction tables

2. **nodes.csv**
   - Address information
   - Risk scores
   - Transaction counts
   - Balance statistics
   - Tags and classifications

3. **edges.csv**
   - Transaction flows
   - Volume data
   - Direction indicators
   - Transaction counts

4. **transactions_table.csv**
   - Complete transaction list
   - Timestamps
   - Amounts
   - Status indicators
   - Edge associations

5. **clusters.csv**
   - Cluster identifiers
   - Member counts
   - Volume statistics
   - Pattern classifications
   - Risk levels

6. **cluster_members.csv**
   - Cluster membership mapping
   - Address associations

7. **graph.json**
   - Complete graph data structure
   - Nodes and edges
   - Metadata
   - Analysis parameters

### KYT Audit Output

**Location:** `data/kyt_audit/`

**Files Generated:**

1. **<ADDRESS>_depth<N>_KYT_AUDIT_REPORT.md**
   - Executive summary
   - Risk assessment
   - Transaction analysis
   - Recommendations

2. **<ADDRESS>_depth<N>_flows.csv**
   - All transaction flows
   - Source and destination
   - Amounts and timestamps

3. **<ADDRESS>_depth<N>_addresses.csv**
   - All analyzed addresses
   - Statistics and classifications

### Address Trace Output

**Location:** `data/single_address_trace/`

**Files Generated:**

1. **<ADDRESS>_transactions.csv**
   - Transaction history
   - Chronological order
   - Complete details

2. **<ADDRESS>_counterparties.csv**
   - Counterparty list
   - Transaction counts
   - Volume statistics

3. **<ADDRESS>_summary.json**
   - Analysis summary
   - Key statistics
   - Metadata

---

## Use Cases

### Fraud Investigation

**Scenario:** Investigating suspected fraudulent activity

**Workflow:**
1. Run forensic visualizer with depth 3
2. Identify high-risk nodes and clusters
3. Analyze mixing patterns
4. Track fund destinations
5. Export evidence for reporting

**Tools:** Forensic Visualizer, KYT Audit

### Compliance Verification

**Scenario:** KYC/AML due diligence for exchange onboarding

**Workflow:**
1. Generate KYT audit report
2. Create forensic visualization
3. Review risk scores and patterns
4. Document findings
5. Archive for audit trail

**Tools:** KYT Audit, Forensic Visualizer

### Fund Recovery

**Scenario:** Tracking stolen or misappropriated funds

**Workflow:**
1. Start with victim address
2. Run deep analysis (depth 5)
3. Identify mixing attempts
4. Track to final destinations
5. Document chain of custody

**Tools:** Forensic Visualizer (deep analysis)

### Business Due Diligence

**Scenario:** Vetting potential business partner

**Workflow:**
1. Quick initial check
2. Generate visualization
3. Review transaction history
4. Assess risk level
5. Present findings to stakeholders

**Tools:** Address Tracer, Forensic Visualizer

### Exchange Monitoring

**Scenario:** Monitoring deposit addresses for suspicious activity

**Workflow:**
1. Set up real-time monitoring
2. Receive instant alerts
3. Investigate flagged transactions
4. Generate compliance reports
5. Maintain audit logs

**Tools:** Address Monitor, KYT Audit

### Token Distribution Analysis

**Scenario:** Analyzing token airdrop or distribution patterns

**Workflow:**
1. Identify source address
2. Run forensic analysis
3. Detect distribution clusters
4. Verify recipient patterns
5. Document distribution metrics

**Tools:** Forensic Visualizer, Address Tracer

---

## Documentation

### Quick Start Guides
- [Forensic Visualizer Quick Start](docs/QUICK_START_FORENSIC.md)
- [General Quick Start](docs/QUICK_START.md)

### Comprehensive Guides
- [Forensic Visualizer Documentation](docs/FORENSIC_VISUALIZER.md)
- [Visualization Examples](docs/VISUALIZATION_EXAMPLES.md)
- [Tool Comparison Guide](docs/TOOL_COMPARISON.md)
- [Features Overview](docs/FEATURES_OVERVIEW.md)

### Technical Documentation
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Configuration Guide](docs/CONFIGURATION.md)

### Contributing
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

---

## Project Structure

```
solana-forensic-intelligence/
├── src/
│   ├── scripts/
│   │   └── analyze.ts                     # Unified analysis tool (all-in-one)
│   ├── services/
│   │   └── helius.service.ts              # Helius API integration
│   └── types/
│       └── index.ts                        # TypeScript definitions
├── data/
│   ├── trace/                              # Quick trace outputs
│   ├── audit/                              # Audit reports
│   └── forensic/                           # Forensic visualizations
├── docs/
│   ├── FORENSIC_VISUALIZER.md             # Visualizer guide
│   ├── QUICK_START_FORENSIC.md            # Quick start
│   ├── VISUALIZATION_EXAMPLES.md          # Examples
│   ├── TOOL_COMPARISON.md                 # Tool comparison
│   ├── FEATURES_OVERVIEW.md               # Features
│   ├── PROJECT_STRUCTURE.md               # Structure
│   ├── API_REFERENCE.md                   # API docs
│   └── CONFIGURATION.md                   # Configuration
├── .env.example                            # Environment template
├── .gitignore                              # Git ignore rules
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── README.md                               # This file
├── CONTRIBUTING.md                         # Contribution guide
├── LICENSE                                 # MIT License
└── icon_header_white.png                  # Project logo
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Helius API Configuration
HELIUS_API_KEY=your_helius_api_key_here

# Optional: Network Selection
SOLANA_NETWORK=mainnet-beta  # or devnet, testnet

# Optional: Rate Limiting
API_RATE_LIMIT_MS=100

# Optional: Output Directory
OUTPUT_DIR=./data
```

### Analysis Depth Configuration

**Depth Levels:**

- **Depth 1:** Direct counterparties only
  - Execution time: ~10 seconds
  - Addresses analyzed: 5-10
  - Use case: Quick check

- **Depth 2:** Two-hop analysis
  - Execution time: ~30 seconds
  - Addresses analyzed: 10-20
  - Use case: Initial investigation

- **Depth 3:** Three-hop analysis (recommended)
  - Execution time: ~2 minutes
  - Addresses analyzed: 30-50
  - Use case: Standard investigation

- **Depth 4:** Four-hop analysis
  - Execution time: ~5 minutes
  - Addresses analyzed: 50-80
  - Use case: Detailed investigation

- **Depth 5:** Five-hop analysis (comprehensive)
  - Execution time: ~10 minutes
  - Addresses analyzed: 100+
  - Use case: Deep forensic analysis

### API Credit Usage

**Estimated Credits per Analysis:**

- Address Tracer: 100-200 credits
- KYT Audit (depth 3): 300-500 credits
- Forensic Visualizer (depth 3): 300-500 credits
- Real-time Monitor: Variable (activity-dependent)

**Free Tier:** 100,000 credits per month

---

## Performance

### Optimization Tips

**For Large Investigations:**
1. Start with depth 2-3 for initial assessment
2. Use depth 5 only when necessary
3. Close unnecessary applications
4. Monitor API credit usage
5. Process in batches if needed

**Rate Limiting:**
- Automatic 100ms delay between API calls
- Respects Helius API rate limits
- Graceful error handling
- Automatic retry logic

**Memory Management:**
- Efficient data structures
- Streaming for large datasets
- Garbage collection optimization
- Resource cleanup

### Benchmarks

**System Requirements:**
- CPU: 2+ cores recommended
- RAM: 4GB minimum, 8GB recommended
- Storage: 1GB free space
- Network: Stable internet connection

**Performance Metrics:**

| Tool | Depth | Time | Addresses | Memory |
|------|-------|------|-----------|--------|
| Tracer | N/A | 30s | 10-20 | 100MB |
| Visualizer | 2 | 30s | 10-20 | 200MB |
| Visualizer | 3 | 2m | 30-50 | 300MB |
| Visualizer | 5 | 10m | 100+ | 500MB |
| KYT Audit | 3 | 2m | 30-50 | 250MB |
| Monitor | N/A | Real-time | N/A | 50MB |

---

## Legal Disclaimer

### Important Notice

This software is provided for informational and investigative purposes only. Users are responsible for ensuring compliance with all applicable laws and regulations in their jurisdiction.

### Terms of Use

1. **No Warranty:** This software is provided "as is" without warranty of any kind, express or implied.

2. **Verification Required:** Always verify findings with multiple independent sources before taking action.

3. **Not Legal Advice:** This tool does not provide legal, financial, or investment advice.

4. **Compliance Responsibility:** Users are responsible for ensuring their use complies with applicable laws, including but not limited to:
   - Data protection regulations (GDPR, CCPA, etc.)
   - Financial regulations (AML, KYC, etc.)
   - Privacy laws
   - Computer fraud and abuse laws

5. **Prohibited Uses:** Do not use this software for:
   - Harassment or stalking
   - Illegal surveillance
   - Unauthorized access to systems
   - Market manipulation
   - Any illegal activities

6. **Data Accuracy:** Blockchain data is provided by third-party APIs. Accuracy cannot be guaranteed.

7. **Privacy:** Respect the privacy rights of individuals. Use responsibly and ethically.

### Liability Limitation

The developers and contributors of this software shall not be liable for any damages, losses, or legal consequences arising from the use or misuse of this software.

---

## Support

### Getting Help

**Documentation:**
- Check the `docs/` directory for comprehensive guides
- Review examples in the `data/` directory
- Read the FAQ section below

**Community:**
- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share insights
- Solana Developer Forums: Community support

**Professional Support:**
- For enterprise support inquiries, contact via GitHub

### Frequently Asked Questions

**Q: What is the cost?**
A: The software is free and open-source. You only need a free Helius API key.

**Q: What networks are supported?**
A: Solana mainnet-beta, devnet, and testnet.

**Q: Can I analyze multiple addresses?**
A: Yes, run the tool multiple times or modify scripts for batch processing.

**Q: How accurate is the risk scoring?**
A: Risk scores are algorithmic assessments. Always verify with additional research.

**Q: Can I export to other formats?**
A: Yes, outputs include CSV, JSON, HTML, and Gephi-compatible formats.

**Q: Is real-time monitoring truly real-time?**
A: Yes, using WebSocket connections with minimal latency.

**Q: Can I customize the analysis?**
A: Yes, the codebase is open-source and modifiable.

**Q: What about privacy?**
A: All blockchain data is public. This tool only accesses publicly available information.

### Reporting Issues

When reporting issues, please include:

1. Tool and command used
2. Error messages (full stack trace)
3. System information (OS, Node version)
4. Steps to reproduce
5. Expected vs actual behavior

### Feature Requests

We welcome feature requests. Please:

1. Check existing issues first
2. Describe the use case
3. Explain the expected behavior
4. Provide examples if possible

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Acknowledgments

### Built With

- **Helius:** Solana RPC and API services
- **D3.js:** Data visualization library
- **TypeScript:** Type-safe programming language
- **Node.js:** JavaScript runtime
- **Solana:** Blockchain platform

### Contributors

Thank you to all contributors who have helped improve this project.

### Citation

If you use this software in your research or work, please cite:

```
Solana Forensic Intelligence Tools
https://github.com/agentic-reserve/solana-forensic-intelligence.git
```

---

## Roadmap

### Current Version: 1.0.0

**Completed Features:**
- Interactive graph visualization
- Pattern detection algorithms
- Risk scoring system
- Multiple export formats
- Real-time monitoring
- Comprehensive documentation

### Planned Features

**Version 1.1.0:**
- Token flow tracking
- NFT transaction analysis
- Enhanced cluster algorithms
- Performance optimizations

**Version 1.2.0:**
- Machine learning risk models
- Automated alert system
- API endpoint for integration
- Dashboard interface

**Version 2.0.0:**
- Multi-chain support
- Advanced analytics
- Enterprise features
- Cloud deployment options

---

## Contact

For questions, suggestions, or collaboration inquiries:

- **GitHub:** [Repository Issues](https://github.com/your-repo/issues)
- **Email:** Available upon request
- **Website:** Documentation site (coming soon)

---

**Professional blockchain forensics for the Solana ecosystem**

*Last Updated: 2024*
