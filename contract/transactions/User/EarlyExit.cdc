/**
 * Early Exit Transaction
 *
 * User transaction to withdraw from a pool during OPEN period
 * This allows users to change their mind before pool activates
 *
 * Benefits:
 * - No penalty - full refund of principal
 * - Available anytime during OPEN period (before pool is full)
 * - Useful if user changes mind or needs funds elsewhere
 *
 * Requirements:
 * - Pool must be in OPEN status (not ACTIVE, COMPLETED, or CANCELLED)
 * - User must have a position in the pool
 *
 * Parameters:
 * - poolId: ID of the pool to exit from
 *
 * Note: Once pool is ACTIVE, early exit is no longer possible
 */

import "PeliFi"  
import "PeliFiTypes"  
import "FlowToken"  

transaction(
    poolId: UInt64
) {
    prepare(user: auth(Storage) &Account) {
        // Get user's position in the pool
        let userPosition = PeliFi.getUserPosition(
            poolId: poolId,
            user: user.address
        ) ?? panic("You don't have a position in this pool")

        // Get pool details
        let poolDetails = PeliFi.getPoolDetails(poolId: poolId) ?? panic("Pool does not exist")

        // Check if pool is still in OPEN status
        if poolDetails.status != PeliFiTypes.STATUS_OPEN {
            panic("Early exit is only allowed during OPEN period. Pool is already active or completed.")
        }

        // Early exit (returns vault with full principal, no penalty)
        let vault <- PeliFi.earlyExit(
            poolId: poolId,
            user: user.address
        )

        log("Early exit successful")
        log("Pool ID: ".concat(poolId.toString()))
        log("Pool Name: ".concat(poolDetails.name))
        log("Refund Amount: ".concat(userPosition.principal.toString()).concat(" FLOW"))
        log("No penalty applied - full principal returned!")

        // Deposit the vault back using LOAD+SAVE method
        let tempVault <- user.storage.load<@FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("FLOW vault not found")

        tempVault.deposit(from: <-vault)

        user.storage.save(<-tempVault, to: /storage/flowTokenVault)
    }

    execute {
        // No additional execute logic needed
    }
}
