/**
 * Claim Withdraw Transaction
 *
 * User transaction to claim funds from a completed or cancelled pool
 *
 * Distribution:
 * - Winners: Receive principal + yield share
 * - Losers: Receive principal only (no loss!)
 * - Cancelled pool: All users receive full principal
 *
 * Parameters:
 * - poolId: ID of the pool to claim from
 *
 * Requirements:
 * - Pool must be in COMPLETED or CANCELLED status
 * - User must have a position in the pool
 * - User must not have already claimed
 *
 * Note: Users can claim anytime after pool completes/cancels (no expiry)
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

        // Claim withdraw (returns vault with principal + yield or just principal)
        let vault <- PeliFi.claimWithdraw(
            poolId: poolId,
            user: user.address
        )

        log("Withdraw claimed successfully")
        log("Pool ID: ".concat(poolId.toString()))
        log("Principal returned: ".concat(userPosition.principal.toString()).concat(" FLOW"))

        let yieldAmount = userPosition.getYield()
        let totalReceived = userPosition.principal + yieldAmount

        if yieldAmount > 0.0 {
            log("Congratulations! You are a winner!")
            log("Yield received: ".concat(yieldAmount.toString()).concat(" FLOW"))
            log("Total received: ".concat(totalReceived.toString()).concat(" FLOW"))
        } else {
            log("You were not selected as a winner")
            log("Total received: ".concat(userPosition.principal.toString()).concat(" FLOW"))
            log("No loss - your principal is returned!")
        }

        // Deposit the vault using LOAD+SAVE method
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
