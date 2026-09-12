import type {
  ApiMaintenanceCardStatus,
  ApiMaintenanceWorkStatus,
} from "../constants/status"

export type ApiFuelLevel = "EMPTY" | "QUARTER" | "HALF" | "THREE_QUARTERS" | "FULL"
export type ApiCardStatus = ApiMaintenanceCardStatus
export type ApiTransmission = "AUTOMATIC" | "MANUAL"
export type ApiWorkStatus = ApiMaintenanceWorkStatus
export type MaintenanceOptionKind = "visit-reasons" | "vehicle-conditions" | "vehicle-items"

export interface MaintenanceOption {
  id: number
  label: string
  code: string
}

export interface MaintenanceWork {
  id: number
  description: string
  displayOrder: number
  isRequired: boolean
  estimatedCost?: string | number | null
  status: ApiWorkStatus
  completedAt?: string | null
}

export interface MaintenanceStatusEvent {
  id: number
  fromStatus?: ApiCardStatus | null
  toStatus: ApiCardStatus
  createdAt: string
  changedBy?: {
    id: number
    firstName?: string | null
    lastName?: string | null
    email: string
  } | null
}

export interface ApiCustomerRef {
  id: number
  name: string
  phone: string
  email?: string | null
}

export interface ApiVehicleRef {
  id: number
  make: string
  model: string
  manufactureYear?: number | null
  plateNumber: string
  vin?: string | null
  color?: string | null
  transmission?: ApiTransmission | null
}

export interface ApiCreatedByRef {
  id: number
  firstName?: string | null
  lastName?: string | null
  email: string
}

export interface ApiMaintenanceCardListRow {
  id: number
  cardNumber: string
  status: ApiCardStatus
  receivedAt: string
  expectedDeliveryAt?: string | null
  mileage: number
  customer?: ApiCustomerRef | null
  vehicleOwnership?: {
    id: number
    vehicle: ApiVehicleRef
  } | null
  createdBy?: ApiCreatedByRef | null
}

export interface ApiMaintenanceCardDetail {
  id: number
  cardNumber: string
  status: ApiCardStatus
  receivedAt: string
  expectedDeliveryAt?: string | null
  mileage: number
  fuelLevel: ApiFuelLevel
  customerComplaint?: string | null
  inspectionNotes?: string | null
  customerApproved: boolean
  customerApprovalName?: string | null
  customerApprovedAt?: string | null
  customer?: ApiCustomerRef | null
  vehicleOwnership?: {
    id: number
    vehicle: ApiVehicleRef
  } | null
  createdBy?: ApiCreatedByRef | null
  visitReasons?: Array<{ visitReason: MaintenanceOption }>
  conditionOptions?: Array<{ conditionOption: MaintenanceOption }>
  itemOptions?: Array<{ itemOption: MaintenanceOption }>
  requiredWorks?: MaintenanceWork[]
  statusEvents?: MaintenanceStatusEvent[]
}

export interface CreateRequiredWorkInput {
  description: string
  displayOrder: number
  isRequired?: boolean
  estimatedCost?: number | null
}

export interface CreateMaintenanceCardInput {
  customerId: number
  vehicleOwnershipId: number
  receivedAt: string
  mileage: number
  fuelLevel: ApiFuelLevel
  customerApproved: boolean
  expectedDeliveryAt?: string
  customerComplaint?: string
  inspectionNotes?: string
  customerApprovalName?: string
  customerApprovedAt?: string
  visitReasonIds?: number[]
  vehicleConditionOptionIds?: number[]
  vehicleItemOptionIds?: number[]
  requiredWorks?: CreateRequiredWorkInput[]
}