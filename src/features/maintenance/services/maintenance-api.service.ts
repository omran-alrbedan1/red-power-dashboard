import { apiRequest, apiUpload, apiDownload, ApiError } from "@/lib/api/client"
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
  PersistedFuelLevel,
  PersistedWorkStatus,
} from "../types/maintenance-detail.types"
import { mapDetail, mapListRow } from "./maintenance.mapper"

export type { MaintenanceOptionKind, CreateMaintenanceCardInput }
export type { ApiFuelLevel } from "../types/api-maintenance.types"

export type FuelLevel = PersistedFuelLevel

export interface SelectorVehicle {
  id: number
  make: string
  model: string
  plateNumber: string
  manufactureYear: number
  vin?: string
  currentOwnership: { id: number; customerId: number } | null
}

interface ApiSelectorVehicle {
  id: number
  make: string
  model: string
  plateNumber: string
  manufactureYear: number
  vin?: string | null
  ownershipId?: number
  currentOwnership?: { id: number; customerId: number } | null
}

const toSelectorVehicle = (
  vehicle: ApiSelectorVehicle,
  ownerCustomerId: number
): SelectorVehicle => {
  const ownershipId = vehicle.ownershipId ?? vehicle.currentOwnership?.id
  return {
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    plateNumber: vehicle.plateNumber,
    manufactureYear: vehicle.manufactureYear,
    vin: vehicle.vin ?? undefined,
    currentOwnership: ownershipId
      ? { id: ownershipId, customerId: vehicle.currentOwnership?.customerId ?? ownerCustomerId }
      : null,
  }
}

export const toApiFuelLevel = (level: PersistedFuelLevel): ApiFuelLevel => {
  switch (level) {
    case "empty":
      return "EMPTY"
    case "quarter":
      return "QUARTER"
    case "half":
      return "HALF"
    case "three_quarters":
      return "THREE_QUARTERS"
    case "full":
      return "FULL"
  }
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

export interface UpdateMaintenanceCardInput {
  expectedDeliveryAt?: string | null
  mileage?: number
  fuelLevel?: ApiFuelLevel
  customerComplaint?: string
  inspectionNotes?: string
  customerApproved?: boolean
  customerApprovalName?: string
  customerApprovedAt?: string
  visitReasonIds?: number[]
  vehicleConditionOptionIds?: number[]
  vehicleItemOptionIds?: number[]
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
  customerVehicles: async (customerId: number) => {
    const response = await apiRequest<{ currentVehicles?: ApiSelectorVehicle[] }>({
      url: `/customers/${customerId}`,
    })
    return (response.currentVehicles ?? []).map((vehicle) => toSelectorVehicle(vehicle, customerId))
  },
  getById: (id: number) =>
    apiRequest<ApiMaintenanceCardDetail>({ url: `/maintenance-cards/${id}` }).then(toDetail),
  update: (cardId: number, input: UpdateMaintenanceCardInput) =>
    apiRequest<ApiMaintenanceCardDetail>({ method: "PATCH", url: `/maintenance-cards/${cardId}`, data: input }).then(toDetail),
    options: (kind: MaintenanceOptionKind) =>
      apiRequest<ApiPaginated<MaintenanceOption>>({
        url: `/maintenance-card-options/${kind}`,
        params: { isActive: true },
      }).then((page) => page.items),
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
  deletePhoto: (cardId: number, photoId: number) =>
    apiRequest<void>({ method: "DELETE", url: `/maintenance-cards/${cardId}/photos/${photoId}` }),
  deleteSignature: (cardId: number) =>
    apiRequest<void>({ method: "DELETE", url: `/maintenance-cards/${cardId}/signature` }),
  getPhotos: (cardId: number) =>
    apiRequest<MaintenancePhoto[]>({ url: `/maintenance-cards/${cardId}/photos` }),
  getSignature: async (cardId: number) => {
    try {
      return await apiRequest<MaintenanceSignature | null>({
        url: `/maintenance-cards/${cardId}/signature`,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  },
  downloadPhoto: (cardId: number, photoId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/photos/${photoId}/content`),
  downloadSignature: (cardId: number) =>
    apiDownload(`/maintenance-cards/${cardId}/signature/content`),
}

function toDetail(detail: MaintenanceCardDetailApi): MaintenanceCardDetail {
  return mapDetail(detail)
}
