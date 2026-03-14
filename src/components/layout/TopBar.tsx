"use client"

import { useWallet } from "@/context/WalletContext"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { isConnected, address, connect, disconnect } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-2 border-black bg-secondary-background shadow-shadow">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-main rounded border-2 border-black"></div>
          <h1 className="text-2xl font-heading font-bold">PeliFi</h1>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold">{address}</span>
              <Button
                onClick={disconnect}
                variant="outline"
                className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
