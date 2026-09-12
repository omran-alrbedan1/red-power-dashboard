export type TransmissionType = "automatic" | "manual"

export interface VehicleOwnership {
  id: number
  customerId: number
  startedAt: string
  endedAt?: string | null
}

export interface Vehicle {
  id: number
  make: string
  model: string
  manufactureYear: number
  plateNumber: string
  vin?: string
  transmission: TransmissionType
  color?: string
  ownershipId?: number
  currentOwnership?: VehicleOwnership | null
  createdAt: string
  updatedAt: string
}
