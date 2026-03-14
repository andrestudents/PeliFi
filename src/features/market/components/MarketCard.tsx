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
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className="border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-heading font-bold flex-1">{market.question}</h3>
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
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-bold">TVL:</span>{" "}
              <FlowAmount amount={market.totalTVL} />
            </div>
            <div>
              <span className="font-bold">Rate:</span>{" "}
              <span className="font-mono font-bold">{market.currentExchangeRate.toFixed(2)}×</span>
            </div>
            <div className="col-span-2">
              <span className="font-bold">Deadline:</span>{" "}
              <span>{formatDate(market.bettingDeadline)}</span>
            </div>
          </div>

          {hasPosition && (
            <div className="bg-[#FACC00] text-black border-2 border-black px-3 py-1 rounded-full font-bold text-center">
              Posisi Aktif
            </div>
          )}

          {canBet && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-[#05E17A] text-black border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Place Bet
            </Button>
          )}

          {canClaim && (
            <ClaimButton marketId={market.id} onClaim={onClaim} />
          )}

          {!isConnected && (
            <div className="text-center text-sm text-gray-500">
              Connect wallet untuk memasang bet
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
