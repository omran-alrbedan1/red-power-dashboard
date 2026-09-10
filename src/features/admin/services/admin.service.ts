import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
import type { ApiSuccessResponse, PaginatedResponse } from "@/lib/api/api.types"
import type { MaintenanceOptionKind } from "@/features/maintenance/types/maintenance.types"
import type { AdminMaintenanceOption, AdminUser, OptionInput, UsersParams } from "../types/admin.types"
export const adminService = {
  async users(params: UsersParams) { const r = await httpClient.get<ApiSuccessResponse<PaginatedResponse<AdminUser>>>(API_ENDPOINTS.users.list, { params }); return r.data.data },
  async user(id: string) { const r = await httpClient.get<ApiSuccessResponse<AdminUser>>(API_ENDPOINTS.users.detail(id)); return r.data.data },
  async options(kind: MaintenanceOptionKind) { const r = await httpClient.get<ApiSuccessResponse<AdminMaintenanceOption[]>>(API_ENDPOINTS.maintenance.options(kind)); return r.data.data },
  async createOption(kind: MaintenanceOptionKind, input: OptionInput) { const r = await httpClient.post<ApiSuccessResponse<AdminMaintenanceOption>>(API_ENDPOINTS.maintenance.options(kind), input); return r.data.data },
  async updateOption(kind: MaintenanceOptionKind, id: string, input: Partial<OptionInput>) { const r = await httpClient.patch<ApiSuccessResponse<AdminMaintenanceOption>>(API_ENDPOINTS.maintenance.option(kind,id), input); return r.data.data },
  async setOptionActive(kind: MaintenanceOptionKind, id: string, active: boolean) { const url = active ? API_ENDPOINTS.maintenance.activateOption(kind,id) : API_ENDPOINTS.maintenance.deactivateOption(kind,id); const r = await httpClient.patch<ApiSuccessResponse<AdminMaintenanceOption>>(url); return r.data.data },
  async deleteOption(kind: MaintenanceOptionKind, id: string) { await httpClient.delete(API_ENDPOINTS.maintenance.option(kind,id)) },
}
