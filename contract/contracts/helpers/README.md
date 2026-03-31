# PeliFi Helper Contracts

## Overview

This directory contains helper utilities and supporting contracts for the PeliFi protocol.

## Purpose

Helper contracts provide shared functionality used across the PeliFi ecosystem:

- **Calculations**: Yield calculations, APY conversions, etc.
- **Utilities**: Time helpers, format converters, etc.
- **Oracles**: Price feeds, APY data, etc.
- **Validation**: Input validation, safety checks, etc.

## Status

⚠️ **EMPTY** - No helpers implemented yet.

## Planned Helpers

| Helper | Description | Status | Priority |
|--------|-------------|--------|----------|
| **YieldCalculator** | Centralized yield calculation logic | Not Started | MEDIUM |
| **PriceOracle** | Price data for tokens/protocols | Not Started | LOW |
| **TimeUtils** | Time-related utility functions | Not Started | LOW |
| **Validation** | Input validation helpers | Not Started | LOW |

## Architecture

```
Helpers
    ↓
├── YieldCalculator (planned)
├── PriceOracle (planned)
├── TimeUtils (planned)
└── Validation (planned)
```

## Helper Details

### YieldCalculator (Planned)

Centralize yield calculation logic used across PeliFi:

```cadence
access(all) contract YieldCalculator {

    /// Calculate yield given principal, APR, and duration
    access(all) fun calculateYield(
        principal: UFix64,
        apr: UFix64,
        durationSeconds: UFix64
    ): UFix64 {
        let secondsPerYear: UFix64 = 31536000.0
        let years = durationSeconds / secondsPerYear
        return principal * apr * years
    }

    /// Calculate APY from APR (compounding)
    access(all) fun aprToApy(apr: UFix64, compoundFrequency: UInt64): UFix64 {
        // APY = (1 + APR/n)^n - 1
        // Where n = compound frequency per year
        let n = UFix64(compoundFrequency)
        let rate = apr / n
        let apy = pow(1.0 + rate, n) - 1.0
        return apy
    }

    /// Calculate duration in years from seconds
    access(all) fun secondsToYears(seconds: UFix64): UFix64 {
        return seconds / 31536000.0
    }
}
```

### PriceOracle (Planned)

Provide price data for tokens and protocols:

```cadence
access(all) contract PriceOracle {

    access(self) var prices: {String: UFix64}

    /// Get price of a token in USD
    access(all) fun getTokenPrice(tokenSymbol: String): UFix64 {
        return self.prices[tokenSymbol] ?? 0.0
    }

    /// Get current APY for a protocol
    access(all) fun getProtocolAPY(protocolName: String): UFix64 {
        // Return current APY from on-chain or oracle data
        return 0.08  // Default 8%
    }

    /// Update price (admin only)
    access(all) fun updatePrice(symbol: String, price: UFix64) {
        self.prices[symbol] = price
    }
}
```

### TimeUtils (Planned)

Time-related utility functions:

```cadence
access(all) contract TimeUtils {

    /// Get current timestamp
    access(all) fun now(): UFix64 {
        return getCurrentBlock().timestamp
    }

    /// Convert days to seconds
    access(all) fun daysToSeconds(days: UInt64): UFix64 {
        return UFix64(days * 86400)
    }

    /// Convert hours to seconds
    access(all) fun hoursToSeconds(hours: UInt64): UFix64 {
        return UFix64(hours * 3600)
    }

    /// Check if timestamp is in the past
    access(all) fun isPast(timestamp: UFix64): Bool {
        return timestamp < getCurrentBlock().timestamp
    }

    /// Get elapsed time since timestamp
    access(all) fun elapsedSince(timestamp: UFix64): UFix64 {
        return getCurrentBlock().timestamp - timestamp
    }
}
```

### Validation (Planned)

Input validation and safety checks:

