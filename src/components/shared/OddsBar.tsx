import { cn } from "@/lib/utils"

interface OddsBarProps {
  yesPercentage: number
  noPercentage: number
}

export function OddsBar({ yesPercentage, noPercentage }: OddsBarProps) {
  return (
    <div className="w-full">
      <div className="flex h-8 border-2 border-black shadow-shadow">
        <div
          className="bg-[#05E17A] flex items-center justify-center text-xs font-bold"
          style={{ width: `${yesPercentage}%` }}
        >
          {yesPercentage > 10 && `YES ${yesPercentage}%`}
        </div>
        <div
          className="bg-[#FF4D50] flex items-center justify-center text-xs font-bold"
          style={{ width: `${noPercentage}%` }}
        >
          {noPercentage > 10 && `NO ${noPercentage}%`}
        </div>
      </div>
      {(yesPercentage <= 10 || noPercentage <= 10) && (
        <div className="flex justify-between text-xs font-bold mt-1">
          <span>YES {yesPercentage}%</span>
          <span>NO {noPercentage}%</span>
        </div>
      )}
    </div>
  )
}
