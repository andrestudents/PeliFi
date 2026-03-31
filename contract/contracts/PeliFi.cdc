/**
 * PeliFi - Permissionless Lottery Finance Protocol
 *
 * Main contract that manages all pools and resources
 *
 * Features:
 * - User can early exit during OPEN period (no penalty)
 * - Fund locked during ACTIVE period
 * - Auto-activate when capacity is full
 * - Simple parameters (no maxWaitTime)
 */

import "PeliFiTypes"
import "FlowToken"  

access(all) contract PeliFi {

    // ===== STATE =====

    access(all) var nextPoolId: UInt64

    // ===== STORAGE PATHS =====

    access(all) let AdminStoragePath: StoragePath

    // ===== CONSTANTS =====

    access(all) let YIELD_APR: UFix64
    access(all) let ADMIN_FEE_PERCENTAGE: UFix64
    access(all) let MIN_YIELD_THRESHOLD: UFix64

    // ===== EVENTS =====

    access(all) event ContractInitialized()
    access(all) event PoolCreated(
        poolId: UInt64,
        name: String,
        capacity: UInt64,
        depositAmount: UFix64,
        activeDuration: UFix64,
        winnerCount: UInt64,
        createdAt: UFix64
    )
    access(all) event UserJoined(
        poolId: UInt64,
        user: Address,
        amount: UFix64,
        currentUserCount: UInt64,
        timestamp: UFix64
    )
    access(all) event PoolActivated(
        poolId: UInt64,
        activatedAt: UFix64,
        totalUsers: UInt64,
        totalPrincipal: UFix64
    )
    access(all) event UserEarlyExited(
        poolId: UInt64,
        user: Address,
        refundedAmount: UFix64,
        timestamp: UFix64
    )
    access(all) event PoolCancelled(
        poolId: UInt64,
        cancelledAt: UFix64,
        reason: String,
        totalUsers: UInt64
    )
    access(all) event PoolCompleted(
        poolId: UInt64,
        completedAt: UFix64,
        totalUsers: UInt64,
        totalPrincipal: UFix64,
        totalYield: UFix64
    )
    access(all) event YieldDistributed(
        poolId: UInt64,
        winnerCount: UInt64,
        totalYield: UFix64,
        adminFee: UFix64,
        yieldPerWinner: UFix64,
        winners: [Address]
    )
    access(all) event WithdrawClaimed(
        poolId: UInt64,
        user: Address,
        principal: UFix64,
        yield: UFix64,
        claimedAt: UFix64
    )

    // ===== RESOURCE: Pool =====

    access(all) resource Pool {

        // Config
        access(all) let poolId: UInt64
        access(all) let name: String
        access(all) let capacity: UInt64
        access(all) let depositAmount: UFix64
        access(self) var activeDuration: UFix64
        access(all) let winnerCount: UInt64

        // State
        access(all) var status: UInt8
        access(all) let createdAt: UFix64
        access(all) var activatedAt: UFix64?
        access(all) var completedAt: UFix64?
        access(all) var cancellationReason: String?

        // Users & Funds
        access(self) var users: {Address: PeliFiTypes.UserPosition}
        access(self) var vault: @FlowToken.Vault

        init(
            poolId: UInt64,
            name: String,
            capacity: UInt64,
            depositAmount: UFix64,
            activeDuration: UFix64,
            winnerCount: UInt64,
            createdAt: UFix64
        ) {
            self.poolId = poolId
            self.name = name
            self.capacity = capacity
            self.depositAmount = depositAmount
            self.activeDuration = activeDuration
            self.winnerCount = winnerCount
            self.status = PeliFiTypes.STATUS_OPEN
            self.createdAt = createdAt
            self.activatedAt = nil
            self.completedAt = nil
            self.cancellationReason = nil
            self.users = {}
            self.vault <- FlowToken.createEmptyVault(
                vaultType: Type<@FlowToken.Vault>()
            ) as! @FlowToken.Vault
        }

        /// Add user to pool
        access(all) fun addUser(user: Address, vault: @FlowToken.Vault) {
            pre {
                self.status == PeliFiTypes.STATUS_OPEN:
                    "Pool is not open"
                UInt64(self.users.keys.length) <= self.capacity:
                    "Pool is at capacity"
                !self.users.containsKey(user):
                    "User already in pool"
                vault.balance == self.depositAmount:
                    "Incorrect deposit amount"
            }

            let amount = vault.balance
            self.vault.deposit(from: <-vault)

            let position = PeliFiTypes.UserPosition(
                user: user,
                principal: amount,
                entryTime: getCurrentBlock().timestamp
            )
            self.users[user] = position

            // Auto-activate if full
            if UInt64(self.users.keys.length) == self.capacity {
                self.activatePool()
            }
        }

        /// Activate pool (internal)
        access(self) fun activatePool() {
            pre {
                self.status == PeliFiTypes.STATUS_OPEN:
                    "Pool is not open"
            }

            self.status = PeliFiTypes.STATUS_ACTIVE
            self.activatedAt = getCurrentBlock().timestamp
        }

        /// Early exit - withdraw before pool is full
        access(all) fun earlyExit(user: Address): @FlowToken.Vault {
            pre {
                self.status == PeliFiTypes.STATUS_OPEN:
                    "Early exit only allowed during OPEN period"
                self.users.containsKey(user):
                    "User not found in pool"
            }

            let position = self.users[user]!
            let refundAmount = position.principal

            // Remove user from pool (struct auto-cleaned)
            self.users.remove(key: user)

            // Return principal (no penalty)
            let vault <- self.vault.withdraw(amount: refundAmount)

            emit PeliFi.UserEarlyExited(
                poolId: self.poolId,
                user: user,
                refundedAmount: refundAmount,
                timestamp: getCurrentBlock().timestamp
            )

            return <-(vault as! @FlowToken.Vault)
        }

        /// Cancel pool
        access(all) fun cancelPool(reason: String) {
            pre {
                self.status == PeliFiTypes.STATUS_OPEN:
                    "Pool is not open"
            }

            self.status = PeliFiTypes.STATUS_CANCELLED
            self.completedAt = getCurrentBlock().timestamp
            self.cancellationReason = reason
        }

        /// Distribute yield to winners
        access(all) fun distributeYield(randomSeed: [UInt8]) {
            pre {
                self.status == PeliFiTypes.STATUS_ACTIVE:
                    "Pool is not active"
                self.activatedAt != nil:
                    "Pool was never activated"
            }

            let currentTime = getCurrentBlock().timestamp
            let elapsedTime = currentTime - self.activatedAt!

            if elapsedTime < self.activeDuration {
                panic("Duration not completed")
            }

            // Calculate yield
            var totalPrincipal: UFix64 = 0.0
            for position in self.users.values {
                totalPrincipal = totalPrincipal + position.principal
            }

            let totalYield = self.calculateYield(
                principal: totalPrincipal,
                durationSeconds: elapsedTime
            )

            let adminFee = totalYield * PeliFi.ADMIN_FEE_PERCENTAGE
            let yieldForWinners = totalYield - adminFee

            // Select winners
            let winners = self.selectWinners(randomSeed: randomSeed)
            let yieldPerWinner = yieldForWinners / UFix64(UInt64(winners.length))

            // Distribute yield
            if yieldPerWinner < PeliFi.MIN_YIELD_THRESHOLD {
                for winner in winners {
                    let pos = self.users[winner]
                    if let p = pos {
                        p.setAsWinner(yield: 0.0)
                        self.users[winner] = p
                    }
                }
            } else {
                for winner in winners {
                    let pos = self.users[winner]
                    if let p = pos {
                        p.setAsWinner(yield: yieldPerWinner)
                        self.users[winner] = p
                    }
                }
            }

            self.status = PeliFiTypes.STATUS_COMPLETED
            self.completedAt = currentTime
        }

        /// Claim withdraw
        access(all) fun claimWithdraw(user: Address): @FlowToken.Vault {
            pre {
                self.status == PeliFiTypes.STATUS_COMPLETED ||
                self.status == PeliFiTypes.STATUS_CANCELLED:
                    "Pool is not completed or cancelled"
                self.users.containsKey(user):
                    "User not found in pool"
            }

            let posOpt = self.users[user]
            if let position = posOpt {
                let claimAmount = position.principal + position.getYield()
                position.markAsClaimed()
                self.users[user] = position

                let vault <- self.vault.withdraw(amount: claimAmount)
                return <-(vault as! @FlowToken.Vault)
            }

            panic("User not found")
        }

        /// Extend pool duration
        access(all) fun extendTime(newDuration: UFix64) {
            pre {
                self.status == PeliFiTypes.STATUS_ACTIVE:
                    "Pool is not active"
                newDuration > self.activeDuration:
                    "New duration must be greater"
            }

            self.activeDuration = newDuration
        }

        /// Force complete pool
        access(all) fun forceComplete(randomSeed: [UInt8]) {
            pre {
                self.status == PeliFiTypes.STATUS_ACTIVE:
                    "Pool is not active"
            }
            self.distributeYield(randomSeed: randomSeed)
        }

        /// Calculate yield
        access(self) fun calculateYield(principal: UFix64, durationSeconds: UFix64): UFix64 {
            let secondsPerYear: UFix64 = 31536000.0
            let years = durationSeconds / secondsPerYear
            return principal * PeliFi.YIELD_APR * years
        }

        /// Select winners using Fisher-Yates shuffle
        access(self) fun selectWinners(randomSeed: [UInt8]): [Address] {
            var seed: UInt64 = 0
            for byte in randomSeed {
                seed = UInt64(byte) + (seed * 256)
            }
            seed = seed + self.poolId

            var shuffled: [Address] = []
            for address in self.users.keys {
                shuffled.append(address)
            }

            let n = UInt64(shuffled.length)
            var i: UInt64 = 0
            while i < n {
                let tempValue = seed % (n - i)
                let j = Int(tempValue)
                let temp = shuffled[i]
                shuffled[i] = shuffled[j]
                shuffled[j] = temp
                i = i + 1
            }

            var winners: [Address] = []
            var count: UInt64 = 0
            while count < self.winnerCount && count < UInt64(shuffled.length) {
                winners.append(shuffled[count])
                count = count + 1
            }

            return winners
        }

        /// Get pool details
        access(all) fun getDetails(): PeliFiTypes.PoolDetails {
            var totalPrincipal: UFix64 = 0.0
            for position in self.users.values {
                totalPrincipal = totalPrincipal + position.principal
            }

            return PeliFiTypes.PoolDetails(
                poolId: self.poolId,
                name: self.name,
                capacity: self.capacity,
                depositAmount: self.depositAmount,
                activeDuration: self.activeDuration,
                winnerCount: self.winnerCount,
                status: self.status,
                currentUserCount: UInt64(self.users.keys.length),
                totalPrincipal: totalPrincipal,
                createdAt: self.createdAt,
                activatedAt: self.activatedAt,
                completedAt: self.completedAt,
                yieldAPR: PeliFi.YIELD_APR,
                adminFeePercentage: PeliFi.ADMIN_FEE_PERCENTAGE
            )
        }

        /// Get user position
        access(all) fun getUserPosition(user: Address): PeliFiTypes.UserPosition? {
            return self.users[user]
        }

        /// Check if has user
        access(all) fun hasUser(user: Address): Bool {
            return self.users.containsKey(user)
        }

        /// Get user count
        access(all) fun getUserCount(): UInt64 {
            return UInt64(self.users.keys.length)
        }
    }

    // ===== STATE: Pools =====

    access(self) var pools: @{UInt64: Pool}

    // ===== RESOURCE: Admin =====

    access(all) resource Admin {

        /// Create new pool
        access(all) fun createPool(
            name: String,
            capacity: UInt64,
            depositAmount: UFix64,
            activeDuration: UFix64,
            winnerCount: UInt64
        ): UInt64 {
            pre {
                capacity > 0:
                    "Capacity must be greater than 0"
                depositAmount > 0.0:
                    "Deposit amount must be greater than 0"
                activeDuration > 0.0:
                    "Active duration must be greater than 0"
                winnerCount > 0:
                    "Winner count must be greater than 0"
                winnerCount <= capacity:
                    "Winner count cannot exceed capacity"
            }

            let poolId = PeliFi.nextPoolId
            PeliFi.nextPoolId = PeliFi.nextPoolId + 1

            let currentTime = getCurrentBlock().timestamp

            let newPool <- create Pool(
                poolId: poolId,
                name: name,
                capacity: capacity,
                depositAmount: depositAmount,
                activeDuration: activeDuration,
                winnerCount: winnerCount,
                createdAt: currentTime
            )

            PeliFi.pools[poolId] <-! newPool

            emit PeliFi.PoolCreated(
                poolId: poolId,
                name: name,
                capacity: capacity,
                depositAmount: depositAmount,
                activeDuration: activeDuration,
                winnerCount: winnerCount,
                createdAt: currentTime
            )

            return poolId
        }

        /// Cancel pool
        access(all) fun cancelPool(poolId: UInt64, reason: String) {
            pre {
                PeliFi.pools.containsKey(poolId):
                    "Pool not found"
            }

            let pool = &PeliFi.pools[poolId] as &Pool?
            if let p = pool {
                p.cancelPool(reason: reason)

                emit PeliFi.PoolCancelled(
                    poolId: poolId,
                    cancelledAt: getCurrentBlock().timestamp,
                    reason: reason,
                    totalUsers: p.getUserCount()
                )
            }
        }

        /// Distribute yield
        access(all) fun distributeYield(poolId: UInt64, randomSeed: [UInt8]) {
            pre {
                PeliFi.pools.containsKey(poolId):
                    "Pool not found"
            }

            let pool = &PeliFi.pools[poolId] as &Pool?
            if let p = pool {
                p.distributeYield(randomSeed: randomSeed)

                let details = p.getDetails()
                emit PeliFi.PoolCompleted(
                    poolId: poolId,
                    completedAt: details.completedAt!,
                    totalUsers: details.currentUserCount,
                    totalPrincipal: details.totalPrincipal,
                    totalYield: 0.0
                )
            }
        }

        /// Extend pool time
        access(all) fun extendPoolTime(poolId: UInt64, newDuration: UFix64) {
            pre {
                PeliFi.pools.containsKey(poolId):
                    "Pool not found"
            }

            let pool = &PeliFi.pools[poolId] as &Pool?
            if let p = pool {
                p.extendTime(newDuration: newDuration)
            }
        }

        /// Force complete pool
        access(all) fun forceCompletePool(poolId: UInt64, randomSeed: [UInt8]) {
            pre {
                PeliFi.pools.containsKey(poolId):
                    "Pool not found"
            }

            let pool = &PeliFi.pools[poolId] as &Pool?
            if let p = pool {
                p.forceComplete(randomSeed: randomSeed)

                let details = p.getDetails()
                emit PeliFi.PoolCompleted(
                    poolId: poolId,
                    completedAt: details.completedAt!,
                    totalUsers: details.currentUserCount,
                    totalPrincipal: details.totalPrincipal,
                    totalYield: 0.0
                )
            }
        }
    }

    // ===== INITIALIZER =====

    init() {
        self.nextPoolId = 1
        self.AdminStoragePath = /storage/PeliFiAdmin
        self.pools <- {}

        // Constants
        self.YIELD_APR = 0.07
        self.ADMIN_FEE_PERCENTAGE = 0.01
        self.MIN_YIELD_THRESHOLD = 0.01

        // Create and save admin resource
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)

        emit ContractInitialized()
    }

    // ===============================================================================
    // Public Functions
    // ===============================================================================

    /// Join pool (user operation)
    access(all) fun joinPool(poolId: UInt64, user: Address, vault: @FlowToken.Vault) {
        pre {
            self.pools.containsKey(poolId):
                "Pool not found"
        }

        let pool = &self.pools[poolId] as &Pool?
            ?? panic("Pool not found")

        let amount = vault.balance

        pool.addUser(user: user, vault: <-vault)

        let details = pool.getDetails()
        emit UserJoined(
            poolId: poolId,
            user: user,
            amount: amount,
            currentUserCount: details.currentUserCount,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Early exit - user can withdraw during OPEN period
    access(all) fun earlyExit(poolId: UInt64, user: Address): @FlowToken.Vault {
        pre {
            self.pools.containsKey(poolId):
                "Pool not found"
        }

        let pool = &self.pools[poolId] as &Pool?
            ?? panic("Pool not found")

        let vault <- pool.earlyExit(user: user)

        // Emit event sudah di dalam pool
        return <-vault
    }

    /// Claim withdraw (user operation)
    access(all) fun claimWithdraw(poolId: UInt64, user: Address): @FlowToken.Vault {
        pre {
            self.pools.containsKey(poolId):
                "Pool not found"
        }

        let pool = &self.pools[poolId] as &Pool?
            ?? panic("Pool not found")

        let position = pool.getUserPosition(user: user)
        if position == nil {
            panic("User not found in pool")
        }

        let vault <- pool.claimWithdraw(user: user)

        emit WithdrawClaimed(
            poolId: poolId,
            user: user,
            principal: position!.principal,
            yield: position!.getYield(),
            claimedAt: getCurrentBlock().timestamp
        )

        return <-vault
    }

    // ===============================================================================
    // Public View Functions
    // ===============================================================================

    access(all) fun getPoolDetails(poolId: UInt64): PeliFiTypes.PoolDetails? {
        let pool = &self.pools[poolId] as &Pool?
        if pool == nil {
            return nil
        }

        return pool!.getDetails()
    }

    access(all) fun getUserPosition(
        poolId: UInt64,
        user: Address
    ): PeliFiTypes.UserPosition? {
        let pool = &self.pools[poolId] as &Pool?
        if pool == nil {
            return nil
        }

        return pool!.getUserPosition(user: user)
    }

    access(all) fun getAllPoolIds(): [UInt64] {
        return self.pools.keys
    }

    access(all) fun getPoolsByStatus(status: UInt8): [UInt64] {
        var result: [UInt64] = []
        for poolId in self.pools.keys {
            let pool = &self.pools[poolId] as &Pool?
            if let p = pool {
                let details = p.getDetails()
                if details.status == status {
                    result.append(poolId)
                }
            }
        }
        return result
    }

    access(all) fun canUserJoinPool(poolId: UInt64, user: Address): Bool {
        let pool = &self.pools[poolId] as &Pool?
        if pool == nil {
            return false
        }

        let p = pool!
        if p.getDetails().status != PeliFiTypes.STATUS_OPEN {
            return false
        }
        if p.hasUser(user: user) {
            return false
        }
        if p.getUserCount() >= p.getDetails().capacity {
            return false
        }
        return true
    }

    access(all) fun getUserAllPoolIds(user: Address): [UInt64] {
        var result: [UInt64] = []
        for poolId in self.pools.keys {
            let pool = &self.pools[poolId] as &Pool?
            if let p = pool {
                let position = p.getUserPosition(user: user)
                if position != nil {
                    result.append(poolId)
                }
            }
        }
        return result
    }

    access(all) fun poolExists(poolId: UInt64): Bool {
        return self.pools.containsKey(poolId)
    }

    access(all) fun getTotalPoolCount(): UInt64 {
        return UInt64(self.pools.keys.length)
    }
}
