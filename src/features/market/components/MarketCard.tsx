"use client"

import { useState } from "react"
import { Market } from "@/features/market/types"
import { UserPosition } from "@/features/profile/types"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { SideBadge } from "@/components/shared/SideBadge"
import { OddsBar } from "@/components/shared/OddsBar"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PlaceBetDialog } from "./PlaceBetDialog"
import { ClaimButton } from "./ClaimButton"
import { useWallet } from "@/context/WalletContext"

interface MarketCardProps {
  market: Market
  userPosition?: UserPosition
  onPlaceBet: (position: UserPosition) => void
  onClaim: (marketId: number) => void
}

export function MarketCard({ market, userPosition, onPlaceBet, onClaim }: MarketCardProps) {
  const { isConnected } = useWallet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const hasPosition = !!userPosition
  const canBet = market.status === "Open" && isConnected && !hasPosition
  const canClaim = market.status === "Resolved" && hasPosition

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Open-ended"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all h-full">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-heading font-bold flex-1 leading-tight">{market.question}</h3>
            <StatusBadge status={market.status} />
          </div>

          <OddsBar yesPercentage={market.yesOdds} noPercentage={market.noOdds} />

          {market.status === "Resolved" && market.winningSide && (
            <div className="text-center">
              <span className="text-sm font-bold">Winner: </span>
              <SideBadge side={market.winningSide} />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary-background border-2 border-black p-3 rounded">
              <div className="font-bold text-xs mb-1">TVL</div>
              <FlowAmount amount={market.totalTVL} />
            </div>
            <div className="bg-secondary-background border-2 border-black p-3 rounded">
              <div className="font-bold text-xs mb-1">Rate</div>
              <span className="font-mono font-bold">{market.currentExchangeRate.toFixed(2)}×</span>
            </div>
          </div>

          <div className="bg-secondary-background border-2 border-black p-3 rounded space-y-2 text-sm">
            <div className="font-bold mb-2">Market Details</div>
            <div className="flex justify-between">
              <span>Total Yes:</span>
              <span className="font-mono font-bold">{market.yesOdds}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total No:</span>
              <span className="font-mono font-bold">{market.noOdds}%</span>
            </div>
            <div className="flex justify-between">
              <span>Deadline:</span>
              <span className="text-xs">{formatDate(market.bettingDeadline)}</span>
            </div>
          </div>

          {hasPosition && (
            <div className="bg-[#FACC00] text-black border-2 border-black px-3 py-2 rounded-full font-bold text-center">
              Active Position
            </div>
          )}

          {canBet && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-[#05E17A] text-black border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all py-6 text-lg"
            >
              Place Bet
            </Button>
          )}

          {canClaim && (
            <ClaimButton marketId={market.id} onClaim={onClaim} />
          )}

          {!isConnected && (
            <div className="text-center text-sm text-gray-500 border-2 border-dashed border-gray-300 p-3 rounded">
              Connect wallet to place bet
            </div>
          )}
        </CardContent>
      </Card>

      <PlaceBetDialog
        market={market}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onPlaceBet={onPlaceBet}
      />
    </>
  )
}
