/**
 * PeliFi Types
 *
 * Defines all types, structs, and events used in PeliFi protocol
 */

access(all) contract PeliFiTypes {

    /// Pool Status Constants (using UInt8 instead of enum)
    /// Pool is open for users to join
    access(all) let STATUS_OPEN: UInt8

    /// Pool is active and generating yield
    access(all) let STATUS_ACTIVE: UInt8

    /// Pool has completed and yield has been distributed
    access(all) let STATUS_COMPLETED: UInt8

    /// Pool was cancelled
    access(all) let STATUS_CANCELLED: UInt8

    /// User Position Struct
    access(all) struct UserPosition {
        access(all) let user: Address
        access(all) let principal: UFix64
        access(all) let entryTime: UFix64
        access(self) var isWinner: Bool
        access(self) var yieldAmount: UFix64
        access(self) var claimed: Bool

        init(
            user: Address,
            principal: UFix64,
            entryTime: UFix64
        ) {
            self.user = user
            self.principal = principal
            self.entryTime = entryTime
            self.isWinner = false
            self.yieldAmount = 0.0
            self.claimed = false
        }

        /// Set as winner with yield amount
        access(all) fun setAsWinner(yield: UFix64) {
            self.isWinner = true
            self.yieldAmount = yield
        }

        /// Mark as claimed
        access(all) fun markAsClaimed() {
            self.claimed = true
        }

        /// Get yield amount
        access(all) fun getYield(): UFix64 {
            return self.yieldAmount
        }
    }

    /// Pool Details Struct
    access(all) struct PoolDetails {
        access(all) let poolId: UInt64
        access(all) let name: String
        access(all) let capacity: UInt64
        access(all) let depositAmount: UFix64
        access(all) let activeDuration: UFix64
        access(all) let winnerCount: UInt64
        access(all) let status: UInt8
        access(all) let currentUserCount: UInt64
        access(all) let totalPrincipal: UFix64
        access(all) let createdAt: UFix64
        access(all) let activatedAt: UFix64?
        access(all) let completedAt: UFix64?
        access(all) let yieldAPR: UFix64
        access(all) let adminFeePercentage: UFix64

        init(
            poolId: UInt64,
            name: String,
            capacity: UInt64,
            depositAmount: UFix64,
            activeDuration: UFix64,
            winnerCount: UInt64,
            status: UInt8,
            currentUserCount: UInt64,
            totalPrincipal: UFix64,
            createdAt: UFix64,
            activatedAt: UFix64?,
            completedAt: UFix64?,
            yieldAPR: UFix64,
            adminFeePercentage: UFix64
        ) {
            self.poolId = poolId
            self.name = name
            self.capacity = capacity
            self.depositAmount = depositAmount
            self.activeDuration = activeDuration
            self.winnerCount = winnerCount
            self.status = status
            self.currentUserCount = currentUserCount
            self.totalPrincipal = totalPrincipal
            self.createdAt = createdAt
            self.activatedAt = activatedAt
            self.completedAt = completedAt
            self.yieldAPR = yieldAPR
            self.adminFeePercentage = adminFeePercentage
        }
    }

    /// Events
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

    access(all) event PoolExtended(
        poolId: UInt64,
        previousDuration: UFix64,
        newDuration: UFix64,
        extendedAt: UFix64
    )

    access(all) event RefundProcessed(
        poolId: UInt64,
        user: Address,
        refundedAmount: UFix64,
        refundedAt: UFix64
    )

    /// Initialize constants
    init() {
        self.STATUS_OPEN = 0
        self.STATUS_ACTIVE = 1
        self.STATUS_COMPLETED = 2
        self.STATUS_CANCELLED = 3
    }
}
