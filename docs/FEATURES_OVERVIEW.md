# Features Overview

## Introduction

The Solana Forensic Intelligence Platform provides a comprehensive suite of tools for blockchain investigation, compliance verification, and transaction analysis. This document provides detailed information about each feature and its capabilities.

---

## Table of Contents

1. [Interactive Graph Visualization](#interactive-graph-visualization)
2. [Pattern Detection](#pattern-detection)
3. [Risk Scoring System](#risk-scoring-system)
4. [Cluster Detection](#cluster-detection)
5. [Transaction Analysis](#transaction-analysis)
6. [Export Capabilities](#export-capabilities)
7. [Real-time Monitoring](#real-time-monitoring)
8. [Compliance Tools](#compliance-tools)

---

## Interactive Graph Visualization

### Overview

The forensic visualizer creates interactive network graphs using D3.js, providing visual representation of transaction flows and address relationships.

### Node Visualization

**Node Types:**

1. **Target Nodes**
   - Represents the address under investigation
   - Displayed in red color
   - Positioned centrally in the graph
   - Size proportional to transaction activity

2. **Counterparty Nodes**
   - Represents addresses that transacted with the target
   - Displayed in blue color
   - Size based on transaction count
   - Contains risk assessment data

3. **Cluster Nodes**
   - Represents addresses grouped by pattern
   - Displayed in green color
   - Indicates membership in detected clusters
   - Shares cluster risk classification

**Node Properties:**

- **Size:** Proportional to transaction count
- **Color:** Indicates node type and risk level
- **Label:** Truncated address for readability
- **Tooltip:** Full address and statistics on hover

### Edge Visualization

**Edge Types:**

1. **Bidirectional Edges**
   - Solid lines
   - Indicates money flows in both directions
   - Suggests active trading relationship
   - Common in exchange interactions

2. **Unidirectional Edges**
   - Dashed lines
   - Indicates one-way flow only
   - Suggests payment or transfer
   - Common in distribution patterns

**Edge Properties:**

- **Thickness:** Proportional to transaction volume
- **Color:** Indicates transaction type
- **Direction:** Shows flow direction
- **Weight:** Total volume in SOL

### Interactive Features

**User Interactions:**

1. **Click Node**
   - Displays detailed statistics
   - Shows risk score and tags
   - Reveals transaction counts
   - Presents balance information

2. **Double-Click Node**
   - Opens transaction table
   - Lists all related transactions
   - Sortable by various fields
   - Exportable to CSV

3. **Click Edge**
   - Shows transaction details
   - Displays volume statistics
   - Lists individual transactions
   - Reveals flow direction

4. **Drag Node**
   - Repositions node in graph
   - Maintains connections
   - Allows custom layouts
   - Improves readability

5. **Zoom and Pan**
   - Mouse wheel for zoom
   - Drag background to pan
   - Fit to screen option
   - Reset view button

### Graph Layouts

**Layout Algorithms:**

1. **Force-Directed Layout**
   - Default layout algorithm
   - Simulates physical forces
   - Automatically positions nodes
   - Reveals natural clustering

2. **Hierarchical Layout**
   - Organizes by depth level
   - Shows transaction flow direction
   - Useful for tracking funds
   - Clear parent-child relationships

3. **Circular Layout**
   - Arranges nodes in circle
   - Target at center
   - Equal spacing
   - Good for small networks

---

## Pattern Detection

### Overview

Automated identification of suspicious transaction patterns using algorithmic analysis of transaction frequency, volume, and flow characteristics.

### Mixing Patterns

**Characteristics:**
- High transaction frequency (>50 transactions)
- Low average transaction amount (<1 SOL)
- Multiple intermediary addresses
- Circular or complex flow patterns
- Rapid succession of transactions

**Detection Algorithm:**
```
IF frequency > 50 AND average_amount < 1 SOL THEN
    pattern = "mixing"
    risk_level = "critical"
END IF
```

**Risk Assessment:**
- Classification: Critical Risk
- Score Impact: +40 points
- Recommended Action: Immediate investigation
- Common in: Tumbling services, money laundering

**Indicators:**
- Many small transactions
- Short time intervals
- Multiple hops
- Obfuscation attempts

### Accumulation Patterns

**Characteristics:**
- Low transaction frequency (<5 transactions)
- High average transaction amount (>10 SOL)
- Predominantly inbound flows
- Few unique counterparties
- Large balance increases

**Detection Algorithm:**
```
IF frequency < 5 AND average_amount > 10 SOL THEN
    pattern = "accumulation"
    risk_level = "high"
END IF
```

**Risk Assessment:**
- Classification: High Risk
- Score Impact: +30 points
- Recommended Action: Monitor activity
- Common in: Whale accumulation, exchange deposits

**Indicators:**
- Large inflows
- Minimal outflows
- Few transactions
- High net positive balance

### Distribution Patterns

**Characteristics:**
- High transaction frequency (>20 transactions)
- Predominantly outbound flows
- Many unique recipients
- Similar transaction amounts
- Unidirectional flow

**Detection Algorithm:**
```
IF frequency > 20 AND direction = "unidirectional" THEN
    pattern = "distribution"
    risk_level = "medium"
END IF
```

**Risk Assessment:**
- Classification: Medium Risk
- Score Impact: +20 points
- Recommended Action: Investigate recipients
- Common in: Airdrops, payment distribution, scams

**Indicators:**
- Many outflows
- Few inflows
- Similar amounts
- Multiple recipients

### Normal Patterns

**Characteristics:**
- Moderate transaction frequency
- Balanced inflows and outflows
- Varied transaction amounts
- Standard time intervals
- Typical usage patterns

**Detection Algorithm:**
```
IF NOT (mixing OR accumulation OR distribution) THEN
    pattern = "normal"
    risk_level = "low"
END IF
```

**Risk Assessment:**
- Classification: Low Risk
- Score Impact: 0 points
- Recommended Action: Standard monitoring
- Common in: Regular wallet usage, trading

---

## Risk Scoring System

### Overview

Automated risk assessment using multi-factor analysis to generate a numerical risk score from 0 to 100.

### Scoring Methodology

**Factor 1: Transaction Volume (Weight: 30%)**

```
IF total_volume > 100 SOL THEN
    score += 30
ELSE IF total_volume > 50 SOL THEN
    score += 20
ELSE IF total_volume > 10 SOL THEN
    score += 10
END IF
```

**Rationale:** High volume indicates significant financial activity and potential impact.

**Factor 2: Activity Frequency (Weight: 20%)**

```
IF transaction_count > 100 THEN
    score += 20
ELSE IF transaction_count > 50 THEN
    score += 15
ELSE IF transaction_count > 20 THEN
    score += 10
END IF
```

**Rationale:** High frequency may indicate automated systems or suspicious activity.

**Factor 3: Flow Imbalance (Weight: 25%)**

```
imbalance = ABS(total_received - total_sent)
IF imbalance > 50 SOL THEN
    score += 25
ELSE IF imbalance > 20 SOL THEN
    score += 15
ELSE IF imbalance > 5 SOL THEN
    score += 10
END IF
```

**Rationale:** Significant imbalance suggests accumulation or distribution activity.

**Factor 4: Recent Activity (Weight: 15%)**

```
days_since_last = (current_date - last_transaction_date) / 86400
IF days_since_last < 7 THEN
    score += 15
ELSE IF days_since_last < 30 THEN
    score += 10
ELSE IF days_since_last < 90 THEN
    score += 5
END IF
```

**Rationale:** Recent activity indicates current operational status.

**Factor 5: Cluster Membership (Weight: 10%)**

```
IF in_high_risk_cluster THEN
    score += 10
ELSE IF in_medium_risk_cluster THEN
    score += 5
END IF
```

**Rationale:** Association with suspicious clusters increases risk.

### Risk Classifications

**Low Risk (0-30)**
- Normal transaction patterns
- Balanced flows
- Low to moderate volume
- Standard activity frequency
- No cluster associations

**Recommended Actions:**
- Standard monitoring
- Periodic review
- No immediate action required

**Medium Risk (31-50)**
- Some unusual patterns
- Moderate imbalances
- Elevated activity
- Possible cluster membership

**Recommended Actions:**
- Enhanced monitoring
- Regular review
- Document findings
- Investigate if patterns persist

**High Risk (51-70)**
- Suspicious patterns detected
- Significant imbalances
- High volume or frequency
- Cluster membership likely

**Recommended Actions:**
- Immediate investigation
- Detailed analysis
- Document thoroughly
- Consider reporting

**Critical Risk (71-100)**
- Multiple red flags
- Mixing patterns detected
- Extreme imbalances
- High-risk cluster membership

**Recommended Actions:**
- Urgent investigation
- Comprehensive analysis
- Immediate reporting
- Freeze transactions if applicable

### Risk Tags

**Automated Tag Assignment:**

1. **HIGH_RISK**
   - Assigned when score >= 70
   - Indicates critical risk level
   - Requires immediate attention

2. **HIGH_ACTIVITY**
   - Assigned when transaction_count > 100
   - Indicates elevated activity
   - May suggest automated systems

3. **IMBALANCED_FLOW**
   - Assigned when imbalance > 50 SOL
   - Indicates accumulation or distribution
   - Requires pattern analysis

4. **CLUSTER_MEMBER**
   - Assigned when in detected cluster
   - Indicates pattern association
   - Inherits cluster risk level

5. **RECENT_ACTIVITY**
   - Assigned when active within 7 days
   - Indicates current operations
   - Suggests ongoing activity

---

## Cluster Detection

### Overview

Automatic identification and grouping of addresses that exhibit similar transaction patterns or behaviors.

### Detection Algorithms

**Algorithm 1: Pattern-Based Clustering**

Groups addresses by transaction pattern similarity:

```
FOR each address IN network:
    pattern = identify_pattern(address)
    clusters[pattern].add(address)
END FOR
```

**Algorithm 2: Volume-Based Clustering**

Groups addresses by transaction volume ranges:

```
FOR each address IN network:
    volume_tier = categorize_volume(address)
    clusters[volume_tier].add(address)
END FOR
```

**Algorithm 3: Temporal Clustering**

Groups addresses by transaction timing:

```
FOR each address IN network:
    time_pattern = analyze_timing(address)
    clusters[time_pattern].add(address)
END FOR
```

### Cluster Analysis

**Metrics Calculated:**

1. **Member Count**
   - Number of addresses in cluster
   - Indicates cluster size
   - Affects risk assessment

2. **Total Volume**
   - Sum of all member volumes
   - Indicates cluster significance
   - Used in risk calculation

3. **Transaction Count**
   - Total transactions across members
   - Indicates cluster activity
   - Affects pattern classification

4. **Pattern Type**
   - Dominant pattern in cluster
   - Mixing, accumulation, distribution, or normal
   - Determines cluster risk level

5. **Risk Level**
   - Aggregate risk assessment
   - Based on pattern and metrics
   - Low, medium, high, or critical

### Cluster Risk Assessment

**Risk Calculation:**

```
cluster_risk = (
    pattern_risk * 0.4 +
    volume_risk * 0.3 +
    frequency_risk * 0.2 +
    member_risk * 0.1
)
```

**Risk Levels:**

1. **Low Risk Clusters**
   - Normal patterns
   - Low to moderate volume
   - Few members
   - Standard activity

2. **Medium Risk Clusters**
   - Some unusual patterns
   - Moderate volume
   - Multiple members
   - Elevated activity

3. **High Risk Clusters**
   - Suspicious patterns
   - High volume
   - Many members
   - Coordinated activity

4. **Critical Risk Clusters**
   - Mixing patterns
   - Very high volume
   - Large membership
   - Clear coordination

---

## Transaction Analysis

### Overview

Comprehensive analysis of individual transactions and transaction flows between addresses.

### Transaction Properties

**Basic Properties:**
- Signature (unique identifier)
- Timestamp (Unix epoch)
- Slot number
- Block time
- Fee amount
- Fee payer address

**Flow Properties:**
- Source address
- Destination address
- Amount (in lamports and SOL)
- Direction (inbound/outbound)
- Type (SOL, TOKEN, NFT)

**Status Properties:**
- Success/failure status
- Error message (if failed)
- Confirmation status
- Number of confirmations

### Balance Change Analysis

**Calculation Method:**

```
FOR each account IN transaction:
    pre_balance = account.pre_balance
    post_balance = account.post_balance
    balance_change = post_balance - pre_balance
    
    IF balance_change > 0 THEN
        type = "received"
    ELSE IF balance_change < 0 THEN
        type = "sent"
    END IF
END FOR
```

**Analysis Outputs:**
- Net balance change per address
- Total inflows and outflows
- Fee deductions
- Token transfers

### Flow Tracking

**Multi-Hop Analysis:**

Tracks funds across multiple transactions:

```
Level 1: Target → Counterparty A
Level 2: Counterparty A → Counterparty B
Level 3: Counterparty B → Counterparty C
...
Level N: Counterparty X → Final Destination
```

**Flow Metrics:**
- Total hops
- Total volume
- Time elapsed
- Addresses involved
- Pattern detected

### Transaction Tables

**Table Features:**

1. **Sortable Columns**
   - Timestamp (ascending/descending)
   - Amount (high to low)
   - Status (success/failed)
   - Type (SOL/TOKEN)

2. **Filterable Data**
   - By date range
   - By amount range
   - By status
   - By type

3. **Export Options**
   - CSV format
   - JSON format
   - Excel compatible

4. **Interactive Features**
   - Click to view details
   - Hover for tooltips
   - Select multiple rows
   - Copy to clipboard

---

## Export Capabilities

### Overview

Multiple export formats to support various analysis workflows and tools.

### HTML Export

**Features:**
- Interactive D3.js visualization
- Embedded JavaScript
- Self-contained file
- No external dependencies
- Works offline

**Use Cases:**
- Presentations
- Reports
- Sharing findings
- Archival

**File Size:** 2-5 MB (typical)

### CSV Export

**Files Generated:**

1. **nodes.csv**
   - Columns: Id, Label, Type, TotalReceived, TotalSent, TransactionCount, RiskScore, Tags
   - Format: Standard CSV
   - Encoding: UTF-8

2. **edges.csv**
   - Columns: Source, Target, Weight, TransactionCount, Direction, Type
   - Format: Standard CSV
   - Encoding: UTF-8

3. **transactions_table.csv**
   - Columns: Signature, Timestamp, From, To, Amount_SOL, Type, Status, EdgeId
   - Format: Standard CSV
   - Encoding: UTF-8

4. **clusters.csv**
   - Columns: ClusterId, AddressCount, TotalVolume_SOL, TransactionCount, Pattern, RiskLevel
   - Format: Standard CSV
   - Encoding: UTF-8

**Use Cases:**
- Excel analysis
- Python/R processing
- Database import
- Reporting tools

### JSON Export

**Structure:**

```json
{
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "targetAddress": "...",
    "depth": 3,
    "totalNodes": 50,
    "totalEdges": 127,
    "totalVolume": 1234.56,
    "analysisDate": "2024-01-15T10:30:00Z"
  }
}
```

**Use Cases:**
- API integration
- Custom processing
- Data pipelines
- Archival

### Gephi Export

**Compatibility:**
- Gephi 0.9.x and higher
- Standard CSV format
- Node and edge files
- Attribute preservation

**Import Instructions:**
1. Open Gephi
2. File → Import Spreadsheet
3. Select nodes.csv
4. Import as: Nodes table
5. Repeat for edges.csv
6. Import as: Edges table

**Use Cases:**
- Advanced network analysis
- Professional visualizations
- Academic research
- Publication graphics

---

## Real-time Monitoring

### Overview

WebSocket-based real-time monitoring of address activity with instant notifications.

### Connection Management

**WebSocket Protocol:**
- Secure WebSocket (WSS)
- Automatic reconnection
- Heartbeat mechanism
- Error handling

**Connection States:**
- Connecting
- Connected
- Disconnected
- Reconnecting
- Failed

### Event Types

**Transaction Events:**
- New transaction detected
- Transaction confirmed
- Transaction failed
- Large transaction alert

**Balance Events:**
- Balance increased
- Balance decreased
- Threshold crossed
- Zero balance alert

**Pattern Events:**
- Suspicious pattern detected
- High-frequency activity
- Large transfer detected
- Cluster activity

### Notification System

**Notification Channels:**
- Console output
- File logging
- Webhook integration
- Email alerts (planned)

**Notification Format:**

```json
{
  "type": "transaction",
  "timestamp": "2024-01-15T10:30:00Z",
  "address": "...",
  "signature": "...",
  "amount": 1.5,
  "direction": "inbound",
  "counterparty": "..."
}
```

### Alert Configuration

**Threshold Settings:**
- Minimum transaction amount
- Maximum transaction frequency
- Balance change threshold
- Pattern detection sensitivity

**Alert Rules:**
- IF amount > threshold THEN alert
- IF frequency > limit THEN alert
- IF pattern = suspicious THEN alert
- IF risk_score > threshold THEN alert

---

## Compliance Tools

### Overview

Tools designed for regulatory compliance, audit trails, and KYC/AML requirements.

### KYT (Know Your Transaction)

**Report Components:**

1. **Executive Summary**
   - High-level overview
   - Key findings
   - Risk assessment
   - Recommendations

2. **Transaction Analysis**
   - Complete transaction history
   - Flow analysis
   - Pattern detection
   - Volume statistics

3. **Risk Assessment**
   - Risk score calculation
   - Factor breakdown
   - Comparative analysis
   - Trend analysis

4. **Recommendations**
   - Action items
   - Monitoring suggestions
   - Compliance notes
   - Follow-up requirements

### KYA (Know Your Address)

**Profile Components:**

1. **Address Information**
   - Public key
   - First seen date
   - Last activity date
   - Total transaction count

2. **Financial Profile**
   - Total received
   - Total sent
   - Current balance
   - Net flow

3. **Counterparty Analysis**
   - Unique counterparties
   - Top counterparties
   - Counterparty types
   - Relationship mapping

4. **Risk Profile**
   - Risk score
   - Risk factors
   - Tags and classifications
   - Cluster membership

### Audit Trail

**Documentation:**
- Analysis parameters
- Data sources
- Methodology
- Timestamps
- Analyst notes

**Archival:**
- All output files
- Configuration used
- API responses
- Generated reports

**Compliance:**
- Regulatory requirements
- Data retention policies
- Access controls
- Audit logs

---

## Conclusion

The Solana Forensic Intelligence Platform provides comprehensive features for blockchain investigation and compliance. Each feature is designed to work independently or in combination with others to provide maximum flexibility and analytical power.

For detailed usage instructions, refer to the specific tool documentation in the `docs/` directory.
