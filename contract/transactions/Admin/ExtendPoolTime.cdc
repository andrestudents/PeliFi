/**
 * Extend Pool Time Transaction
 *
 * Admin transaction to extend the duration of an active pool
 *
 * Use cases:
 * - Market conditions require longer yield generation
 * - Admin decides to give users more time
 * - Special events or promotions
 *
 * Parameters:
 * - poolId: ID of the pool
 * - newDuration: New total duration (must be longer than current)
 *   - Example: If pool was 7 days (604800 seconds), extend to 14 days (1209600 seconds)
 *
 * Note: This extends the active duration, not the wait time
 */

import "PeliFi"  
import "PeliFiTypes"  

transaction(
    poolId: UInt64,
    newDuration: UFix64
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
            panic("Pool must be in ACTIVE status to extend time")
        }

        if newDuration <= poolDetails.activeDuration {
            panic("New duration must be longer than current duration")
        }

        // Extend pool time
        adminRef.extendPoolTime(
            poolId: poolId,
            newDuration: newDuration
        )

        log("Pool time extended successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Previous Duration: ".concat(poolDetails.activeDuration.toString()).concat(" seconds"))
        log("New Duration: ".concat(newDuration.toString()).concat(" seconds"))
    }

    execute {
        // No additional execute logic needed
    }
}
