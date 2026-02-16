# Project Structure

This document describes the clean, production-ready structure of the Solana Address Tracker project.

## Directory Tree

```
solana-address-tracker/
├── src/                          # Source code
│   ├── scripts/                  # Executable scripts
│   │   ├── kyt-audit-single-address.ts    # Main KYT/KYA audit tool
│   │   ├── trace-single-address.ts        # Basic address tracer
│   │   ├── check-address.ts               # Quick address checker
│   │   └── monitor-address.ts             # Real-time monitor
│   │
│   ├── services/                 # API integrations
│   │   └── helius.service.ts              # Helius API service
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts
│
├── data/                         # Output directory
│   ├── kyt_audit/                # KYT audit reports
│   ├── single_address_trace/     # Single address traces
│   └── scammer_outflows/         # Scammer tracking data
│
├── docs/                         # Documentation
│   └── PROJECT_STRUCTURE.md      # This file
│
├── .vscode/                      # VS Code settings
├── node_modules/                 # Dependencies (gitignored)
│
├── .dockerignore                 # Docker ignore rules
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── CONTRIBUTING.md               # Contribution guidelines
├── docker-compose.yml            # Docker Compose config
├── Dockerfile                    # Docker image definition
├── Dockerfile.monitor            # Monitor service Docker
├── LICENSE                       # MIT License
├── Makefile                      # Build automation
├── package.json                  # Node.js dependencies
├── package-lock.json             # Locked dependencies
├── README.md                     # Main documentation
└── tsconfig.json                 # TypeScript configuration
```

## Core Components

### Scripts (`src/scripts/`)

#### 1. `kyt-audit-single-address.ts` ⭐ PRIMARY TOOL
**Purpose**: Comprehensive KYT/KYA audit with deep network analysis

**Features**:
- Recursive transaction tracking (depth 1-5)
- Cluster identification
- Pattern detection
- Comprehensive reporting

**Usage**:
```bash
npx tsx src/scripts/kyt-audit-single-address.ts <ADDRESS> <DEPTH>
```

**Output**:
- Markdown audit report
- Transaction flows CSV
- Address analysis CSV

---

#### 2. `trace-single-address.ts`
**Purpose**: Basic address tracing without depth analysis

**Features**:
- Transaction history (max 1000)
- Counterparty identification
- Financial metrics
- Risk scoring (optional)

**Usage**:
```bash
npx tsx src/scripts/trace-single-address.ts <ADDRESS>
```

**Output**:
- Transactions CSV
- Counterparties CSV
- Summary JSON

---

#### 3. `check-address.ts`
**Purpose**: Quick address risk check

**Features**:
- Fast risk assessment
- Basic statistics
- Console output only

**Usage**:
```bash
npx tsx src/scripts/check-address.ts <ADDRESS>
```

**Output**: Console only

---

#### 4. `monitor-address.ts`
**Purpose**: Real-time transaction monitoring

**Features**:
- WebSocket connection
- Live transaction alerts
- Continuous monitoring

**Usage**:
```bash
npx tsx src/scripts/monitor-address.ts <ADDRESS>
```

**Output**: Real-time console logs

---

### Services (`src/services/`)

#### 1. `helius.service.ts` ⭐ CORE SERVICE
**Purpose**: Helius API integration

**Methods**:
- `getTransactionsForAddress(address, limit)` - Fetch transaction history
- `parseTransaction(tx)` - Parse transaction data
- `extractBalanceChanges(tx)` - Extract balance changes

**Rate Limiting**: Built-in delays and retry logic

---

### Types (`src/types/`)

TypeScript type definitions for:
- Transaction flows
- Address analysis
- API responses
- Configuration

---

## Data Output (`data/`)

### Structure
```
data/
├── kyt_audit/
│   ├── <address>_depth<n>_KYT_AUDIT_REPORT.md
│   ├── <address>_depth<n>_flows.csv
│   └── <address>_depth<n>_addresses.csv
│
├── single_address_trace/
│   ├── <address>_transactions.csv
│   ├── <address>_counterparties.csv
│   └── <address>_summary.json
│
└── scammer_outflows/
    ├── outflow_transactions.csv
    ├── address_analysis.csv
    └── summary.json
```

### File Formats

**Markdown (.md)**
- Human-readable reports
- Formatted with tables and sections
- Best viewed in Markdown viewers

**CSV (.csv)**
- Spreadsheet-compatible
- Can be imported to Excel, Gephi, Python
- Comma-separated values

**JSON (.json)**
- Machine-readable
- Structured data
- Programmatic access

---

## Configuration Files

### `.env`
Environment variables (gitignored):
```env
HELIUS_API_KEY=your_key_here
```

### `.env.example`
Template for environment setup

### `tsconfig.json`
TypeScript compiler configuration:
- Target: ES2020
- Module: CommonJS
- Strict mode enabled

### `package.json`
Node.js project configuration:
- Dependencies
- Scripts
- Metadata

---

## Docker Support

### `Dockerfile`
Main application container

### `Dockerfile.monitor`
Monitoring service container

### `docker-compose.yml`
Multi-container orchestration

**Usage**:
```bash
docker-compose up
```

---

## Development Files

### `Makefile`
Build automation commands:
```bash
make build    # Build TypeScript
make test     # Run tests
make clean    # Clean build files
```

### `.vscode/settings.json`
VS Code workspace settings:
- TypeScript configuration
- Formatting rules
- Extensions

---

## Documentation (`docs/`)

### Current Files
- `PROJECT_STRUCTURE.md` - This file

### Planned Files
- `API_REFERENCE.md` - API documentation
- `EXAMPLES.md` - Usage examples
- `TROUBLESHOOTING.md` - Common issues

---

## Excluded from Git

See `.gitignore` for full list:
- `node_modules/` - Dependencies
- `.env` - Environment variables
- `data/**/*.csv` - Output CSV files
- `data/**/*.md` - Output reports
- `dist/` - Build output

---

## Clean Code Principles

### 1. Separation of Concerns
- Scripts: User-facing executables
- Services: API integrations
- Types: Type definitions

### 2. Single Responsibility
- Each script has one clear purpose
- Each service handles one API
- Each type file groups related types

### 3. DRY (Don't Repeat Yourself)
- Shared logic in services
- Reusable types
- Common utilities

### 4. Production Ready
- Error handling
- Rate limiting
- Type safety
- Documentation

---

## Adding New Features

### New Script
1. Create in `src/scripts/`
2. Follow naming: `kebab-case.ts`
3. Add usage documentation
4. Update README.md

### New Service
1. Create in `src/services/`
2. Use class-based structure
3. Add error handling
4. Document methods

### New Types
1. Add to `src/types/index.ts`
2. Export properly
3. Document complex types

---

## Build Process

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

---

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check for vulnerabilities: `npm audit`
- Clean build: `make clean`
- Remove old data: `rm -rf data/kyt_audit/*`

### Code Quality
- Follow TypeScript best practices
- Add comments for complex logic
- Keep functions small (<50 lines)
- Use meaningful names

---

## Summary

This project structure is designed for:
- ✅ Clean code organization
- ✅ Easy maintenance
- ✅ Professional development
- ✅ Production readiness
- ✅ Scalability

All unnecessary files have been removed, leaving only essential components for a professional blockchain intelligence tool.
