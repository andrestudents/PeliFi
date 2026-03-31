"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PoolGrid } from "@/features/pool/components/PoolGrid"
import { PortfolioSummary } from "@/features/profile/components/PortfolioSummary"
import { PositionList } from "@/features/profile/components/PositionList"
import { EmptyProfile } from "@/features/profile/components/EmptyProfile"
import { WalletInfoCard } from "@/features/profile/components/WalletInfoCard"
import { SendFlowCard } from "@/features/profile/components/SendFlowCard"
import { usePools } from "@/features/pool/hooks/usePools"
import { usePositions } from "@/features/profile/hooks/usePositions"
import { useWallet } from "@/context/WalletContext"
import { UserPosition } from "@/features/profile/types"
import { DurationCategory, getDurationCategory } from "@/lib/mock-utils"
import { sendJoinPool, waitForTransaction } from "@/lib/flow-transactions"
import { fetchUserPositions } from "@/lib/flow-scripts"
import { toast } from "sonner"

export default function AppPage() {
  const { pools, isLoading: poolsLoading, refresh: refreshPools } = usePools()
  const { positions, isLoading: positionsLoading, removePosition, refresh: refreshPositions } = usePositions()
  const { isConnected, address, openLoginDialog } = useWallet()
  const [activeTab, setActiveTab] = useState("profile")
  const [poolSubTab, setPoolSubTab] = useState<DurationCategory | "All">("All")

  const handleJoinPool = (position: UserPosition) => {
    // Position is already created on-chain, just refresh data
    refreshPositions()
    refreshPools()
  }

  const handleClaim = (poolId: number) => {
    removePosition(poolId)
    refreshPools()
  }

  const handleEarlyExit = (poolId: number) => {
    removePosition(poolId)
    refreshPools()
  }

  const handleNavigateToPool = () => {
    setActiveTab("pool")
  }

  const durationFiltered = (category: DurationCategory | "All") =>
    category === "All"
      ? pools
      : pools.filter(p => getDurationCategory(p.winnerCount) === category)

  return (
    <div className="min-h-screen bg-background">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "pool" && (
          <div className="max-w-[80%] mx-auto">
            {!isConnected ? (
              <div className="border-2 border-black shadow-shadow p-12 text-center space-y-6">
                <h2 className="text-2xl font-heading font-bold">Login to Start</h2>
                <p className="text-lg">Login with email to see Pool</p>
                <Button
                  onClick={openLoginDialog}
                  className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Login
                </Button>
              </div>
            ) : (
              <Tabs value={poolSubTab} onValueChange={(v) => setPoolSubTab(v as DurationCategory | "All")} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4 border-2 border-black shadow-shadow mx-auto">
                  <TabsTrigger
                    value="All"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="Weekly"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="Monthly"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="Yearly"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="All" className="mt-6">
                  <PoolGrid
                    pools={pools}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Weekly" className="mt-6">
                  <PoolGrid
                    pools={durationFiltered("Weekly")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Monthly" className="mt-6">
                  <PoolGrid
                    pools={durationFiltered("Monthly")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Yearly" className="mt-6">
                  <PoolGrid
                    pools={durationFiltered("Yearly")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-[80%] mx-auto space-y-6">
            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WalletInfoCard />
                <SendFlowCard />
              </div>
            )}

            {!isConnected || positions.length === 0 ? (
              <EmptyProfile onNavigateToPool={handleNavigateToPool} />
            ) : (
              <>
                <PortfolioSummary positions={positions} />
                <h1> My Positions </h1>
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
