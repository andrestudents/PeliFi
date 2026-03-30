"use client"

import { PoolStatus } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PoolFilterProps {
  filter: PoolStatus | "All"
  onFilterChange: (filter: PoolStatus | "All") => void
}

export function PoolFilter({ filter, onFilterChange }: PoolFilterProps) {
  const filters: (PoolStatus | "All")[] = ["All", "Open", "Active", "Completed", "Cancelled"]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <Button
          key={f}
          onClick={() => onFilterChange(f)}
          variant={filter === f ? "default" : "outline"}
          className={cn(
            "border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all",
            filter === f && "bg-main text-main-foreground"
          )}
        >
          {f}
        </Button>
      ))}
    </div>
  )
}
