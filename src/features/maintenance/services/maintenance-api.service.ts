import { apiRequest, apiUpload, apiDownload } from "@/lib/api/client"
import { cleanParams } from "@/lib/api/params"
import type { ApiPaginated } from "@/lib/api/contracts"
import type {
  ApiMaintenanceCardDetail,
  ApiMaintenanceCardListRow,
  ApiMaintenanceCardDetail as MaintenanceCardDetailApi,
  MaintenanceOption,
  MaintenanceOptionKind,
  CreateMaintenanceCardInput,
} from "../types/api-maintenance.types"
import type {
  MaintenanceCardDetail,
  MaintenanceCardListRow,
  PersistedWorkStatus,
} from "../types/maintenance-detail.types"
import { mapDetail, mapListRow } from "./maintenance.mapper"

export type { MaintenanceOptionKind, CreateMaintenanceCardInput }
export type { ApiFuelLevel } from "../types/api-maintenance.types"

export type FuelLevel = CreateMaintenanceCardInput["fuelLevel"]

export interface MaintenanceCardListParams {
  page: number
  limit?: number
  search?: string
  status?: MaintenanceCardListRow["status"]
  customerId?: number
  vehicleId?: number
  receivedFrom?: string
  receivedTo?: string
}

export interface CreateWorkItemInput {
  cardId: number
  description: string
  isRequired: boolean
  estimatedCost?: number
  displayOrder: number
}

export interface UpdateWorkItemInput {
  cardId: number
  description?: string
  isRequired?: boolean
  estimatedCost?: number | null
  displayOrder?: number
  status?: PersistedWorkStatus
}

export const maintenanceApi = {
  create: (input: CreateMaintenanceCardInput) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "POST", url: "/maintenance-cards", data: input }).then(toDetail),
  list: (params: MaintenanceCardListParams) =>
    apiRequest<ApiPaginated<ApiMaintenanceCardListRow>>({
      url: "/maintenance-cards",
      params: cleanParams({ ...params }),
    }).then(
      (page) => ({
        ...page,
        items: page.items.map(mapListRow),
      }),
    ),
  getById: (id: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ url: `/maintenance-cards/${id}` }).then(toDetail),
  options: (kind: MaintenanceOptionKind) =>
    apiRequest<MaintenanceOption[]>({ url: `/maintenance-card-options/${kind}`, params: { isActive: true } }),
  createWorkItem: ({ cardId, ...input }: CreateWorkItemInput) =>
    apiRequest<{ id: number }>({ method: "POST", url: `/maintenance-cards/${cardId}/required-works`, data: input }),
  updateWorkItem: (workItemId: number, { cardId, ...input }: UpdateWorkItemInput) =>
    apiRequest<{ id: number }>({ method: "PATCH", url: `/maintenance-cards/${cardId}/required-works/${workItemId}`, data: { ...input, ...(input.status ? { status: input.status.toUpperCase() } : {}) } }),
  deleteWorkItem: (cardId: number, workItemId: number) =>
    apiRequest<void>({ method: "DELETE", url: `/maintenance-cards/${cardId}/required-works/${workItemId}` }),
  closeCard: (cardId: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "POST", url: `/maintenance-cards/${cardId}/close` }).then(toDetail),
  reopenCard: (cardId: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "POST", url: `/maintenance-cards/${cardId}/reopen` }).then(toDetail),
  uploadPhotos: (cardId: number, files: File[]) => {
    const form = new FormData()
    files.forEach((file) => form.append("files", file))
    return apiUpload<ApiMaintenanceCardDetail>(`/maintenance-cards/${cardId}/photos`, form).then(toDetail)
  },
  uploadSignature: (cardId: number, file: File) => {
    const form = new FormData()
    form.append("file", file)
    return apiUpload<ApiMaintenanceCardDetail>(`/maintenance-cards/${cardId}/signature`, form).then(toDetail)
  },
  downloadPhoto: (cardId: number, photoId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/photos/${photoId}`),
  downloadSignature: (cardId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/signature`),
}

function toDetail(detail: MaintenanceCardDetailApi): MaintenanceCardDetail {
  return mapDetail(detail)
}