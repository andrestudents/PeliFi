"use client"

import { useWallet } from "@/context/WalletContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyProfileProps {
  onNavigateToPool: () => void
}

export function EmptyProfile({ onNavigateToPool }: EmptyProfileProps) {
  const { isConnected, connect } = useWallet()

  return (
    <Card className="border-2 border-black shadow-shadow">
      <CardContent className="p-12 text-center space-y-6">
        <h2 className="text-2xl font-heading font-bold">
          {isConnected ? "No Positions" : "Connect with Google"}
        </h2>

        <p className="text-lg">
          {isConnected
            ? "You don't have any positions yet. Start from the Pool tab!"
            : "Connect with Google to view your positions"}
        </p>

        <Button
          onClick={isConnected ? onNavigateToPool : connect}
          className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          {isConnected ? "Go to Pool" : "Continue with Google"}
        </Button>
      </CardContent>
    </Card>
  )
}
