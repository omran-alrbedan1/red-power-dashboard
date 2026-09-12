import { apiRequest } from "@/lib/api/client"
import type { ApiPaginated } from "@/lib/api/contracts"
import type { Customer, CustomerDetails } from "../types/customer.types"
import type { Vehicle, TransmissionType, VehicleOwnership } from "../types/vehicle.types"
import type { CustomerHistoryItem, CustomerHistoryPage } from "../types/visit-summary.types"

export interface CustomerInput { name: string; phone: string; email?: string }
export interface VehicleInput {
  make: string; model: string; manufactureYear: number; plateNumber: string
  vin?: string; color?: string; transmission: TransmissionType
}
export interface CustomerListParams { page: number; limit: number; search?: string }

interface ApiOwnership { id: number; customerId: number; startedAt: string; endedAt?: string | null }
interface ApiVehicle {
  id: number; make: string; model: string; manufactureYear: number; plateNumber: string
  vin?: string | null; color?: string | null; transmission: "AUTOMATIC" | "MANUAL"
  isActive: boolean; createdAt: string; updatedAt: string; currentOwnership?: ApiOwnership | null
  ownershipId?: number
}

const mapOwnership = (value: ApiOwnership): VehicleOwnership => ({ ...value })
const mapVehicle = (value: ApiVehicle): Vehicle => ({
  ...value,
  vin: value.vin ?? undefined,
  color: value.color ?? undefined,
  transmission: value.transmission === "AUTOMATIC" ? "automatic" : "manual",
  ownershipId: value.ownershipId ?? value.currentOwnership?.id,
  currentOwnership: value.currentOwnership ? mapOwnership(value.currentOwnership) : null,
})
const customerPayload = (input: CustomerInput): CustomerInput => ({
  name: input.name.trim(), phone: input.phone.trim(),
  ...(input.email?.trim() ? { email: input.email.trim() } : {}),
})
const vehiclePayload = (input: VehicleInput) => ({
  ...input, make: input.make.trim(), model: input.model.trim(), plateNumber: input.plateNumber.trim(),
  ...(input.vin?.trim() ? { vin: input.vin.trim() } : {}),
  ...(input.color?.trim() ? { color: input.color.trim() } : {}),
  transmission: input.transmission.toUpperCase(),
})

export const customerService = {
  list: (params: CustomerListParams) => apiRequest<ApiPaginated<Customer>>({ url: "/customers", params }),
  async getById(id: number): Promise<CustomerDetails> {
    const response = await apiRequest<Customer & { currentVehicles: ApiVehicle[] }>({ url: `/customers/${id}` })
    return {
      ...response,
      currentVehicles: response.currentVehicles.map(mapVehicle),
    }
  },
  create: (input: CustomerInput) => apiRequest<Customer>({ method: "POST", url: "/customers", data: customerPayload(input) }),
  update: (id: number, input: CustomerInput) => apiRequest<Customer>({ method: "PATCH", url: `/customers/${id}`, data: customerPayload(input) }),
  deactivate: (id: number) => apiRequest<Customer>({ method: "PATCH", url: `/customers/${id}/deactivate` }),
  activate: (id: number) => apiRequest<Customer>({ method: "PATCH", url: `/customers/${id}/activate` }),
  async addVehicle(customerId: number, input: VehicleInput): Promise<Vehicle> {
    return mapVehicle(await apiRequest<ApiVehicle>({ method: "POST", url: "/vehicles", data: { customerId, ...vehiclePayload(input) } }))
  },
  transferOwnership: (vehicleId: number, customerId: number) => apiRequest<VehicleOwnership>({ method: "POST", url: `/vehicles/${vehicleId}/transfer-ownership`, data: { customerId } }),
  async getHistory(customerId: number, page = 1, limit = 20): Promise<CustomerHistoryPage> {
    const response = await apiRequest<{
      customer: unknown
      history: ApiPaginated<ApiCustomerHistoryItem>
    }>({
      url: `/customers/${customerId}/maintenance-history`,
      params: { page, limit },
    })
    return {
      data: response.history.items.map(mapHistoryItem),
      meta: response.history.meta,
    }
  },
}

interface ApiCustomerHistoryItem {
  id: number
  cardNumber: string
  status: "OPEN" | "CLOSED"
  receivedAt: string
  expectedDeliveryAt?: string | null
  mileage: number
  vehicleOwnership: {
    id: number
    startedAt: string
    endedAt?: string | null
    vehicle: { id: number; make: string; model: string; plateNumber: string; vin?: string | null }
  } | null
}

const mapHistoryItem = (item: ApiCustomerHistoryItem): CustomerHistoryItem => {
  const vehicle = item.vehicleOwnership?.vehicle
  return {
    id: item.id,
    receiptNumber: item.cardNumber,
    status: item.status,
    entryDate: item.receivedAt,
    deliveryDate: item.expectedDeliveryAt ?? null,
    mileage: item.mileage,
    vehicle: vehicle
      ? {
          id: vehicle.id,
          plateNumber: vehicle.plateNumber,
          make: vehicle.make,
          model: vehicle.model,
          vin: vehicle.vin ?? null,
        }
      : null,
  }
}
