import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
import type { ApiSuccessResponse, PaginatedResponse } from "@/lib/api/api.types"
import type { CreateVehicleDto, OwnershipResponse, UpdateVehicleDto, Vehicle, VehicleHistoryParams, VehicleListParams, VehicleMaintenanceHistory, VehicleOwnership, VehicleWithOwner } from "../types/vehicle.types"

export const vehicleService = {
  async list(params: VehicleListParams): Promise<PaginatedResponse<VehicleWithOwner>> {
    const response = await httpClient.get<ApiSuccessResponse<PaginatedResponse<VehicleWithOwner>>>(API_ENDPOINTS.vehicles.list, { params })
    return response.data.data
  },
  async getById(id: string): Promise<VehicleWithOwner> {
    const response = await httpClient.get<ApiSuccessResponse<VehicleWithOwner>>(API_ENDPOINTS.vehicles.detail(id))
    return response.data.data
  },
  async create(input: CreateVehicleDto): Promise<VehicleWithOwner> {
    const response = await httpClient.post<ApiSuccessResponse<VehicleWithOwner>>(API_ENDPOINTS.vehicles.create, input)
    return response.data.data
  },
  async update(id: string, input: UpdateVehicleDto): Promise<Vehicle> {
    const response = await httpClient.patch<ApiSuccessResponse<Vehicle>>(API_ENDPOINTS.vehicles.update(id), input)
    return response.data.data
  },
  async setActive(id: string, isActive: boolean): Promise<Vehicle> {
    const endpoint = isActive ? API_ENDPOINTS.vehicles.activate(id) : API_ENDPOINTS.vehicles.deactivate(id)
    const response = await httpClient.patch<ApiSuccessResponse<Vehicle>>(endpoint)
    return response.data.data
  },
  async ownership(id: string): Promise<OwnershipResponse> {
    const response = await httpClient.get<ApiSuccessResponse<OwnershipResponse>>(API_ENDPOINTS.vehicles.ownership(id))
    return response.data.data
  },
  async transferOwnership(id: string, customerId: string): Promise<VehicleOwnership> {
    const response = await httpClient.post<ApiSuccessResponse<VehicleOwnership>>(API_ENDPOINTS.vehicles.transferOwnership(id), { customerId })
    return response.data.data
  },
  async maintenanceHistory(id: string, params: VehicleHistoryParams): Promise<VehicleMaintenanceHistory> {
    const response = await httpClient.get<ApiSuccessResponse<VehicleMaintenanceHistory>>(API_ENDPOINTS.vehicles.history(id), { params })
    return response.data.data
  },
}
