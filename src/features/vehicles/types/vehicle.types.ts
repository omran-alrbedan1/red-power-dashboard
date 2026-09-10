import type { PaginatedResponse } from "@/lib/api/api.types"
import type { MaintenanceHistoryItem, MaintenanceHistoryStatus } from "@/features/customers/types/customer.types"

export type TransmissionType = "MANUAL" | "AUTOMATIC"
export interface CustomerSummary { id: string; name: string; phone: string; email: string | null; isActive: boolean }

export interface Vehicle {
  id: string
  make: string
  model: string
  manufactureYear: number
  plateNumber: string
  vin: string | null
  color: string | null
  transmission: TransmissionType
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface VehicleOwnership {
  id: string
  vehicleId?: string
  customerId?: string
  startedAt: string
  endedAt: string | null
  createdAt?: string
  updatedAt?: string
  customer: CustomerSummary
}

export interface VehicleWithOwner extends Vehicle { currentOwnership: VehicleOwnership | null }
export interface OwnershipResponse { currentOwner: VehicleOwnership | null; history: VehicleOwnership[] }
export interface VehicleListParams { page: number; limit: number; search?: string; isActive?: boolean; customerId?: string }
export interface CreateVehicleDto { customerId: string; make: string; model: string; manufactureYear: number; plateNumber: string; vin?: string; color?: string; transmission: TransmissionType }
export type UpdateVehicleDto = Partial<Omit<CreateVehicleDto, "customerId">>
export interface VehicleHistoryParams { page: number; limit: number; status?: MaintenanceHistoryStatus; receivedFrom?: string; receivedTo?: string }
export interface VehicleMaintenanceHistory { vehicle: Vehicle; currentOwner: VehicleOwnership | null; history: PaginatedResponse<MaintenanceHistoryItem & { customer: CustomerSummary }> }
