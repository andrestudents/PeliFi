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
  pool: Market
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlaceBet: (position: UserPosition) => void
}

export function PlaceBetDialog({ pool, open, onOpenChange, onPlaceBet }: PlaceBetDialogProps) {
  const [selectedSide, setSelectedSide] = useState<Side>("YES")
  const [amount, setAmount] = useState<string>("100")
  const [isLoading, setIsLoading] = useState(false)

  const amountNum = parseFloat(amount) || 0
  const estimates = estimatePayout(amountNum, selectedSide, pool, pool.currentExchangeRate)

  const handlePlaceBet = () => {
    if (amountNum < 100) {
      toast.error("Minimum deposit is 100 FLOW")
      return
    }

    setIsLoading(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      const newPosition: UserPosition = {
        marketId: pool.id,
        side: selectedSide,
        principal_FLOW: amountNum,
        entryExchangeRate: pool.currentExchangeRate,
        currentExchangeRate: pool.currentExchangeRate,
        currentFLOWValue: amountNum,
        userYieldSoFar: 0,
        effectiveYieldRate: 0,
        estimatedPayoutIfWin: estimates.win,
        estimatedPayoutIfLose: estimates.lose,
        estimatedWinBonus: estimates.win - amountNum,
        estimatedEarlyExit: estimates.earlyExit,
        marketStatus: pool.status,
      }

      onPlaceBet(newPosition)
      toast.success("Successfully joined pool!")
      setIsLoading(false)
      onOpenChange(false)
      setAmount("100")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Join Pool</DialogTitle>
          <DialogDescription className="font-bold text-lg">{pool.question}</DialogDescription>
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

          {/* Balance Display */}
          <div className="bg-secondary-background border-2 border-black p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">Your Balance:</span>
              <FlowAmount amount={10000} />
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold mb-2">Input Amount</label>
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
              <span>If Lose:</span>
              <FlowAmount amount={estimates.lose} />
            </div>
            <div className="flex justify-between text-red-600 font-bold bg-red-50 border border-red-300 p-2 rounded">
              <span>⚠️ Early Exit:</span>
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
              {isLoading ? "Processing..." : "Join Pool"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
