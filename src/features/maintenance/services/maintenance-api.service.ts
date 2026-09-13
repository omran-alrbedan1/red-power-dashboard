import { apiRequest, apiUpload, apiDownload } from "@/lib/api/client"
import { cleanParams } from "@/lib/api/params"
import type { ApiPaginated } from "@/lib/api/contracts"
import type {
  ApiFuelLevel,
  ApiMaintenanceCardDetail,
  ApiMaintenanceCardListRow,
  ApiMaintenanceCardDetail as MaintenanceCardDetailApi,
  ApiWorkStatus,
  MaintenanceOption,
  MaintenanceOptionKind,
  MaintenancePhoto,
  MaintenanceSignature,
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

const API_FUEL_LEVELS: ApiFuelLevel[] = [
  "EMPTY",
  "QUARTER",
  "HALF",
  "THREE_QUARTERS",
  "FULL",
]

export const toApiFuelLevel = (value: string): ApiFuelLevel => {
  const upper = value.toUpperCase()
  return API_FUEL_LEVELS.includes(upper as ApiFuelLevel)
    ? (upper as ApiFuelLevel)
    : "HALF"
}

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

export type UpdateMaintenanceCardInput = Partial<
  Pick<
    CreateMaintenanceCardInput,
    | "expectedDeliveryAt"
    | "mileage"
    | "fuelLevel"
    | "customerComplaint"
    | "inspectionNotes"
    | "customerApproved"
    | "customerApprovalName"
    | "customerApprovedAt"
    | "visitReasonIds"
    | "vehicleConditionOptionIds"
    | "vehicleItemOptionIds"
  >
>

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

const toApiWorkStatus = (status: PersistedWorkStatus): ApiWorkStatus =>
  status.toUpperCase() as ApiWorkStatus

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
  update: (cardId: number, input: UpdateMaintenanceCardInput) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "PATCH", url: `/maintenance-cards/${cardId}`, data: input }).then(toDetail),
  options: (kind: MaintenanceOptionKind) =>
    apiRequest<MaintenanceOption[]>({ url: `/maintenance-card-options/${kind}`, params: { isActive: true } }),
  createWorkItem: ({ cardId, ...input }: CreateWorkItemInput) =>
    apiRequest<{ id: number }>({ method: "POST", url: `/maintenance-cards/${cardId}/required-works`, data: input }),
  updateWorkItem: (workItemId: number, { cardId, ...input }: UpdateWorkItemInput) =>
    apiRequest<{ id: number }>({ method: "PATCH", url: `/maintenance-cards/${cardId}/required-works/${workItemId}`, data: { ...input, ...(input.status ? { status: toApiWorkStatus(input.status) } : {}) } }),
  deleteWorkItem: (cardId: number, workItemId: number) =>
    apiRequest<void>({ method: "DELETE", url: `/maintenance-cards/${cardId}/required-works/${workItemId}` }),
  closeCard: (cardId: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "POST", url: `/maintenance-cards/${cardId}/close` }).then(toDetail),
  reopenCard: (cardId: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "POST", url: `/maintenance-cards/${cardId}/reopen` }).then(toDetail),
  uploadPhotos: (cardId: number, files: File[]) => {
    const form = new FormData()
    files.forEach((file) => form.append("files", file))
    return apiUpload<MaintenancePhoto[]>(`/maintenance-cards/${cardId}/photos`, form)
  },
  uploadSignature: (cardId: number, file: File) => {
    const form = new FormData()
    form.append("file", file)
    return apiUpload<MaintenanceSignature>(`/maintenance-cards/${cardId}/signature`, form)
  },
  downloadPhoto: (cardId: number, photoId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/photos/${photoId}/content`),
  downloadSignature: (cardId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/signature/content`),
}

function toDetail(detail: MaintenanceCardDetailApi): MaintenanceCardDetail {
  return mapDetail(detail)
}