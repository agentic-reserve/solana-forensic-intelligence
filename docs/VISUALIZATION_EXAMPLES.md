# 📊 Visualization Examples

## Understanding the Graph

### Node Types

#### 🔴 Target Node (Red)
```
     ┌─────────┐
     │ TARGET  │ ← The address you're investigating
     │ Address │
     └─────────┘
```

**Properties:**
- Always centered in the graph
- Largest node (if high activity)
- Risk score calculated
- All connections visible

#### 🔵 Counterparty Nodes (Blue)
```
     ┌─────────┐
     │Counter- │ ← Addresses that transacted with target
     │ party   │
     └─────────┘
```

**Properties:**
- Size based on transaction count
- Risk score calculated
- May have connections to other counterparties
- Can be part of clusters

#### 🟢 Cluster Nodes (Green)
```
     ┌─────────┐
     │Cluster  │ ← Addresses identified as part of a pattern
     │ Member  │
     └─────────┘
```

**Properties:**
- Grouped by transaction pattern
- Shared risk assessment
- Connected to cluster members

### Edge Types

#### Solid Line (Bidirectional)
```
[Node A] ━━━━━━━━━━━━━━━━━━━━ [Node B]
         ←─────────────────→
         Money flows both ways
```

**Indicates:**
- Active trading relationship
- Potential business partners
- Exchange interactions
- Normal back-and-forth transactions

#### Dashed Line (Unidirectional)
```
[Node A] ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄→ [Node B]
         One-way flow only
```

**Indicates:**
- Payment or transfer
- Potential scam (if to unknown address)
- Airdrop or distribution
- One-time transaction

#### Line Thickness
```
[Node A] ━━━━━━━━━━━━━━━━━━━━ [Node B]  ← High volume (thick)
[Node C] ─────────────────── [Node D]  ← Low volume (thin)
```

**Indicates:**
- Total transaction volume
- Importance of relationship
- Potential risk level

## Example Scenarios

### Scenario 1: Normal Wallet Activity

```
         [Exchange]
              │
              ↓ (deposit)
         [Your Wallet]
              │
              ↓ (payment)
         [Merchant]
```

**Characteristics:**
- Low risk scores (0-30)
- Few connections (2-5)
- Normal pattern cluster
- Bidirectional with exchange
- Unidirectional to merchant

**Risk Assessment:** ✅ LOW RISK

### Scenario 2: Suspicious Mixing Pattern

```
    [Source A]     [Source B]     [Source C]
         │              │              │
         └──────────────┼──────────────┘
                        ↓
                   [Mixer Hub]
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    [Dest A]       [Dest B]       [Dest C]
```

**Characteristics:**
- High risk score (70-100)
- Many connections (>20)
- Mixing pattern cluster
- High frequency, low amounts
- Rapid succession

**Risk Assessment:** 🚨 CRITICAL RISK

### Scenario 3: Accumulation Pattern

```
    [Whale 1]
         │
         ↓ (large transfer)
    [Target Wallet] ← High risk score
         ↑
         │
    [Whale 2]
```

**Characteristics:**
- High risk score (50-70)
- Few connections (2-5)
- Accumulation pattern
- Large amounts (>10 SOL)
- Low frequency

**Risk Assessment:** ⚠️ HIGH RISK (Monitor)

### Scenario 4: Distribution/Airdrop

```
                [Source Wallet]
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    [Recipient 1] [Recipient 2] [Recipient 3]
         │             │             │
         └─────────────┼─────────────┘
                       │
                  [Many more...]
```

**Characteristics:**
- Medium risk score (40-60)
- Many connections (>50)
- Distribution pattern
- Unidirectional flows
- Similar amounts

**Risk Assessment:** ⚠️ MEDIUM RISK (Investigate)

## Interactive Features

### Click on Node

```
┌─────────────────────────────────┐
│ Node Details                    │
├─────────────────────────────────┤
│ Address: 3nMNd89...             │
│ Type: counterparty              │
│ Total Received: 125.45 SOL      │
│ Total Sent: 98.76 SOL           │
│ Net Flow: +26.69 SOL            │
│ Transaction Count: 234          │
│ Risk Score: 67/100              │
│ Tags: HIGH_ACTIVITY,            │
│       IMBALANCED_FLOW           │
│ First Seen: 2024-01-01          │
│ Last Seen: 2024-01-15           │
└─────────────────────────────────┘
```

### Double-Click on Node

```
┌─────────────────────────────────────────────────────────┐
│ Transactions                                            │
├─────────────────────────────────────────────────────────┤
│ Timestamp          │ From    │ To      │ Amount │ Status│
├────────────────────┼─────────┼─────────┼────────┼───────┤
│ 2024-01-15 10:30  │ 3nMN... │ 6LMc... │ 1.5 SOL│ ✓     │
│ 2024-01-15 11:45  │ 6LMc... │ 3nMN... │ 0.8 SOL│ ✓     │
│ 2024-01-14 09:20  │ 3nMN... │ 6LMc... │ 2.3 SOL│ ✓     │
│ ...                                                      │
└─────────────────────────────────────────────────────────┘
```

### Click on Edge

```
┌─────────────────────────────────────────────────────────┐
│ Edge Details: 3nMN... → 6LMc...                        │
├─────────────────────────────────────────────────────────┤
│ Total Volume: 45.67 SOL                                │
│ Transaction Count: 23                                   │
│ Direction: Bidirectional                                │
│ Type: SOL                                               │
│                                                         │
│ Recent Transactions:                                    │
│ • 2024-01-15 10:30 - 1.5 SOL (success)                │
│ • 2024-01-15 11:45 - 0.8 SOL (success)                │
│ • 2024-01-14 09:20 - 2.3 SOL (success)                │
│ [View all 23 transactions]                             │
└─────────────────────────────────────────────────────────┘
```