```cadence
access(all) contract Validation {

    /// Validate pool capacity
    access(all) fun validateCapacity(capacity: UInt64): Bool {
        return capacity > 0 && capacity <= 10000
    }

    /// Validate deposit amount
    access(all) fun validateAmount(amount: UFix64): Bool {
        return amount > 0.0 && amount <= 1000000.0
    }

    /// Validate duration (must be reasonable)
    access(all) fun validateDuration(durationSeconds: UFix64): Bool {
        let minDuration: UFix64 = 3600.0  // 1 hour
        let maxDuration: UFix64 = 31536000.0  // 1 year
        return durationSeconds >= minDuration && durationSeconds <= maxDuration
    }

    /// Validate APY is within reasonable bounds
    access(all) fun validateAPY(apy: UFix64): Bool {
        return apy > 0.0 && apy <= 1.0  // Max 100%
    }
}
```

## Benefits of Helpers

### Code Reusability
- Write once, use everywhere
- Consistent calculations across protocol
- Easier to update logic

### Testing
- Test helpers independently
- Mock helpers for integration tests
- Better code coverage

### Gas Efficiency
- Shared logic = less duplicate code
- Optimized implementations
- Lower transaction costs

### Maintainability
- Single source of truth
- Easier to debug
- Clear separation of concerns

## Integration Example

### Using YieldCalculator in PeliFi

```cadence
import "YieldCalculator"

// In PeliFi.cdc
access(self) fun calculateYield(principal: UFix64, durationSeconds: UFix64): UFix64 {
    return YieldCalculator.calculateYield(
        principal: principal,
        apr: PeliFi.YIELD_APR,
        durationSeconds: durationSeconds
    )
}
```

### Using TimeUtils in Transactions

```cadence
import "TimeUtils"

transaction(poolDurationDays: UInt64) {
    prepare(account: auth(Storage) &Account) {
        let durationSeconds = TimeUtils.daysToSeconds(days: poolDurationDays)
        // Use duration in pool creation
    }
}
```

### Using Validation in CreatePool

```cadence
import "Validation"

access(all) fun createPool(
    capacity: UInt64,
    depositAmount: UFix64,
    activeDuration: UFix64
): UInt64 {
    pre {
        Validation.validateCapacity(capacity): "Invalid capacity"
        Validation.validateAmount(depositAmount): "Invalid amount"
        Validation.validateDuration(activeDuration): "Invalid duration"
    }

    // ... rest of createPool logic
}
```

## Testing Strategy

Each helper should have comprehensive tests:

```cadence
import Test
import "YieldCalculator"

access(all) fun testYieldCalculation() {
    // Test basic calculation
    let yield = YieldCalculator.calculateYield(
        principal: 100.0,
        apr: 0.07,
        durationSeconds: 31536000.0  // 1 year
    )

    Test.expect(yield, Test.equal(7.0))  // 100 * 0.07 * 1
}

access(all) fun testEdgeCases() {
    // Test zero duration
    let yield1 = YieldCalculator.calculateYield(
        principal: 100.0,
        apr: 0.07,
        durationSeconds: 0.0
    )
    Test.expect(yield1, Test.equal(0.0))

    // Test zero principal
    let yield2 = YieldCalculator.calculateYield(
        principal: 0.0,
        apr: 0.07,
        durationSeconds: 31536000.0
    )
    Test.expect(yield2, Test.equal(0.0))
}
```

## Implementation Priority

1. **YieldCalculator** - Extract current logic from PeliFi
2. **TimeUtils** - Simplify time-related operations
3. **Validation** - Improve input safety
4. **PriceOracle** - Support dynamic APY in future

## Migration Path

### Step 1: Create Helpers
- Deploy helper contracts
- Test thoroughly

### Step 2: Refactor PeliFi
- Replace inline calculations with helpers
- Ensure backward compatibility

### Step 3: Update Tests
- Use helper mocks where appropriate
- Test integration

### Step 4: Deploy
- Deploy updated PeliFi with helpers
- Monitor for issues

## References

- [Cadence Math Library](https://docs.onflow.org/cadence/language/numbers/)
- [Flow Utility Patterns](https://docs.onflow.org/smart-contracts/tutorial/03-first-transaction/)
- [PeliFi Core](../core/PeliFi.cdc)

---

**Last Updated**: 2026-03-31
**Status**: Design Phase
**Maintainer**: PeliFi Team
