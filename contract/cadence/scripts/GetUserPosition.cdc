/**
 * Get User Position Script
 *
 * Read-only script to get a user's position in a specific pool
 *
 * Parameters:
 * - poolId: ID of the pool
 * - user: User's address
 *
 * Returns: UserPosition struct with:
 * - user: User's address
 * - principal: Amount deposited (in FLOW)
 * - entryTime: Timestamp when user joined
 * - isWinner: Whether user is a winner
 * - yieldAmount: Yield allocated (if winner)
 * - claimed: Whether user has claimed withdraw
 *
 * Use cases:
 * - Frontend display of user's positions
 * - Checking if user has claimed
 * - Showing potential winnings
 */

import PeliFi from 0xf8d6e0586b0a20c7
import PeliFiTypes from 0xf8d6e0586b0a20c7

access(all)
fun main(poolId: UInt64, user: Address): PeliFiTypes.UserPosition? {
    return PeliFi.getUserPosition(
        poolId: poolId,
        user: user
    )
}

/*
Example usage:

flow scripts execute cadence/scripts/GetUserPosition.cdc \
  --arg UInt64:1 \
  --arg Address:0x1234567890abcdef

Output example (user in pool, not completed yet):
{
  "user": "0x1234567890abcdef",
  "principal": "100.00000000",
  "entryTime": "1234567900.00000000",
  "isWinner": false,
  "yieldAmount": "0.00000000",
  "claimed": false
}

Output example (winner, completed pool):
{
  "user": "0x1234567890abcdef",
  "principal": "100.00000000",
  "entryTime": "1234567900.00000000",
  "isWinner": true,
  "yieldAmount": "2.65000000",
  "claimed": false
}

Output example (loser, completed pool):
{
  "user": "0x1234567890abcdef",
  "principal": "100.00000000",
  "entryTime": "1234567900.00000000",
  "isWinner": false,
  "yieldAmount": "0.00000000",
  "claimed": false
}

Output example (no position):
null
*/
