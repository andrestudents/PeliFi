"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketFilter } from "@/features/market/components/MarketFilter"
import { MarketGrid } from "@/features/market/components/MarketGrid"
import { PortfolioSummary } from "@/features/profile/components/PortfolioSummary"
import { PositionList } from "@/features/profile/components/PositionList"
import { EmptyProfile } from "@/features/profile/components/EmptyProfile"
import { useMarkets } from "@/features/market/hooks/useMarkets"
import { usePositions } from "@/features/profile/hooks/usePositions"
import { useWallet } from "@/context/WalletContext"
import { UserPosition } from "@/features/profile/types"
import { MarketStatus } from "@/features/market/types"

export default function AppPage() {
  const { markets, filter, setFilter } = useMarkets()
  const { positions, addPosition, removePosition } = usePositions()
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("profile")
  const [marketSubTab, setMarketSubTab] = useState<MarketStatus | "All">("All")

  const handlePlaceBet = (position: UserPosition) => {
    addPosition(position)
  }

  const handleClaim = (marketId: number) => {
    removePosition(marketId)
  }

  const handleEarlyExit = (marketId: number) => {
    removePosition(marketId)
  }

  const handleNavigateToMarket = () => {
    setActiveTab("market")
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "market" && (
          <div className="max-w-[80%] mx-auto">
            <Tabs value={marketSubTab} onValueChange={(v) => setMarketSubTab(v as MarketStatus | "All")} className="w-full">
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
                  markets={markets}
                  userPositions={positions}
                  onPlaceBet={handlePlaceBet}
                  onClaim={handleClaim}
                />
              </TabsContent>

              <TabsContent value="Open" className="mt-6">
                <MarketGrid
                  markets={markets.filter(m => m.status === "Open")}
                  userPositions={positions}
                  onPlaceBet={handlePlaceBet}
                  onClaim={handleClaim}
                />
              </TabsContent>

              <TabsContent value="Resolved" className="mt-6">
                <MarketGrid
                  markets={markets.filter(m => m.status === "Resolved")}
                  userPositions={positions}
                  onPlaceBet={handlePlaceBet}
                  onClaim={handleClaim}
                />
              </TabsContent>

              <TabsContent value="Cancelled" className="mt-6">
                <MarketGrid
                  markets={markets.filter(m => m.status === "Cancelled")}
                  userPositions={positions}
                  onPlaceBet={handlePlaceBet}
                  onClaim={handleClaim}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-[80%] mx-auto space-y-6">
            {!isConnected || positions.length === 0 ? (
              <EmptyProfile onNavigateToMarket={handleNavigateToMarket} />
            ) : (
              <>
                <PortfolioSummary positions={positions} />
                <PositionList
                  positions={positions}
                  markets={markets}
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
