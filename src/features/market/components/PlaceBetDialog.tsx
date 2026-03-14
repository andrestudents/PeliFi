"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Market } from "@/features/market/types"
import { UserPosition, Side } from "@/features/profile/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SideBadge } from "@/components/shared/SideBadge"
import { FlowAmount } from "@/components/shared/FlowAmount"
import { estimatePayout } from "@/lib/mock-utils"

interface PlaceBetDialogProps {
  market: Market
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlaceBet: (position: UserPosition) => void
}

export function PlaceBetDialog({ market, open, onOpenChange, onPlaceBet }: PlaceBetDialogProps) {
  const [selectedSide, setSelectedSide] = useState<Side>("YES")
  const [amount, setAmount] = useState<string>("100")
  const [isLoading, setIsLoading] = useState(false)

  const amountNum = parseFloat(amount) || 0
  const estimates = estimatePayout(amountNum, selectedSide, market, market.currentExchangeRate)

  const handlePlaceBet = () => {
    if (amountNum < 1) {
      toast.error("Minimum bet is 1 FLOW")
      return
    }

    setIsLoading(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      const newPosition: UserPosition = {
        marketId: market.id,
        side: selectedSide,
        principal_FLOW: amountNum,
        entryExchangeRate: market.currentExchangeRate,
        currentExchangeRate: market.currentExchangeRate,
        currentFLOWValue: amountNum,
        userYieldSoFar: 0,
        effectiveYieldRate: 0,
        estimatedPayoutIfWin: estimates.win,
        estimatedPayoutIfLose: estimates.lose,
        estimatedWinBonus: estimates.win - amountNum,
        estimatedEarlyExit: estimates.earlyExit,
        marketStatus: market.status,
      }

      onPlaceBet(newPosition)
      toast.success("Bet successfully placed!")
      setIsLoading(false)
      onOpenChange(false)
      setAmount("100")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Place Bet</DialogTitle>
          <DialogDescription className="font-bold text-lg">{market.question}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Side Selection */}
          <div>
            <label className="block text-sm font-bold mb-2">Select Side</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedSide("YES")}
                variant={selectedSide === "YES" ? "default" : "outline"}
                className={cn(
                  "flex-1 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all",
                  selectedSide === "YES" && "bg-[#05E17A] text-black"
                )}
              >
                YES
              </Button>
              <Button
                onClick={() => setSelectedSide("NO")}
                variant={selectedSide === "NO" ? "default" : "outline"}
                className={cn(
                  "flex-1 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all",
                  selectedSide === "NO" && "bg-[#FF4D50] text-black"
                )}
              >
                NO
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold mb-2">FLOW Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              className="border-2 border-black"
              disabled={isLoading}
            />
          </div>

          {/* Estimates */}
          <div className="bg-secondary-background border-2 border-black p-4 rounded space-y-2">
            <h3 className="font-bold mb-2">Estimated Payout:</h3>
            <div className="flex justify-between">
              <span>If Win:</span>
              <FlowAmount amount={estimates.win} />
            </div>
            <div className="flex justify-between">
              <span>If Lose:</span>
              <FlowAmount amount={estimates.lose} />
            </div>
            <div className="flex justify-between text-sm">
              <span>Early Exit:</span>
              <FlowAmount amount={estimates.earlyExit} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              className="flex-1 bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Bet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
