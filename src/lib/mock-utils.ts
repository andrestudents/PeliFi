export function estimateYieldIfWinner(
  depositAmount: number,
  totalPrincipal: number,
  winnerCount: number,
  durationSeconds: number,
  yieldAPR: number = 0.07,
  adminFee: number = 0.01
): number {
  const secondsPerYear = 31536000
  const years = durationSeconds / secondsPerYear
  const totalYield = totalPrincipal * yieldAPR * years
  const yieldAfterFee = totalYield * (1 - adminFee)
  return Math.round((yieldAfterFee / winnerCount) * 100) / 100
}

export function formatDuration(seconds: number): string {
  if (seconds >= 31536000) return `${Math.round(seconds / 31536000)} Year(s)`
  if (seconds >= 2592000) return `${Math.round(seconds / 2592000)} Month(s)`
  if (seconds >= 604800) return `${Math.round(seconds / 604800)} Week(s)`
  if (seconds >= 86400) return `${Math.round(seconds / 86400)} Day(s)`
  return `${Math.round(seconds / 3600)} Hour(s)`
}

export function getCapacityPercentage(current: number, capacity: number): number {
  return Math.round((current / capacity) * 100)
}
