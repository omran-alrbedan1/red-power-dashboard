import { useMutation } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"

export function useUploadMaintenanceSignature() {
  return useMutation({
    mutationFn: ({ cardId, file }: { cardId: number; file: File }) =>
      maintenanceApi.uploadSignature(cardId, file),
  })
}