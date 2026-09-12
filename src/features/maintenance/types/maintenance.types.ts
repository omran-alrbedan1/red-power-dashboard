import type { ReceiptCondition } from "./inspection.types"
import type { WorkItem } from "./work-item.types"
import type { Approval } from "./approval.types"
import type { ActivityEvent, StatusEvent } from "./activity.types"

/**
 * @deprecated Legacy mock-only card statuses. The backend persists only
 * OPEN/CLOSED; use MaintenanceCardStatus (maintenance-detail.types.ts) for
 * API-backed flows.
 */
export type MaintenanceStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "waiting_parts"
  | "ready_for_delivery"
  | "closed"
  | "cancelled"

export interface CustomerSnapshot {
  name: string
  phone: string
  email?: string
}

export interface VehicleSnapshot {
  make: string
  model: string
  plateNumber: string
  year?: number
  vin?: string
  mileage?: number
  fuelType?: string
  transmissionType?: string
}

export interface MaintenanceCard {
  id: string
  receiptNumber: string
  status: MaintenanceStatus
  createdAt: string
  updatedAt: string

  customerId?: string
  customerSnapshot: CustomerSnapshot

  vehicleId?: string
  vehicleSnapshot: VehicleSnapshot

  visitReason: string
  isOtherReason?: boolean
  complaint?: string

  condition?: ReceiptCondition
  itemsLeftInCar?: string[]

  workItems: WorkItem[]
  approval?: Approval
  expectedDelivery?: { date?: string; time?: string }
  receiverName?: string
  activityEvents: ActivityEvent[]
  statusEvents?: StatusEvent[]
}

export const MAINTENANCE_STATUSES: MaintenanceStatus[] = [
  "draft",
  "open",
  "in_progress",
  "waiting_parts",
  "ready_for_delivery",
  "closed",
  "cancelled",
]
