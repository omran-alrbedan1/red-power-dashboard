import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
import type { ApiSuccessResponse, PaginatedResponse } from "@/lib/api/api.types"
import type { CreateMaintenanceCardInput, MaintenanceCard, MaintenanceCardListItem, MaintenanceListParams, MaintenanceOption, MaintenanceOptionKind, RequiredWork, RequiredWorkInput, UpdateMaintenanceCardInput, UpdateRequiredWorkInput } from "../types/maintenance.types"

type RawWork = Omit<RequiredWork, "estimatedCost"> & { estimatedCost: string | number | null }
type RawCard = Omit<MaintenanceCard, "requiredWorks"> & { requiredWorks: RawWork[] }

const mapWork = (work: RawWork): RequiredWork => ({
  ...work,
  estimatedCost: work.estimatedCost == null ? null : Number(work.estimatedCost),
})
const mapCard = (card: RawCard): MaintenanceCard => ({ ...card, requiredWorks: card.requiredWorks.map(mapWork) })

export const maintenanceService = {
  async list(params: MaintenanceListParams): Promise<PaginatedResponse<MaintenanceCardListItem>> {
    const response = await httpClient.get<ApiSuccessResponse<PaginatedResponse<MaintenanceCardListItem>>>(API_ENDPOINTS.maintenance.list, { params })
    return response.data.data
  },
  async getById(id: string): Promise<MaintenanceCard> {
    const response = await httpClient.get<ApiSuccessResponse<RawCard>>(API_ENDPOINTS.maintenance.detail(id))
    return mapCard(response.data.data)
  },
  async create(input: CreateMaintenanceCardInput): Promise<MaintenanceCard> {
    const response = await httpClient.post<ApiSuccessResponse<RawCard>>(API_ENDPOINTS.maintenance.create, input)
    return mapCard(response.data.data)
  },
  async update(id: string, input: UpdateMaintenanceCardInput): Promise<MaintenanceCard> {
    const response = await httpClient.patch<ApiSuccessResponse<RawCard>>(API_ENDPOINTS.maintenance.update(id), input)
    return mapCard(response.data.data)
  },
  async close(id: string): Promise<MaintenanceCard> {
    const response = await httpClient.post<ApiSuccessResponse<RawCard>>(API_ENDPOINTS.maintenance.close(id))
    return mapCard(response.data.data)
  },
  async reopen(id: string): Promise<MaintenanceCard> {
    const response = await httpClient.post<ApiSuccessResponse<RawCard>>(API_ENDPOINTS.maintenance.reopen(id))
    return mapCard(response.data.data)
  },
  async createWork(cardId: string, input: RequiredWorkInput): Promise<RequiredWork> {
    const response = await httpClient.post<ApiSuccessResponse<RawWork>>(API_ENDPOINTS.maintenance.works(cardId), input)
    return mapWork(response.data.data)
  },
  async updateWork(cardId: string, workId: string, input: UpdateRequiredWorkInput): Promise<RequiredWork> {
    const response = await httpClient.patch<ApiSuccessResponse<RawWork>>(API_ENDPOINTS.maintenance.work(cardId, workId), input)
    return mapWork(response.data.data)
  },
  async deleteWork(cardId: string, workId: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.maintenance.work(cardId, workId))
  },
  async options(kind: MaintenanceOptionKind): Promise<MaintenanceOption[]> {
    const response = await httpClient.get<ApiSuccessResponse<MaintenanceOption[]>>(API_ENDPOINTS.maintenance.options(kind), { params: { isActive: true } })
    return response.data.data
  },
}
