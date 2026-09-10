import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
import type { ApiSuccessResponse, PaginatedResponse } from "@/lib/api/api.types"
import type {
  CreateCustomerDto,
  Customer,
  CustomerDetails,
  CustomerListParams,
  UpdateCustomerDto,
  MaintenanceHistoryParams,
  CustomerMaintenanceHistory,
} from "../types/customer.types"

export const customerService = {
  async list(params: CustomerListParams): Promise<PaginatedResponse<Customer>> {
    const response = await httpClient.get<ApiSuccessResponse<PaginatedResponse<Customer>>>(
      API_ENDPOINTS.customers.list,
      { params },
    )
    return response.data.data
  },

  async getById(id: string): Promise<CustomerDetails> {
    const response = await httpClient.get<ApiSuccessResponse<CustomerDetails>>(
      API_ENDPOINTS.customers.detail(id),
    )
    return response.data.data
  },

  async create(input: CreateCustomerDto): Promise<Customer> {
    const response = await httpClient.post<ApiSuccessResponse<Customer>>(
      API_ENDPOINTS.customers.create,
      input,
    )
    return response.data.data
  },

  async update(id: string, input: UpdateCustomerDto): Promise<Customer> {
    const response = await httpClient.patch<ApiSuccessResponse<Customer>>(
      API_ENDPOINTS.customers.update(id),
      input,
    )
    return response.data.data
  },

  async setActive(id: string, isActive: boolean): Promise<Customer> {
    const endpoint = isActive ? API_ENDPOINTS.customers.activate(id) : API_ENDPOINTS.customers.deactivate(id)
    const response = await httpClient.patch<ApiSuccessResponse<Customer>>(endpoint)
    return response.data.data
  },

  async maintenanceHistory(id: string, params: MaintenanceHistoryParams): Promise<CustomerMaintenanceHistory> {
    const response = await httpClient.get<ApiSuccessResponse<CustomerMaintenanceHistory>>(
      API_ENDPOINTS.customers.history(id),
      { params },
    )
    return response.data.data
  },
}
