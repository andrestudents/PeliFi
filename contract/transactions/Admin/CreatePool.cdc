/**
 * Create Pool Transaction
 *
 * Admin transaction to create a new lottery pool
 *
 * Parameters:
 * - name: Pool name
 * - capacity: Maximum number of users
 * - depositAmount: Fixed deposit per user (in FLOW)
 * - activeDuration: Duration for yield generation (in seconds)
 * - winnerCount: Number of winners to select
 *
 * Example:
 * - Weekly pool: capacity=100, depositAmount=100.0,
 *                activeDuration=604800 (7 days), winnerCount=5
 * - Monthly pool: capacity=100, depositAmount=100.0,
 *                 activeDuration=2592000 (30 days), winnerCount=10
 * - Yearly pool: capacity=100, depositAmount=100.0,
 *                activeDuration=31536000 (365 days), winnerCount=20
 */

import "PeliFi"

transaction(
    name: String,
    capacity: UInt64,
    depositAmount: UFix64,
    activeDuration: UFix64,
    winnerCount: UInt64
) {
    prepare(admin: auth(Storage, BorrowValue) &Account) {
        // Borrow admin resource
        let adminRef = admin.storage.borrow<
            &PeliFi.Admin
        >(
            from: /storage/PeliFiAdmin
        ) ?? panic("Could not borrow admin reference")

        // Create the pool
        let poolId = adminRef.createPool(
            name: name,
            capacity: capacity,
            depositAmount: depositAmount,
            activeDuration: activeDuration,
            winnerCount: winnerCount
        )

        log("Pool created successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Pool Name: ".concat(name))
        log("Capacity: ".concat(capacity.toString()))
        log("Deposit Amount: ".concat(depositAmount.toString()).concat(" FLOW"))
        log("Active Duration: ".concat(activeDuration.toString()).concat(" seconds"))
        log("Winner Count: ".concat(winnerCount.toString()))
    }

    execute {
        // No additional execute logic needed
    }
}
