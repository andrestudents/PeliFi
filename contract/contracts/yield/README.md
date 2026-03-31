# PeliFi Yield Strategies

## Overview

This directory contains yield calculation strategies for PeliFi pools.

## Purpose

Yield strategies define how PeliFi pools generate returns on deposited funds:

- **Simulated**: Fixed APR calculation (current implementation)
- **Real Protocols**: Integration with actual yield-generating protocols
- **Hybrid**: Combination of multiple strategies

## Architecture

```
Yield Strategy
    ↓
├── SimulatedYield (current - in PeliFi.cdc)
├── FlowStakingStrategy (planned)
├── DefiLendingStrategy (planned)
└── HybridStrategy (planned)
```

## Current State

### Active Strategy

**SimulatedYield** (Currently in PeliFi.cdc)

- **Location**: `core/PeliFi.cdc` (line 323-326)
- **APR**: Fixed 7% (0.07)
- **Calculation**: `principal × APR × (duration / seconds_per_year)`
- **Status**: ✅ Active
- **Deployment**: Deployed with PeliFi contract

```cadence
// Current implementation in PeliFi.cdc
access(self) fun calculateYield(principal: UFix64, durationSeconds: UFix64): UFix64 {
    let secondsPerYear: UFix64 = 31536000.0
    let years = durationSeconds / secondsPerYear
    return principal * PeliFi.YIELD_APR * years
}
```

### Planned Strategies

| Strategy | Description | Status | Est. APY | Risk Level |
|----------|-------------|--------|----------|------------|
| **FlowStakingStrategy** | Delegate FLOW to validators, earn staking rewards | Not Started | 7-9% | Low |
| **DefiLendingStrategy** | Lend FLOW on DeFi protocols, earn interest | Not Started | Variable | Medium |
| **HybridStrategy** | Dynamic allocation across multiple strategies | Not Started | Variable | Low-Med |

## Strategy Comparison

| Feature | SimulatedYield | FlowStaking | DeFi Lending | Hybrid |
|---------|---------------|-------------|--------------|--------|
| **Real Yield** | ❌ No (simulated) | ✅ Yes | ✅ Yes | ✅ Yes |
| **APY Type** | Fixed (7%) | Dynamic | Dynamic | Dynamic |
| **Risk Level** | None (trust contract) | Low | Medium | Low-Med |
| **Liquidity** | Immediate | 7-14 day unbond | Varies | Varies |
| **Complexity** | Low | Medium | High | Very High |
| **Implementation Status** | ✅ Complete | ❌ Planned | ❌ Planned | ❌ Planned |

## Implementation Plan

### Phase 1: Extract Current Logic

Create `SimulatedYield.cdc` to extract current logic:

```cadence
import "FlowToken"
import "IYieldProtocol"

access(all) contract SimulatedYield: IYieldProtocol {

    access(all) let FIXED_APR: UFix64
    access(self) var positions: {String: Position}

    access(self) struct Position {
        access(all) let principal: UFix64
        access(all) let startTime: UFix64

        init(principal: UFix64) {
            self.principal = principal
            self.startTime = getCurrentBlock().timestamp
        }
    }

    init(fixedAPR: UFix64) {
        self.FIXED_APR = fixedAPR
        self.positions = {}
    }

    access(all) fun deposit(vault: @FlowToken.Vault): String {
        let amount = vault.balance
        let positionId = "sim_".concat(UUID().toString())

        let position = Position(principal: amount)
        self.positions[positionId] = position

        destroy vault
        return positionId
    }

    access(all) fun withdraw(amount: UFix64, positionId: String): @FlowToken.Vault {
        pre {
            self.positions.containsKey(positionId): "Position not found"
        }

        let position = self.positions[positionId]!

        // Calculate elapsed time
        let currentTime = getCurrentBlock().timestamp
        let durationSeconds = currentTime - position.startTime

        // Calculate yield: principal × APR × (duration / year)
        let secondsPerYear: UFix64 = 31536000.0
        let years = durationSeconds / secondsPerYear
        let yield = position.principal * self.FIXED_APR * years

        let totalAmount = position.principal + yield

        self.positions[positionId] = nil

        let vault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        // ... fund vault with totalAmount
        return <-vault
    }

    access(all) fun getCurrentAPY(): UFix64 {
        return self.FIXED_APR
    }

    access(all) fun getBalance(positionId: String): UFix64 {
        let position = self.positions[positionId]
        if let p = position {
            // Calculate current value with yield
            let currentTime = getCurrentBlock().timestamp
            let durationSeconds = currentTime - p.startTime
            let secondsPerYear: UFix64 = 31536000.0
            let years = durationSeconds / secondsPerYear
            let yield = p.principal * self.FIXED_APR * years
            return p.principal + yield
        }
        return 0.0
    }

    access(all) fun getProtocolName(): String {
        return "Simulated Yield"
    }

    access(all) fun getProtocolType(): UInt8 {
        return 99  // Simulated/test type
    }
}
```

