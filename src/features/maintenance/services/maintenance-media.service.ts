import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
import type { ApiSuccessResponse } from "@/lib/api/api.types"
import type { MaintenancePhoto, MaintenanceSignature } from "../types/maintenance-media.types"

export const maintenanceMediaService = {
  async listPhotos(cardId: string): Promise<MaintenancePhoto[]> {
    const response = await httpClient.get<ApiSuccessResponse<MaintenancePhoto[]>>(API_ENDPOINTS.maintenance.photos(cardId))
    return response.data.data
  },
  async uploadPhotos(cardId: string, files: File[]): Promise<MaintenancePhoto[]> {
    const body = new FormData()
    files.forEach((file) => body.append("files", file))
    const response = await httpClient.post<ApiSuccessResponse<MaintenancePhoto[]>>(API_ENDPOINTS.maintenance.photos(cardId), body)
    return response.data.data
  },
  async photoBlob(cardId: string, photoId: string): Promise<Blob> {
    const response = await httpClient.get<Blob>(API_ENDPOINTS.maintenance.photoContent(cardId, photoId), { responseType: "blob" })
    return response.data
  },
  async deletePhoto(cardId: string, photoId: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.maintenance.photo(cardId, photoId))
  },
  async getSignature(cardId: string): Promise<MaintenanceSignature> {
    const response = await httpClient.get<ApiSuccessResponse<MaintenanceSignature>>(API_ENDPOINTS.maintenance.signature(cardId))
    return response.data.data
  },
  async uploadSignature(cardId: string, file: File): Promise<MaintenanceSignature> {
    const body = new FormData()
    body.append("file", file)
    const response = await httpClient.post<ApiSuccessResponse<MaintenanceSignature>>(API_ENDPOINTS.maintenance.signature(cardId), body)
    return response.data.data
  },
  async signatureBlob(cardId: string): Promise<Blob> {
    const response = await httpClient.get<Blob>(API_ENDPOINTS.maintenance.signatureContent(cardId), { responseType: "blob" })
    return response.data
  },
  async deleteSignature(cardId: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.maintenance.signature(cardId))
  },
}
