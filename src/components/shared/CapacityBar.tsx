import { cn } from "@/lib/utils"

interface CapacityBarProps {
  current: number
  capacity: number
}

export function CapacityBar({ current, capacity }: CapacityBarProps) {
  const percentage = Math.round((current / capacity) * 100)

  return (
    <div className="w-full">
      <div className="flex h-6 border-2 border-black shadow-shadow overflow-hidden">
        <div
          className={cn(
            "flex items-center justify-center text-xs font-bold transition-all",
            percentage === 100
              ? "bg-[#0099FF] text-black"
              : "bg-[#05E17A] text-black"
          )}
          style={{ width: `${Math.max(percentage, 8)}%` }}
        >
          {percentage > 15 && `${percentage}%`}
        </div>
        {percentage < 100 && (
          <div className="flex-1 bg-secondary-background" />
        )}
      </div>
      <div className="flex justify-between text-xs font-bold mt-1">
        <span>{current}/{capacity} users</span>
        {percentage === 100 && <span>Full</span>}
      </div>
    </div>
  )
}