## Cluster Visualization

### Mixing Cluster (Critical Risk)

```
         [Hub Address]
              │
    ┌─────────┼─────────┐
    │         │         │
[Addr 1]  [Addr 2]  [Addr 3]
    │         │         │
    └─────────┼─────────┘
              │
         [Hub Address]
              │
    ┌─────────┼─────────┐
    │         │         │
[Addr 4]  [Addr 5]  [Addr 6]
```

**Pattern:**
- Circular flow
- High frequency
- Low amounts
- Multiple hops

**Risk:** 🚨 CRITICAL

### Accumulation Cluster (High Risk)

```
[Whale 1] ──→ [Target] ←── [Whale 2]
                 ↓
            [Cold Storage]
```

**Pattern:**
- Large inflows
- Single destination
- Low frequency
- High amounts

**Risk:** ⚠️ HIGH

### Distribution Cluster (Medium Risk)

```
         [Source]
              │
    ┌─────────┼─────────┐
    ↓         ↓         ↓
[Dest 1]  [Dest 2]  [Dest 3]
    ↓         ↓         ↓
[Final 1] [Final 2] [Final 3]
```

**Pattern:**
- Tree structure
- Unidirectional
- Multiple levels
- Similar amounts

**Risk:** ⚠️ MEDIUM

## Risk Score Visualization

### Color Coding

```
┌────────────────────────────────┐
│ Risk Score Scale               │
├────────────────────────────────┤
│ 0-30   │ 🟢 Green  │ Low       │
│ 31-50  │ 🟡 Yellow │ Medium    │
│ 51-70  │ 🟠 Orange │ High      │
│ 71-100 │ 🔴 Red    │ Critical  │
└────────────────────────────────┘
```

### Node Size by Activity

```
Small Node (●)     = 1-10 transactions
Medium Node (●●)   = 11-50 transactions
Large Node (●●●)   = 51-100 transactions
Huge Node (●●●●)   = 100+ transactions
```

## Export Formats

### 1. Gephi Import

```
nodes.csv:
Id,Label,Type,TotalReceived,TotalSent,TransactionCount,RiskScore,Tags
3nMN...,3nMN...yyH,target,125.45,98.76,234,67,"HIGH_ACTIVITY;IMBALANCED_FLOW"

edges.csv:
Source,Target,Weight,TransactionCount,Direction,Type
3nMN...,6LMc...,45.67,23,bidirectional,SOL
```

### 2. Transaction Table

```
transactions_table.csv:
Signature,Timestamp,From,To,Amount_SOL,Type,Status,EdgeId
5h6xBE...,2024-01-15T10:30:00Z,3nMN...,6LMc...,1.5,SOL,success,3nMN-6LMc
```

### 3. Cluster Analysis

```
clusters.csv:
ClusterId,AddressCount,TotalVolume_SOL,TransactionCount,Pattern,RiskLevel
CLUSTER_1,15,1234.56,456,mixing,critical
CLUSTER_2,8,567.89,123,accumulation,high
```

## Tips for Interpretation

### 🔍 Investigation Checklist

1. **Check Target Node**
   - [ ] Risk score
   - [ ] Transaction count
   - [ ] Net flow (positive/negative)
   - [ ] Tags

2. **Analyze Connections**
   - [ ] Number of counterparties
   - [ ] Edge directions
   - [ ] Volume distribution
   - [ ] Cluster membership

3. **Review Patterns**
   - [ ] Mixing behavior
   - [ ] Accumulation signs
   - [ ] Distribution patterns
   - [ ] Time-based clustering

4. **Assess Risk**
   - [ ] Overall risk score
   - [ ] Cluster risk levels
   - [ ] Connection to known bad actors
   - [ ] Suspicious patterns

### 🚩 Red Flags

- Risk score >70
- Mixing pattern cluster
- Many small transactions
- Rapid succession
- Connections to high-risk addresses
- Imbalanced flows (>50 SOL)
- Recent high activity

### ✅ Green Flags

- Risk score <30
- Normal pattern cluster
- Few connections
- Balanced flows
- Known counterparties
- Low activity
- Long history

## Real-World Examples

### Example 1: Legitimate Trader

```
Risk Score: 25/100
Pattern: Normal
Connections: 5
Volume: 50 SOL
Tags: None

[Exchange A] ←→ [Trader] ←→ [Exchange B]
                    ↓
              [DeFi Protocol]
```

**Assessment:** ✅ Safe to transact

### Example 2: Potential Scammer

```
Risk Score: 85/100
Pattern: Mixing
Connections: 50+
Volume: 500 SOL
Tags: HIGH_RISK, CLUSTER_MEMBER

[Victims] → [Scammer] → [Mixer] → [Unknown]
```

**Assessment:** 🚨 Do not transact

### Example 3: Whale Accumulation

```
Risk Score: 60/100
Pattern: Accumulation
Connections: 3
Volume: 1000 SOL
Tags: HIGH_ACTIVITY

[Exchange] → [Whale] → [Cold Storage]
```

**Assessment:** ⚠️ Monitor activity

---

**Pro Tip:** Always cross-reference findings with blockchain explorers and multiple analysis tools before making decisions.

**create for solana superteam indonesia**
*created by:@XBT_kw*