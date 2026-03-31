"use client"

import { useWallet } from "@/context/WalletContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyProfileProps {
  onNavigateToPool: () => void
}

export function EmptyProfile({ onNavigateToPool }: EmptyProfileProps) {
  const { isConnected, openLoginDialog } = useWallet()

  return (
    <Card className="border-2 border-black shadow-shadow">
      <CardContent className="p-12 text-center space-y-6">
        <h2 className="text-2xl font-heading font-bold">
          {isConnected ? "No Positions" : "Login to start"}
        </h2>

        <p className="text-lg">
          {isConnected
            ? "You haven't joined any pools yet. Join a pool and let your FLOW work for you!"
            : "Login with email to see your positions"}
        </p>

        <Button
          onClick={isConnected ? onNavigateToPool : openLoginDialog}
          className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          {isConnected ? "Go to Pool" : "Login"}
        </Button>
      </CardContent>
    </Card>
  )
}
