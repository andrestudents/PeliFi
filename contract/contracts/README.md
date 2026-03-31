# PeliFi Smart Contracts

## Overview

This directory contains all smart contracts for the PeliFi protocol - a permissionless lottery finance protocol on the Flow blockchain.

## 📁 Directory Structure

```
contracts/
├── core/                   # Core PeliFi contracts
│   ├── PeliFi.cdc         # Main protocol contract
│   └── PeliFiTypes.cdc    # Type definitions & events
│
├── adapters/              # Yield protocol adapters (future)
│   ├── IYieldProtocol.cdc # Interface for yield strategies
│   └── README.md          # Adapter implementation guide
│
├── yield/                 # Yield calculation strategies
│   └── README.md          # Strategy documentation
│
└── helpers/               # Helper utilities
    └── README.md          # Helper documentation
```

## 🚀 Quick Start

### Deployment

```bash
# Deploy to emulator
flow project deploy --network=emulator

# Deploy to testnet
flow project deploy --network=testnet
```

### Current Status

| Contract | Status | Deployment | Notes |
|----------|--------|------------|-------|
| **PeliFi** | ✅ Active | Emulator, Testnet | Main protocol |
| **PeliFiTypes** | ✅ Active | Emulator, Testnet | Types & events |
| **IYieldProtocol** | 🔵 Design | Not deployed | Interface only |

## 📋 Contract Details

### Core Contracts

#### PeliFi.cdc
Main protocol contract that manages:
- Pool creation and management
- User deposits and withdrawals
- Yield calculation and distribution
- Early exit functionality
- Pool lifecycle (OPEN → ACTIVE → COMPLETED/CANCELLED)

**Key Features:**
- Permissionless pool creation
- Auto-activation when capacity reached
- Early exit during OPEN period (no penalty)
- Random winner selection via Fisher-Yates shuffle
- Fixed 7% APR yield

#### PeliFiTypes.cdc
Type definitions and supporting structs:
- `UserPosition`: User's position in a pool
- `PoolDetails`: Pool information and status
- Status constants (OPEN, ACTIVE, COMPLETED, CANCELLED)
- Event definitions

### Adapters (Future)

#### IYieldProtocol.cdc
Interface for yield protocol integration:

**Purpose:** Enable PeliFi to use different yield strategies

**Future Implementations:**
- Flow Staking (validator delegation)
- DeFi Lending (protocol integration)
- Liquidity Pool (AMM strategies)

**Status:** Design document - not yet implemented

See [adapters/README.md](./adapters/README.md) for details.

## 🔄 Architecture

### Current Implementation

```
User Deposit
    ↓
Pool Resource (holds funds)
    ↓
Simulated Yield (7% APR)
    ↓
Distribute to Winners (random selection)
```

### Future Implementation (with Adapters)

```
User Deposit
    ↓
Pool Resource (holds funds)
    ↓
Yield Adapter (e.g., Flow Staking)
    ↓
Real Yield Generation
    ↓
Distribute to Winners (random selection)
```

## 🔧 Development

### Contract Dependencies

```json
{
  "PeliFi": ["PeliFiTypes", "FlowToken"],
  "PeliFiTypes": [],
  "IYieldProtocol": ["FlowToken"]
}
```

### Key Constants

```cadence
YIELD_APR = 0.07              // 7% annual percentage yield
ADMIN_FEE_PERCENTAGE = 0.01   // 1% admin fee
MIN_YIELD_THRESHOLD = 0.01    // 0.01 FLOW minimum payout
```

## 📊 Protocol Flow

### Pool Lifecycle

1. **Creation** (Admin)
   ```cadence
   createPool(
       name: "My Pool",
       capacity: 100,
       depositAmount: 100.0,
       activeDuration: 86400.0,  // 1 day
       winnerCount: 10
   )
   ```

2. **Join Phase** (Users)
   ```cadence
   joinPool(
       poolId: 1,
       user: 0x1234,
       amount: 100.0
   )
   ```

3. **Auto-Activation** (System)
   - When `currentUserCount == capacity`
   - Status: OPEN → ACTIVE

4. **Distribution** (Admin)
   ```cadence
   distributeYield(
       poolId: 1,
       randomSeed: [1, 2, 3, ...]
   )
   ```

5. **Claim** (Users)
   ```cadence
   claimWithdraw(
       poolId: 1,
       user: 0x1234
   )
   ```

## 🛡️ Security Considerations

### Current Security Model
- **Randomness**: Uses provided seed + Fisher-Yates shuffle
- **Access Control**: Admin resource for sensitive operations
- **Preconditions**: Extensive input validation

### Future Improvements
- [ ] Verifiable random function (VRF) integration
- [ ] Multi-sig admin controls
- [ ] Timelock for critical operations
- [ ] Adapter security audits

## 📈 Roadmap

### Phase 1: Foundation ✅
- [x] Core pool functionality
- [x] Yield calculation
- [x] Winner distribution
- [x] Early exit mechanism

### Phase 2: Adapter System 🔵
- [ ] Interface design (in progress)
- [ ] Extract current logic to SimulatedYield
- [ ] Flow Staking integration
- [ ] Adapter management

### Phase 3: Advanced Features ⏳
- [ ] Multi-strategy pools
- [ ] Dynamic APY
- [ ] Emergency controls
- [ ] Governance integration

## 🔍 Related Documentation

- [Project Overview](../../README.md)
- [Adapter Implementation Guide](./adapters/README.md)
- [Yield Strategies](./yield/README.md)
- [Helper Utilities](./helpers/README.md)
- [Trixy Reference Implementation](../../referention/contracts/)

## 📝 Notes

### Recent Restructure (2026-03-31)

The contracts directory has been restructured to prepare for future adapter support:

- **Old Structure**: Flat with all contracts in root
- **New Structure**: Organized by purpose (core/, adapters/, yield/, helpers/)
- **Impact**: Path changes in `flow.json`, but no code changes
- **Status**: ✅ Backward compatible - all tests should pass

### Migration Guide

If you have existing code referencing old paths:

```diff
- import "PeliFi" from "cadence/contracts/PeliFi.cdc"
+ import "PeliFi" from "cadence/contracts/core/PeliFi.cdc"

- import "PeliFiTypes" from "cadence/contracts/PeliFiTypes.cdc"
+ import "PeliFiTypes" from "cadence/contracts/core/PeliFiTypes.cdc"
```

Flow CLI handles imports via contract names (not paths), so most code doesn't need changes.

## 🤝 Contributing

When adding new contracts:

1. Place in appropriate directory (core/, adapters/, yield/, helpers/)
2. Follow existing naming conventions
3. Add comprehensive documentation
4. Include test cases
5. Update relevant README files

## 📜 License

Same as PeliFi project license.

---

**Last Updated**: 2026-03-31
**Restructure**: Phase 1 Complete ✅
**Maintainer**: PeliFi Team
