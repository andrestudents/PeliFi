import * as fcl from "@onflow/fcl"
import { getMagic } from "./magic"
import { ensureFclConfig } from "./flow-config"

// ── Transactions (state-changing) ────────────────────────────────────

const JOIN_POOL = `
import PeliFi from 0xPeliFi
import PeliFiTypes from 0xPeliFiTypes
import FlowToken from 0x7e60df042a9c0868

transaction(poolId: UInt64, amount: UFix64) {
    prepare(user: auth(Storage) &Account) {
        let canJoin = PeliFi.canUserJoinPool(poolId: poolId, user: user.address)
        if !canJoin {
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
            let userPosition = PeliFi.getUserPosition(poolId: poolId, user: user.address)
            if userPosition != nil {
                panic("User is already in this pool")
            }
        }

        let poolDetails = PeliFi.getPoolDetails(poolId: poolId)!
        if amount != poolDetails.depositAmount {
            panic("Deposit amount must match pool requirement exactly")
        }

        let tempVault <- user.storage.load<@FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("FLOW vault not found")

        let paymentVault <- tempVault.withdraw(amount: amount) as! @FlowToken.Vault
        user.storage.save(<-tempVault, to: /storage/flowTokenVault)

        PeliFi.joinPool(poolId: poolId, user: user.address, vault: <-paymentVault)
    }
    execute {}
}
`

const EARLY_EXIT = `
import PeliFi from 0xPeliFi
import PeliFiTypes from 0xPeliFiTypes
import FlowToken from 0x7e60df042a9c0868

transaction(poolId: UInt64) {
    prepare(user: auth(Storage) &Account) {
        let poolDetails = PeliFi.getPoolDetails(poolId: poolId) ?? panic("Pool does not exist")
        if poolDetails.status != PeliFiTypes.STATUS_OPEN {
            panic("Early exit is only allowed during OPEN period.")
        }

        let vault <- PeliFi.earlyExit(poolId: poolId, user: user.address)

        let tempVault <- user.storage.load<@FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("FLOW vault not found")
        tempVault.deposit(from: <-vault)
        user.storage.save(<-tempVault, to: /storage/flowTokenVault)
    }
    execute {}
}
`

const CLAIM_WITHDRAW = `
import PeliFi from 0xPeliFi
import PeliFiTypes from 0xPeliFiTypes
import FlowToken from 0x7e60df042a9c0868

transaction(poolId: UInt64) {
    prepare(user: auth(Storage) &Account) {
        let vault <- PeliFi.claimWithdraw(poolId: poolId, user: user.address)

        let tempVault <- user.storage.load<@FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("FLOW vault not found")
        tempVault.deposit(from: <-vault)
        user.storage.save(<-tempVault, to: /storage/flowTokenVault)
    }
    execute {}
}
`

// ── Transaction Functions ────────────────────────────────────────────

export async function sendJoinPool(poolId: number, amount: number): Promise<string> {
    ensureFclConfig()
    const magic = getMagic()

    const txId = await fcl.mutate({
        cadence: JOIN_POOL,
        args: (arg: any, t: any) => [arg(poolId, t.UInt64), arg(amount.toFixed(8), t.UFix64)],
        proposer: magic.flow.authorization,
        authorizations: [magic.flow.authorization],
        payer: magic.flow.authorization,
        limit: 999,
    })

    return txId
}

export async function sendEarlyExit(poolId: number): Promise<string> {
    ensureFclConfig()
    const magic = getMagic()

    const txId = await fcl.mutate({
        cadence: EARLY_EXIT,
        args: (arg: any, t: any) => [arg(poolId, t.UInt64)],
        proposer: magic.flow.authorization,
        authorizations: [magic.flow.authorization],
        payer: magic.flow.authorization,
        limit: 999,
    })

    return txId
}

export async function sendClaimWithdraw(poolId: number): Promise<string> {
    ensureFclConfig()
    const magic = getMagic()

    const txId = await fcl.mutate({
        cadence: CLAIM_WITHDRAW,
        args: (arg: any, t: any) => [arg(poolId, t.UInt64)],
        proposer: magic.flow.authorization,
        authorizations: [magic.flow.authorization],
        payer: magic.flow.authorization,
        limit: 999,
    })

    return txId
}

export async function waitForTransaction(txId: string): Promise<any> {
    return fcl.tx(txId).onceSealed()
}
