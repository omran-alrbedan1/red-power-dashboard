import { useMutation } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"

export function useUploadMaintenancePhotos() {
  return useMutation({
    mutationFn: ({ cardId, files }: { cardId: number; files: File[] }) =>
      maintenanceApi.uploadPhotos(cardId, files),
  })
}