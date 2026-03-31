/**
 * Calculate Yield Script
 *
 * Read-only script to calculate potential yield for a pool
 *
 * Parameters:
 * - principal: Total principal amount (in FLOW)
 * - durationSeconds: Duration in seconds
 * - apr: Annual Percentage Rate (default 0.07 for 7%)
 *
 * Returns: Calculated yield amount
 *
 * Formula:
 * yield = principal × APR × (durationInSeconds / secondsPerYear)
 *
 * Use cases:
 * - Frontend display of expected yield
 * - Planning pool parameters
 * - Estimating user returns
 */

access(all)
fun main(
    principal: UFix64,
    durationSeconds: UFix64,
    apr: UFix64
): UFix64 {
    let secondsPerYear: UFix64 = 31536000.0  // 365 × 24 × 60 × 60
    let years = durationSeconds / secondsPerYear
    let yield = principal × apr × years
    return yield
}

/*
Example usage:

# 1 week pool (7 days = 604800 seconds)
flow scripts execute cadence/scripts/CalculateYield.cdc \
  --arg UFix64:10000.0 \
  --arg UFix64:604800.0 \
  --arg UFix64:0.07

Output: 13.42 FLOW

# 1 month pool (30 days = 2592000 seconds)
flow scripts execute cadence/scripts/CalculateYield.cdc \
  --arg UFix64:10000.0 \
  --arg UFix64:2592000.0 \
  --arg UFix64:0.07

Output: 57.53 FLOW

# 1 year pool (365 days = 31536000 seconds)
flow scripts execute cadence/scripts/CalculateYield.cdc \
  --arg UFix64:10000.0 \
  --arg UFix64:31536000.0 \
  --arg UFix64:0.07

Output: 700.00 FLOW


Example calculations for frontend:

For 100 users × 100 FLOW = 10,000 FLOW total principal:

Weekly (7 days):
- Total yield: 13.42 FLOW
- Admin fee (1%): 0.13 FLOW
- Yield for winners: 13.29 FLOW
- Per winner (5 winners): 2.66 FLOW
- Winner receives: 102.66 FLOW

Monthly (30 days):
- Total yield: 57.53 FLOW
- Admin fee (1%): 0.58 FLOW
- Yield for winners: 56.95 FLOW
- Per winner (10 winners): 5.70 FLOW
- Winner receives: 105.70 FLOW

Yearly (365 days):
- Total yield: 700.00 FLOW
- Admin fee (1%): 7.00 FLOW
- Yield for winners: 693.00 FLOW
- Per winner (20 winners): 34.65 FLOW
- Winner receives: 134.65 FLOW
*/
