export const MAINTENANCE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
export const MAX_MAINTENANCE_PHOTO_BYTES = 8 * 1024 * 1024
export const MAX_MAINTENANCE_SIGNATURE_BYTES = 4 * 1024 * 1024
export const MAX_PHOTOS_PER_UPLOAD = 20

export interface MaintenancePhoto {
  id: string
  originalFileName: string | null
  mimeType: string | null
  sizeBytes: string | null
  displayOrder: number
  createdAt: string
  contentUrl: string
}

export interface MaintenanceSignature {
  mimeType: string
  sizeBytes: string
  contentUrl: string
}
