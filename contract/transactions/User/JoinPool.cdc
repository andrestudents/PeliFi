/**
 * Join Pool Transaction
 *
 * User transaction to join a lottery pool by depositing FLOW
 *
 * Requirements:
 * - Pool must be in OPEN status
 * - Pool must not be at capacity
 * - User must not already be in the pool
 * - Deposit amount must match pool requirement exactly
 *
 * Parameters:
 * - poolId: ID of the pool to join
 * - amount: Amount of FLOW to deposit (must match pool's depositAmount)
 *
 * Example:
 * - Pool requires 100 FLOW deposit
 * - User sends transaction with amount=100.0
 *
 * Note: Funds are locked until pool completes or is cancelled
 */

import "PeliFi"  
import "PeliFiTypes"  
import "FlowToken"  

transaction(
    poolId: UInt64,
    amount: UFix64
) {
    prepare(user: auth(Storage) &Account) {
        // Check if user can join the pool
        let canJoin = PeliFi.canUserJoinPool(
            poolId: poolId,
            user: user.address
        )

        if !canJoin {
            // Get pool details for error message
            let poolDetails = PeliFi.getPoolDetails(poolId: poolId)

            if poolDetails == nil {
                panic("Pool does not exist")
            }

            let details = poolDetails!

            if details.status != PeliFiTypes.STATUS_OPEN {
                panic("Pool is not open for joining")
            }

            if details.currentUserCount >= details.capacity {
                panic("Pool has reached maximum capacity")
            }

            // Check if user already in pool
            let userPosition = PeliFi.getUserPosition(
                poolId: poolId,
                user: user.address
            )

            if userPosition != nil {
                panic("User is already in this pool")
            }
        }

        // Verify amount matches pool requirement
        let poolDetails = PeliFi.getPoolDetails(poolId: poolId)!
        if amount != poolDetails.depositAmount {
            panic("Deposit amount must match pool requirement exactly")
        }

        // LOAD vault with full ownership (not borrow!)
        // This gives us full entitlement without needing interface auth specs
        let tempVault <- user.storage.load<@FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("FLOW vault not found")

        // Withdraw from owned vault (full entitlement, no interface needed!)
        let paymentVault <- tempVault.withdraw(amount: amount) as! @FlowToken.Vault

        // Save remaining vault back to storage
        user.storage.save(<-tempVault, to: /storage/flowTokenVault)

        // Join the pool
        PeliFi.joinPool(
            poolId: poolId,
            user: user.address,
            vault: <-paymentVault
        )

        log("Successfully joined pool")
        log("Pool ID: ".concat(poolId.toString()))
        log("Pool Name: ".concat(poolDetails.name))
        log("Deposited: ".concat(amount.toString()).concat(" FLOW"))
        log("Your position: ".concat((poolDetails.currentUserCount + 1).toString()).concat("/".concat(poolDetails.capacity.toString())))
    }

    execute {
        // No additional execute logic needed
    }
}
