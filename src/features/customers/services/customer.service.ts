import { apiRequest } from "@/lib/api/client"
import type { ApiPaginated } from "@/lib/api/contracts"
import type { Customer } from "../types/customer.types"
import type { Vehicle, TransmissionType, VehicleOwnership } from "../types/vehicle.types"
import type { CustomerHistory } from "../types/visit-summary.types"

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
  getById: (id: number) => apiRequest<Customer & { currentVehicles: ApiVehicle[] }>({ url: `/customers/${id}` }),
  async listVehicles(customerId: number): Promise<Vehicle[]> {
    return (await this.getById(customerId)).currentVehicles.map(mapVehicle)
  },
  create: (input: CustomerInput) => apiRequest<Customer>({ method: "POST", url: "/customers", data: customerPayload(input) }),
  update: (id: number, input: CustomerInput) => apiRequest<Customer>({ method: "PATCH", url: `/customers/${id}`, data: customerPayload(input) }),
  async addVehicle(customerId: number, input: VehicleInput): Promise<Vehicle> {
    return mapVehicle(await apiRequest<ApiVehicle>({ method: "POST", url: "/vehicles", data: { customerId, ...vehiclePayload(input) } }))
  },
  transferOwnership: (vehicleId: number, customerId: number) => apiRequest<VehicleOwnership>({ method: "POST", url: `/vehicles/${vehicleId}/transfer-ownership`, data: { customerId } }),
  async getHistory(customerId: number): Promise<CustomerHistory> {
    const response = await apiRequest<{ history: ApiPaginated<{ id: number; cardNumber: string; receivedAt: string; status: string; vehicleOwnership: { vehicle: { id: number } } }> }>({
      url: `/customers/${customerId}/maintenance-history`, params: { page: 1, limit: 20 },
    })
    return {
      visits: response.history.items.map((card) => ({
        id: String(card.id), vehicleId: String(card.vehicleOwnership.vehicle.id), receiptNumber: card.cardNumber,
        date: card.receivedAt, reason: "", status: card.status.toLowerCase() as CustomerHistory["visits"][number]["status"],
      })), workItems: [],
    }
  },
}
