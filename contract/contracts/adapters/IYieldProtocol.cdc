/**
 * IYieldProtocol - Interface for Yield Strategy Adapters
 *
 * This interface defines the contract for yield protocols that can be
 * integrated with PeliFi pools.
 *
 * ⚠️ STATUS: DESIGN DOCUMENT - NOT YET IMPLEMENTED
 *
 * Purpose:
 * - Enable PeliFi pools to use different yield strategies
 * - Support multiple yield protocols (staking, lending, LP, etc.)
 * - Allow easy addition of new protocols without modifying core PeliFi logic
 *
 * Future implementations:
 * - FlowStakingAdapter - For Flow network staking
 * - DefiLendingAdapter - For DeFi lending protocols
 * - LpAdapter - For liquidity pool strategies
 * - HybridAdapter - For multi-strategy approaches
 *
 * Integration Plan:
 * Phase 1: Interface definition (current)
 * Phase 2: Extract current logic to SimulatedYield adapter
 * Phase 3: Implement FlowStakingAdapter
 * Phase 4: Modify PeliFi.Pool to accept adapter address
 * Phase 5: Add adapter selection in createPool transaction
 *
 * @version 0.1.0 - Design Phase
 * @author PeliFi Team
 */

import "FlowToken"

access(all) contract interface IYieldProtocol {

    /// Deposit funds to yield protocol
    ///
    /// Called when user joins a pool or pool is activated
    ///
    /// @param vault: Vault containing FLOW tokens to deposit
    /// @return: Unique position ID for tracking this deposit
    access(all) fun deposit(vault: @FlowToken.Vault): String

    /// Withdraw funds from yield protocol
    ///
    /// Called when pool completes and yield needs to be distributed
    ///
    /// @param amount: Amount to withdraw (principal + yield)
    /// @param positionId: Position ID from deposit()
    /// @return: Vault containing withdrawn FLOW + yield
    access(all) fun withdraw(amount: UFix64, positionId: String): @FlowToken.Vault

    /// Get current APY (annual percentage yield)
    ///
    /// Returns the current annual percentage yield for this protocol
    /// Can be fixed or dynamic based on market conditions
    ///
    /// @return: Current APY as decimal (0.05 = 5%, 0.07 = 7%)
    access(all) fun getCurrentAPY(): UFix64

    /// Get total balance in protocol (principal + yield)
    ///
    /// Returns the current value of the position including any accrued yield
    ///
    /// @param positionId: Position ID from deposit()
    /// @return: Total balance (principal + yield)
    access(all) fun getBalance(positionId: String): UFix64

    /// Get human-readable protocol name
    ///
    /// Returns the name of this yield protocol for display purposes
    ///
    /// @return: Protocol name (e.g., "Flow Staking", "Aave Lending")
    access(all) fun getProtocolName(): String

    /// Get protocol type/category
    ///
    /// Returns a type identifier for categorizing different protocols
    ///
    /// Types:
    /// 0 = Staking (network staking)
    /// 1 = Lending (DeFi lending protocols)
    /// 2 = Liquidity Pool (AMM LP strategies)
    /// 3 = Hybrid (multi-strategy combination)
    /// 99 = Simulated (test/mock implementations)
    ///
    /// @return: Type identifier (0=staking, 1=lending, 2=lp, 3=hybrid, 99=simulated)
    access(all) fun getProtocolType(): UInt8
}
