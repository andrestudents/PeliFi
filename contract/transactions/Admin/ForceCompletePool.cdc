/**
 * Force Complete Pool Transaction
 *
 * Admin transaction to force complete a pool before its duration ends
 *
 * Use cases:
 * - Emergency situations
 * - Protocol upgrades
 * - User consensus/voting
 * - Early termination decision
 *
 * Parameters:
 * - poolId: ID of the pool to force complete
 * - randomSeed: Random seed array for winner selection
 *   - Can use block hash, oracle, or any entropy source
 *
 * Note: This will immediately distribute yield and allow users to withdraw
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
            panic("Pool must be in ACTIVE status to force complete")
        }

        // Force complete the pool
        adminRef.forceCompletePool(
            poolId: poolId,
            randomSeed: randomSeed
        )

        log("Pool force completed successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Status: COMPLETED")
        log("Users can now claim their funds")
    }

    execute {
        // No additional execute logic needed
    }
}
