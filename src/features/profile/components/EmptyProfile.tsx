"use client"

import { useWallet } from "@/context/WalletContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyProfileProps {
  onNavigateToMarket: () => void
}

export function EmptyProfile({ onNavigateToMarket }: EmptyProfileProps) {
  const { isConnected, connect } = useWallet()

  return (
    <Card className="border-2 border-black shadow-shadow">
      <CardContent className="p-12 text-center space-y-6">
        <h2 className="text-2xl font-heading font-bold">
          {isConnected ? "No Positions" : "Connect Wallet"}
        </h2>

        <p className="text-lg">
          {isConnected
            ? "You don't have any positions yet. Start from the Market tab!"
            : "Connect wallet to view your positions"}
        </p>

        <Button
          onClick={isConnected ? onNavigateToMarket : connect}
          className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          {isConnected ? "Go to Market" : "Connect Wallet"}
        </Button>
      </CardContent>
    </Card>
  )
}
