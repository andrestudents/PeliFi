"use client"

import { useWallet } from "@/context/WalletContext"
import { Button } from "@/components/ui/button"
import { User, TrendingUp } from "lucide-react"
import Image from "next/image"

interface TopBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  const { isConnected, address, email, isLoading, openLoginDialog, disconnect } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-2 border-black bg-secondary-background shadow-shadow">
      <div className="max-w-[80%] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="PeliFi" width={32} height={32} className="rounded border-2 border-black" />
          <h1 className="text-2xl font-heading font-bold">PeliFi</h1>
        </div>

        <nav className="flex space-x-2">
          <Button
            onClick={() => onTabChange("profile")}
            variant={activeTab === "profile" ? "default" : "outline"}
            className={`border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 ${activeTab === "profile" ? "bg-main text-main-foreground" : ""
              }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
          <Button
            onClick={() => onTabChange("pool")}
            variant={activeTab === "pool" ? "default" : "outline"}
            className={`border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 ${activeTab === "pool" ? "bg-main text-main-foreground" : ""
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            Pool
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs opacity-60">{email}</div>
                <div className="text-sm font-bold font-mono">{address}</div>
              </div>
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
              onClick={openLoginDialog}
              disabled={isLoading}
              className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {isLoading ? "..." : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
