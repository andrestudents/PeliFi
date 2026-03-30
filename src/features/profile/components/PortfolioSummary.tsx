import { UserPosition } from "@/features/profile/types"
import { Card, CardContent } from "@/components/ui/card"
import { FlowAmount } from "@/components/shared/FlowAmount"

interface PortfolioSummaryProps {
  positions: UserPosition[]
}

export function PortfolioSummary({ positions }: PortfolioSummaryProps) {
  const totalLocked = positions
    .filter(p => p.poolStatus === "Active")
    .reduce((sum, p) => sum + p.principal, 0)
  const poolCount = positions.length
  const yieldWon = positions
    .filter(p => p.isWinner)
    .reduce((sum, p) => sum + p.yieldAmount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Total Locked</div>
          <div className="text-2xl font-heading font-bold">
            <FlowAmount amount={totalLocked} />
          </div>
        </CardContent>
      </Card> */}

      <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Pools Joined</div>
          <div className="text-2xl font-heading font-bold">{poolCount}</div>
        </CardContent>
      </Card>

      {/* <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Yield Won</div>
          <div className="text-2xl font-heading font-bold text-[#05E17A]">
            <FlowAmount amount={yieldWon} />
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
