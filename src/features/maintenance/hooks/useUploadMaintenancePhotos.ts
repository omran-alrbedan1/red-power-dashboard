import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useUploadMaintenancePhotos() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, files }: { cardId: number; files: File[] }) =>
      maintenanceApi.uploadPhotos(cardId, files),
    onSuccess: (_data, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.photos(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      toast.success(t("messages.photosUploaded", "Photos uploaded successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.mediaUploadFailed", "Failed to upload photos"))
    },
  })
}