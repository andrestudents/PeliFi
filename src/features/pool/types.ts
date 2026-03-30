export type PoolStatus = "Open" | "Active" | "Completed" | "Cancelled"

export interface Pool {
  id: number
  name: string
  status: PoolStatus
  capacity: number
  currentUserCount: number
  depositAmount: number
  activeDuration: number
  winnerCount: number
  totalPrincipal: number
  yieldAPR: number
  adminFeePercentage: number
  createdAt: number
  activatedAt: number | null
  completedAt: number | null
}
