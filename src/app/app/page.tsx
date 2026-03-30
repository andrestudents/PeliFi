"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PoolFilter } from "@/features/pool/components/PoolFilter"
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
import { PoolStatus } from "@/features/pool/types"

export default function AppPage() {
  const { pools, filter, setFilter } = usePools()
  const { positions, addPosition, removePosition } = usePositions()
  const { isConnected, openLoginDialog } = useWallet()
  const [activeTab, setActiveTab] = useState("profile")
  const [poolSubTab, setPoolSubTab] = useState<PoolStatus | "All">("All")

  const handleJoinPool = (position: UserPosition) => {
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
                <h2 className="text-2xl font-heading font-bold">Login untuk Mulai</h2>
                <p className="text-lg">Login dengan email untuk melihat pool</p>
                <Button
                  onClick={openLoginDialog}
                  className="bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Login
                </Button>
              </div>
            ) : (
              <Tabs value={poolSubTab} onValueChange={(v) => setPoolSubTab(v as PoolStatus | "All")} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-5 border-2 border-black shadow-shadow mx-auto">
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
                    value="Active"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="Completed"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="Cancelled"
                    className="data-[state=active]:bg-main data-[state=active]:text-main-foreground"
                  >
                    Cancelled
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

                <TabsContent value="Open" className="mt-6">
                  <PoolGrid
                    pools={pools.filter(m => m.status === "Open")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Active" className="mt-6">
                  <PoolGrid
                    pools={pools.filter(m => m.status === "Active")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Completed" className="mt-6">
                  <PoolGrid
                    pools={pools.filter(m => m.status === "Completed")}
                    userPositions={positions}
                    onPlaceBet={handleJoinPool}
                    onClaim={handleClaim}
                  />
                </TabsContent>

                <TabsContent value="Cancelled" className="mt-6">
                  <PoolGrid
                    pools={pools.filter(m => m.status === "Cancelled")}
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
