import type { Vehicle } from "./vehicle.types"

export interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerDetails extends Customer {
  currentVehicles: Vehicle[]
}