### Phase 2: Flow Staking Strategy

Integrate with Flow's native staking mechanism:

```cadence
// Pseudo-code - implementation depends on Flow staking contracts
access(all) contract FlowStakingStrategy: IYieldProtocol {

    access(all) fun deposit(vault: @FlowToken.Vault): String {
        // 1. Delegate tokens to validator
        // 2. Store delegation record
        // 3. Return position ID
    }

    access(all) fun withdraw(amount: UFix64, positionId: String): @FlowToken.Vault {
        // 1. Request undelegation (start unbonding period)
        // 2. Wait for unbonding (7-14 days)
        // 3. Return staked tokens + rewards
    }

    access(all) fun getCurrentAPY(): UFix64 {
        // Query current network staking APY
        // Can use oracle or on-chain data
        return 0.08  // ~8%
    }

    // ... other methods
}
```

### Phase 3: DeFi Lending Strategy

Connect to Flow DeFi lending protocols:

```cadence
// Pseudo-code - depends on available DeFi protocols
access(all) contract DefiLendingStrategy: IYieldProtocol {

    access(all) fun deposit(vault: @FlowToken.Vault): String {
        // 1. Deposit to lending protocol
        // 2. Receive interest-bearing tokens
        // 3. Return position ID
    }

    access(all) fun withdraw(amount: UFix64, positionId: String): @FlowToken.Vault {
        // 1. Withdraw from lending protocol
        // 2. Convert interest tokens to FLOW
        // 3. Return principal + interest
    }

    access(all) fun getCurrentAPY(): UFix64 {
        // Query current lending APY
        // Varies based on utilization
        return 0.05  // 5%
    }

    // ... other methods
}
```

## Design Considerations

### APY Calculation

**Simulated (Current)**
- Formula: `principal × fixed_APR × time_in_years`
- Pros: Predictable, simple
- Cons: Not real yield, requires trust

**Real Staking**
- Formula: `rewards / principal × (365 / days_staked)`
- Pros: Real yield, low risk
- Cons: Unbonding period, APY varies

**DeFi Lending**
- Formula: `interest_rate × utilization × time`
- Pros: Higher APY potential
- Cons: Higher risk, protocol dependency

### Risk Management

| Risk Type | Simulated | Staking | DeFi | Mitigation |
|-----------|-----------|---------|------|------------|
| **Smart Contract Risk** | Low | Low | High | Audits, testing |
| **Protocol Risk** | None | Low | High | Diversification |
| **APY Volatility** | None | Low | High | Hybrid strategies |
| **Liquidity Risk** | None | Medium | Low | Emergency exits |

## Migration Strategy

### From Simulated to Real Yield

1. **Deploy New Strategy**
   ```bash
   flow project deploy --network=testnet
   ```

2. **Update Pools Gradually**
   - Existing pools continue with simulated yield
   - New pools can choose strategy
   - Optional migration for existing pools

3. **Backward Compatibility**
   - Keep `SimulatedYield` as default
   - Allow opt-in to real yield strategies
   - Gradual transition

## Testing

Each strategy must pass these tests:

- [ ] Deposit correctly stores position
- [ ] Withdraw returns principal + yield
- [ ] APY calculation is accurate
- [ ] Edge cases handled (zero duration, etc.)
- [ ] Gas efficiency tested
- [ ] Integration with PeliFi.Pool works

## Future Enhancements

- **Auto-compounding**: Reinvest yield automatically
- **Strategy switching**: Change strategy during pool life
- **Multi-strategy pools**: Allocate across strategies
- **Dynamic APY**: Adjust based on market conditions
- **Risk scoring**: Display risk metrics to users

## References

- [Flow Staking Docs](https://docs.onflow.org/flow/staking/)
- [IYieldProtocol Interface](../adapters/IYieldProtocol.cdc)
- [Trixy Reference](../../referention/contracts/adapters/)

---

**Last Updated**: 2026-03-31
**Status**: Design Phase
**Maintainer**: PeliFi Team
