import { UserPosition } from "@/features/profile/types"
import { Card, CardContent } from "@/components/ui/card"
import { FlowAmount } from "@/components/shared/FlowAmount"

interface PortfolioSummaryProps {
  positions: UserPosition[]
}

export function PortfolioSummary({ positions }: PortfolioSummaryProps) {
  const totalValue = positions.reduce((sum, p) => sum + p.currentFLOWValue, 0)
  const totalYield = positions.reduce((sum, p) => sum + p.userYieldSoFar, 0)
  const poolCount = positions.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Total Value</div>
          <div className="text-2xl font-heading font-bold">
            <FlowAmount amount={totalValue} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Pools Joined</div>
          <div className="text-2xl font-heading font-bold">{poolCount}</div>
        </CardContent>
      </Card>

      <Card className="border-2 border-black shadow-shadow">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-bold mb-1">Total Yield</div>
          <div className="text-2xl font-heading font-bold text-[#05E17A]">
            <FlowAmount amount={totalYield} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
