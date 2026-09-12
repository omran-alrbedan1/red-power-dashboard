import type { MaintenanceOption } from "./api-maintenance.types"

export type MaintenanceCardStatus = "open" | "closed"

export type PersistedWorkStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"

export interface MaintenanceCardListRow {
  id: number
  cardNumber: string
  status: MaintenanceCardStatus
  receivedAt: string
  expectedDeliveryAt?: string | null
  customer: {
    id: number
    name: string
    phone: string
    email?: string | null
  }
  vehicle: {
    id: number
    make: string
    model: string
    plateNumber: string
  }
}

export interface MaintenanceWorkRow {
  id: number
  description: string
  displayOrder: number
  isRequired: boolean
  estimatedCost?: number | null
  status: PersistedWorkStatus
  completedAt?: string | null
}

export interface MaintenanceStatusEventRow {
  id: number
  fromStatus?: MaintenanceCardStatus | null
  toStatus: MaintenanceCardStatus
  createdAt: string
  changedBy?: { id: number; name?: string } | null
}

export interface MaintenanceCardDetail {
  id: number
  cardNumber: string
  status: MaintenanceCardStatus
  receivedAt: string
  expectedDeliveryAt?: string | null
  mileage: number
  fuelLevel: string
  customerComplaint?: string | null
  inspectionNotes?: string | null
  customerApproved: boolean
  customerApprovalName?: string | null
  customerApprovedAt?: string | null
  customer: {
    id: number
    name: string
    phone: string
    email?: string | null
  }
  vehicleOwnershipId: number
  vehicle: {
    id: number
    make: string
    model: string
    manufactureYear?: number | null
    plateNumber: string
    vin?: string | null
    transmission?: string | null
  }
  createdBy?: { id: number; name?: string } | null
  visitReasons: MaintenanceOption[]
  conditionOptions: MaintenanceOption[]
  itemOptions: MaintenanceOption[]
  requiredWorks: MaintenanceWorkRow[]
  statusEvents: MaintenanceStatusEventRow[]
}