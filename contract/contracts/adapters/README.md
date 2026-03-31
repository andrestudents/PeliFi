# PeliFi Yield Adapters

## Overview

This directory contains yield protocol adapters for PeliFi pools.

## Purpose

Adapters enable PeliFi to integrate with different yield generation strategies:
- **Staking**: Flow network staking and other PoS protocols
- **Lending**: DeFi lending protocols
- **Liquidity Pool**: AMM liquidity provision strategies
- **Hybrid**: Multi-strategy combinations

## Status

⚠️ **DESIGN PHASE** - Interface only, no implementations yet.

## Architecture

All adapters implement the `IYieldProtocol` interface defined in `IYieldProtocol.cdc`.

```
IYieldProtocol (interface)
    ↓
├── FlowStakingAdapter (planned)
├── DefiLendingAdapter (planned)
├── LpAdapter (planned)
└── SimulatedYield (current logic in PeliFi.cdc)
```

## Planned Adapters

| Adapter | Description | Status | Priority | Est. APY |
|---------|-------------|--------|----------|----------|
| **FlowStakingAdapter** | Flow network staking with validator selection | Not Started | HIGH | ~7-9% |
| **DefiLendingAdapter** | Integration with Flow DeFi lending protocols | Not Started | MEDIUM | Variable |
| **LpAdapter** | Automated market maker liquidity pool strategies | Not Started | LOW | Variable |
| **HybridAdapter** | Multi-strategy combination for risk management | Not Started | LOW | Variable |

## Current State

### Phase 1: Interface Definition ✅
- [x] Define `IYieldProtocol` interface
- [x] Document method signatures
- [x] Create integration guide

### Phase 2: Extract Current Logic (Next)
- [ ] Create `SimulatedYield.cdc` adapter
- [ ] Extract hardcoded APR logic from `PeliFi.cdc`
- [ ] Keep PeliFi working with current behavior

### Phase 3: Implement Flow Staking (Future)
- [ ] Implement `FlowStakingAdapter.cdc`
- [ ] Integrate with Flow staking contracts
- [ ] Handle unbonding periods
- [ ] Add validator selection logic

### Phase 4: PeliFi Integration (Future)
- [ ] Modify `PeliFi.Pool` to accept adapter address
- [ ] Update `createPool` to accept yield protocol parameter
- [ ] Add adapter management functions
- [ ] Migration path for existing pools

## Integration Guide (Future)

When implementing new adapters:

### 1. Implement Interface

```cadence
import "FlowToken"
import "IYieldProtocol"

access(all) contract MyAdapter: IYieldProtocol {

    access(all) fun deposit(vault: @FlowToken.Vault): String {
        // Your deposit logic
        return positionId
    }

    access(all) fun withdraw(amount: UFix64, positionId: String): @FlowToken.Vault {
        // Your withdraw logic
        return <-vault
    }

    access(all) fun getCurrentAPY(): UFix64 {
        // Return current APY
        return 0.08  // 8%
    }

    access(all) fun getBalance(positionId: String): UFix64 {
        // Return current balance
        return balance
    }

    access(all) fun getProtocolName(): String {
        return "My Protocol"
    }

    access(all) fun getProtocolType(): UInt8 {
        return 0  // Staking
    }
}
```

### 2. Deploy Adapter Contract

```bash
flow project deploy --network=testnet
```

### 3. Update PeliFi Pool Creation

```cadence
// In createPool transaction
let adapterAddress = 0x[MADAPTER]
let pool <- create Pool(
    // ... params ...
    yieldProtocolAddress: adapterAddress
)
```

### 4. Test Thoroughly

```bash
# Test deposit
flow scripts execute CheckAdapterBalance.cdc

# Test pool with adapter
flow transactions send CreatePoolWithAdapter.cdc

# Test yield distribution
flow transactions send DistributeYield.cdc
```

## Design Decisions

### Why Adapter Pattern?

1. **Separation of Concerns**: Core pool logic separated from yield generation
2. **Flexibility**: Easy to add/remove protocols
3. **Testability**: Can test adapters independently
4. **Future-Proof**: New protocols can be added without touching core logic
5. **Risk Management**: Can diversify across multiple protocols

### Interface Design Choices

- **String position IDs**: More flexible than numeric IDs
- **Vault-based**: Follows Cadence resource-oriented patterns
- **APY accessor**: Allows dynamic APY based on market conditions
- **Protocol type**: Enables UI/UX filtering and grouping

## Challenges & Considerations

### Flow Ecosystem Limitations

Unlike Ethereum, Flow has fewer DeFi protocols. This affects:

1. **Protocol Options**: Limited to Flow-native protocols
2. **Liquidity**: Smaller pools may have slippage issues
3. **Maturity**: Newer protocols = higher risk

### Technical Considerations

1. **Unbonding Periods**: Flow staking has ~7-14 day unbonding
2. **APY Variability**: Real APY changes over time
3. **Rebalancing**: May need to move funds between protocols
4. **Gas Efficiency**: Adapter calls add transaction overhead

### Security Considerations

1. **Smart Contract Risk**: Each adapter is an attack vector
2. **Protocol Risk**: Underlying protocol can fail
3. **Oracle Risk**: APY data may be manipulated
4. **Immutability**: Once deployed, adapter logic can't be changed

## Reference Implementation

See `/referention/contracts/adapters/` for Trixy adapter implementations:
- `AnkrAdapter.cdc` - Staking adapter example
- `IncrementAdapter.cdc` - Staking adapter example
- `FigmentAdapter.cdc` - Staking adapter example

## Contributing

To add a new adapter:

1. Create adapter contract in this directory
2. Implement `IYieldProtocol` interface
3. Add documentation
4. Add test cases
5. Update this README

## License

Same as PeliFi project license.

---

**Last Updated**: 2026-03-31
**Status**: Design Phase
**Maintainer**: PeliFi Team
