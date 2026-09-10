export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerVehicleSummary {
  id: string
  ownershipId: string
  ownedSince: string
  make: string
  model: string
  manufactureYear: number | null
  plateNumber: string
  vin: string | null
  color: string | null
  transmission: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerDetails extends Customer {
  currentVehicles: CustomerVehicleSummary[]
}

export interface CustomerListParams {
  page: number
  limit: number
  search?: string
  isActive?: boolean
}

export interface CreateCustomerDto {
  name: string
  phone: string
  email?: string
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>

export type MaintenanceHistoryStatus = "OPEN" | "CLOSED"

export interface MaintenanceHistoryItem {
  id: string
  cardNumber: string
  status: MaintenanceHistoryStatus
  receivedAt: string
  expectedDeliveryAt: string | null
  mileage: number
  vehicleOwnership: {
    id: string
    startedAt: string
    endedAt: string | null
    vehicle?: { id: string; make: string; model: string; plateNumber: string; vin: string | null }
  }
}

export interface MaintenanceHistoryParams {
  page: number
  limit: number
  status?: MaintenanceHistoryStatus
  receivedFrom?: string
  receivedTo?: string
  vehicleId?: string
}

export interface CustomerMaintenanceHistory {
  customer: Pick<Customer, "id" | "name" | "phone" | "email" | "isActive">
  history: import("@/lib/api/api.types").PaginatedResponse<MaintenanceHistoryItem>
}
