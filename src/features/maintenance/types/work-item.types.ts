/**
 * @deprecated Legacy mock-only work statuses. Use PersistedWorkStatus
 * (maintenance-detail.types.ts) for API-backed work items.
 */
export type WorkStatus = "pending" | "in_progress" | "completed" | "cancelled"

export interface WorkItem {
  id: string
  description: string
  estimatedCost: number | null
  displayOrder: number
  quantity?: number
  progress: number
  assignee?: string
  status: WorkStatus
  isRequired: boolean
}

export const WORK_STATUSES: WorkStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]
