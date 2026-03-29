"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MarketFilter } from "@/features/market/components/MarketFilter"
import { MarketGrid } from "@/features/market/components/MarketGrid"
import { PortfolioSummary } from "@/features/profile/components/PortfolioSummary"
import { PositionList } from "@/features/profile/components/PositionList"
import { EmptyProfile } from "@/features/profile/components/EmptyProfile"
import { usePools } from "@/features/market/hooks/useMarkets"
import { usePositions } from "@/features/profile/hooks/usePositions"
import { useWallet } from "@/context/WalletContext"
import { UserPosition } from "@/features/profile/types"
import { MarketStatus } from "@/features/market/types"
export default function AppPage() {
  const { pools, filter, setFilter } = usePools()
  const { positions, addPosition, removePosition } = usePositions()
  const { isConnected, connect } = useWallet()
  const [activeTab, setActiveTab] = useState("profile")
  const [poolSubTab, setPoolSubTab] = useState<MarketStatus | "All">("All")

  const handlePlaceBet = (position: UserPosition) => {
    addPosition(position)
  }

  const handleClaim = (poolId: number) => {
    removePosition(poolId)
  }

  const handleEarlyExit = (poolId: number) => {
    removePosition(poolId)
  }

  const handleNavigateToPool = () => {
    setActiveTab("pool")
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "pool" && (
          <div className="max-w-[80%] mx-auto">
            {!isConnected ? (
              <div className="border-2 border-black shadow-shadow p-12 text-center space-y-6">
                <h2 className="text-2xl font-heading font-bold">Connect with Google</h2>
                <p className="text-lg">Continue with Google to view pools</p>
                <Button
                  onClick={connect}
                  className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Continue with Google
                </Button>
              </div>
            ) : (
              <Tabs value={poolSubTab} onValueChange={(v) => setPoolSubTab(v as MarketStatus | "All")} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4 border-2 border-black shadow-shadow mx-auto">
                  <TabsTrigger
                    value="All"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="Open"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Open
                  </TabsTrigger>
                  <TabsTrigger
                    value="Resolved"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Resolved
                  </TabsTrigger>
                  <TabsTrigger
                    value="Cancelled"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="All" className="mt-6">
                  <MarketGrid
                    pools={pools}
                    userPositions={positions}
                    onPlaceBet={handlePlaceBet}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Open" className="mt-6">
                  <MarketGrid
                    pools={pools.filter(m => m.status === "Open")}
                    userPositions={positions}
                    onPlaceBet={handlePlaceBet}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Resolved" className="mt-6">
                  <MarketGrid
                    pools={pools.filter(m => m.status === "Resolved")}
                    userPositions={positions}
                    onPlaceBet={handlePlaceBet}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Cancelled" className="mt-6">
                  <MarketGrid
                    pools={pools.filter(m => m.status === "Cancelled")}
                    userPositions={positions}
                    onPlaceBet={handlePlaceBet}
                    onClaim={handleClaim}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-[80%] mx-auto space-y-6">
            {!isConnected || positions.length === 0 ? (
              <EmptyProfile onNavigateToPool={handleNavigateToPool} />
            ) : (
              <>
                <PortfolioSummary positions={positions} />
                <PositionList
                  positions={positions}
                  pools={pools}
                  onEarlyExit={handleEarlyExit}
                  onClaim={handleClaim}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
