"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/WalletContext"
import * as fcl from "@onflow/fcl"

export function WalletInfoCard() {
  const { address, email, isConnected, disconnect } = useWallet()
  const [balance, setBalance] = useState<string>("...")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchBalance = useCallback(async () => {
    if (!address) return
    try {
      const account = await fcl.account(address)
      const flowBalance = (account.balance / 10 ** 8).toFixed(4)
      setBalance(flowBalance)
    } catch {
      setBalance("Error")
    }
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance()
    }
  }, [isConnected, address, fetchBalance])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchBalance()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (!isConnected) return null

  return (
    <Card className="border-2 border-black shadow-shadow">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold">Wallet</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {isRefreshing ? "..." : "Refresh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-red-600"
            >
              Disconnect
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">Email</span>
            <span className="text-muted-foreground">{email}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="font-bold">Address</span>
            <button
              onClick={handleCopyAddress}
              className="font-mono text-xs text-muted-foreground hover:text-black transition-colors truncate max-w-[200px]"
              title="Click to copy"
            >
              {address}
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold">Balance</span>
            <span className="font-heading font-bold">{balance} FLOW</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
