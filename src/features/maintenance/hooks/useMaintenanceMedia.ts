import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiClientError } from "@/lib/api/api-error"
import { maintenanceMediaService } from "../services/maintenance-media.service"
import { maintenanceQueryKeys } from "./useMaintenanceCards"

export const maintenanceMediaQueryKeys = {
  all: (cardId: string) => [...maintenanceQueryKeys.detail(cardId), "media"] as const,
  photos: (cardId: string) => [...maintenanceMediaQueryKeys.all(cardId), "photos"] as const,
  photoBlob: (cardId: string, photoId: string) => [...maintenanceMediaQueryKeys.photos(cardId), photoId, "blob"] as const,
  signature: (cardId: string) => [...maintenanceMediaQueryKeys.all(cardId), "signature"] as const,
  signatureBlob: (cardId: string) => [...maintenanceMediaQueryKeys.signature(cardId), "blob"] as const,
}

const refreshCard = (client: ReturnType<typeof useQueryClient>, cardId: string) => {
  void client.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(cardId) })
}

export function useMaintenancePhotos(cardId: string) {
  return useQuery({ queryKey: maintenanceMediaQueryKeys.photos(cardId), queryFn: () => maintenanceMediaService.listPhotos(cardId), enabled: Boolean(cardId) })
}
export function useMaintenancePhotoBlob(cardId: string, photoId: string) {
  return useQuery({ queryKey: maintenanceMediaQueryKeys.photoBlob(cardId, photoId), queryFn: () => maintenanceMediaService.photoBlob(cardId, photoId), enabled: Boolean(cardId && photoId), staleTime: Infinity })
}
export function useUploadMaintenancePhotos() {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ cardId, files }: { cardId: string; files: File[] }) => maintenanceMediaService.uploadPhotos(cardId, files), onSuccess: (_data, { cardId }) => { void client.invalidateQueries({ queryKey: maintenanceMediaQueryKeys.photos(cardId) }); refreshCard(client, cardId) } })
}
export function useDeleteMaintenancePhoto() {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ cardId, photoId }: { cardId: string; photoId: string }) => maintenanceMediaService.deletePhoto(cardId, photoId), onSuccess: (_data, { cardId, photoId }) => { client.removeQueries({ queryKey: maintenanceMediaQueryKeys.photoBlob(cardId, photoId) }); void client.invalidateQueries({ queryKey: maintenanceMediaQueryKeys.photos(cardId) }); refreshCard(client, cardId) } })
}
export function useMaintenanceSignature(cardId: string, present: boolean) {
  return useQuery({ queryKey: maintenanceMediaQueryKeys.signature(cardId), queryFn: () => maintenanceMediaService.getSignature(cardId), enabled: Boolean(cardId && present), retry: (count, error) => !(error instanceof ApiClientError && error.statusCode === 404) && count < 2 })
}
export function useMaintenanceSignatureBlob(cardId: string, present: boolean) {
  return useQuery({ queryKey: maintenanceMediaQueryKeys.signatureBlob(cardId), queryFn: () => maintenanceMediaService.signatureBlob(cardId), enabled: Boolean(cardId && present), staleTime: Infinity })
}
export function useUploadMaintenanceSignature() {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ cardId, file }: { cardId: string; file: File }) => maintenanceMediaService.uploadSignature(cardId, file), onSuccess: (_data, { cardId }) => { client.removeQueries({ queryKey: maintenanceMediaQueryKeys.signatureBlob(cardId) }); void client.invalidateQueries({ queryKey: maintenanceMediaQueryKeys.signature(cardId) }); refreshCard(client, cardId) } })
}
export function useDeleteMaintenanceSignature() {
  const client = useQueryClient()
  return useMutation({ mutationFn: maintenanceMediaService.deleteSignature, onSuccess: (_data, cardId) => { client.removeQueries({ queryKey: maintenanceMediaQueryKeys.signatureBlob(cardId) }); client.removeQueries({ queryKey: maintenanceMediaQueryKeys.signature(cardId) }); refreshCard(client, cardId) } })
}
