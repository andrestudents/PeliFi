/**
 * Distribute Yield Transaction
 *
 * Admin transaction to distribute yield to winners
 * Called after pool duration completes
 *
 * Process:
 * 1. Calculate total yield (7% APY)
 * 2. Deduct 1% admin fee
 * 3. Select winners using provably fair random selection
 * 4. Distribute yield to winners
 * 5. Prepare pool for user withdrawals
 *
 * Parameters:
 * - poolId: ID of the pool
 * - randomSeed: Random seed array for winner selection
 *   - Can use block hash, oracle, or any entropy source
 *   - Example: [1, 2, 3, 4, 5, 6, 7, 8]
 *
 * Note: Winners can then claim principal + yield, losers claim principal only
 */

import PeliFi from 0xf8d6e0586b0a20c7
import PeliFiTypes from 0xf8d6e0586b0a20c7

transaction(
    poolId: UInt64,
    randomSeed: [UInt8]
) {
    prepare(admin: auth(Storage, BorrowValue) &Account) {
        // Borrow admin resource
        let adminRef = admin.storage.borrow<
            &PeliFi.Admin
        >(
            from: /storage/PeliFiAdmin
        ) ?? panic("Could not borrow admin reference")

        // Check pool exists and is active
        let poolDetails = PeliFi.getPoolDetails(poolId: poolId) ?? panic("Pool does not exist")

        if poolDetails.status != PeliFiTypes.STATUS_ACTIVE {
            panic("Pool must be in ACTIVE status to distribute yield")
        }

        // Distribute yield
        adminRef.distributeYield(
            poolId: poolId,
            randomSeed: randomSeed
        )

        log("Yield distributed successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Status: COMPLETED")
        log("Users can now claim their funds")
    }

    execute {
        // No additional execute logic needed
    }
}
