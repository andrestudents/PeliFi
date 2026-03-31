/**
 * Cancel Pool Transaction
 *
 * Admin transaction to cancel a pool
 * This triggers automatic refund of all user deposits
 *
 * Use cases:
 * - Pool didn't reach capacity within maxWaitTime (auto-cancel)
 * - Admin decides to manually cancel a pool
 *
 * Parameters:
 * - poolId: ID of the pool to cancel
 * - reason: Reason for cancellation (will be emitted in event)
 *
 * Note: After cancellation, users can claim their full principal back
 */

import PeliFi from 0xf8d6e0586b0a20c7

transaction(
    poolId: UInt64,
    reason: String
) {
    prepare(admin: auth(Storage, BorrowValue) &Account) {
        // Borrow admin resource
        let adminRef = admin.storage.borrow<
            &PeliFi.Admin
        >(
            from: /storage/PeliFiAdmin
        ) ?? panic("Could not borrow admin reference")

        // Cancel the pool
        adminRef.cancelPool(
            poolId: poolId,
            reason: reason
        )

        log("Pool cancelled successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Reason: ".concat(reason))
    }

    execute {
        // No additional execute logic needed
    }
}
