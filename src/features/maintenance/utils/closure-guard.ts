import type { MaintenanceWorkRow } from "../types/maintenance-detail.types"

export interface ClosureStatus {
  allowed: boolean
  remainingWork: MaintenanceWorkRow[]
}

export const getClosureStatus = (works: MaintenanceWorkRow[]): ClosureStatus => {
  const openRequiredWork = works.filter(
    (w) => w.isRequired && w.status !== "completed" && w.status !== "cancelled"
  )
  return { allowed: openRequiredWork.length === 0, remainingWork: openRequiredWork }
}