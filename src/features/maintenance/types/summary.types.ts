import type { MaintenanceCardStatus } from "./maintenance-detail.types"

export interface MaintenanceCardSummary {
  id: number
  receiptNumber: string
  status: MaintenanceCardStatus
  createdAt: string
}