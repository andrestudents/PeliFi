"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/context/WalletContext"
import { getMagic } from "@/lib/magic"
import * as fcl from "@onflow/fcl"

export function SendFlowCard() {
  const { isConnected } = useWallet()
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSend = useCallback(async () => {
    if (!toAddress || !amount) return

    setError("")
    setLoading(true)
    setTxHash(null)

    try {
      const magic = getMagic()

      const response = await fcl.mutate({
        template: "https://flix.flow.com/v1/templates?name=transfer-flow",
        args: (arg: any, t: any) => [
          arg(Number(amount).toFixed(2), t.UFix64),
          arg(toAddress, t.Address),
        ],
        proposer: magic.flow.authorization,
        authorizations: [magic.flow.authorization],
        payer: magic.flow.authorization,
        limit: 999,
      })

      setTxHash(response)

      const data = await fcl.tx(response).onceSealed()

      if (data.status === 4 && data.statusCode === 0) {
        setError("")
        setToAddress("")
        setAmount("")
      } else {
        setError(data.errorMessage || "Transaksi gagal")
      }
    } catch (e: any) {
      setError(e.message || "Transaksi gagal")
    } finally {
      setLoading(false)
    }
  }, [toAddress, amount])

  if (!isConnected) return null

  return (
    <Card className="border-2 border-black shadow-shadow">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold">Send FLOW for your friend</h3>

        <div className="space-y-3">
          <Input
            placeholder="Recipient Address (0x...)"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="border-2 border-black"
          />
          <Input
            type="number"
            placeholder="Amount (FLOW)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-black"
            min="0"
            step="0.01"
          />
        </div>

        {error && <p className="text-sm text-red-600 font-bold">{error}</p>}

        <Button
          onClick={handleSend}
          disabled={!toAddress || !amount || loading}
          className="w-full bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent" />
              Sending...
            </div>
          ) : (
            "Send"
          )}
        </Button>

        {txHash && (
          <p className="text-xs font-mono text-muted-foreground break-all">
            TX: {txHash}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
