/**
 * Get Pool Details Script
 *
 * Read-only script to get detailed information about a pool
 *
 * Parameters:
 * - poolId: ID of the pool to query
 *
 * Returns: PoolDetails struct with:
 * - poolId, name, capacity, depositAmount
 * - activeDuration, winnerCount
 * - status, currentUserCount, totalPrincipal
 * - createdAt, activatedAt, completedAt
 * - yieldAPR, adminFeePercentage
 *
 * Use cases:
 * - Frontend display of pool information
 * - Checking pool status before joining
 * - Monitoring pool progress
 */

import "PeliFi" 
import "PeliFiTypes"

access(all)
fun main(poolId: UInt64): PeliFiTypes.PoolDetails? {
    return PeliFi.getPoolDetails(poolId: poolId)
}

/*
Example usage:

flow scripts execute cadence/scripts/GetPoolDetails.cdc \
  --arg UInt64:1

Output example:
{
  "poolId": 1,
  "name": "Weekly Pool A",
  "capacity": 100,
  "depositAmount": "100.00000000",
  "activeDuration": "604800.00000000",
  "winnerCount": 5,
  "status": 0,  // 0=OPEN, 1=ACTIVE, 2=COMPLETED, 3=CANCELLED
  "currentUserCount": 45,
  "totalPrincipal": "4500.00000000",
  "createdAt": "1234567890.00000000",
  "activatedAt": null,
  "completedAt": null,
  "yieldAPR": "0.07000000",
  "adminFeePercentage": "0.01000000"
}
*/
