import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useDeleteMaintenancePhoto() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, photoId }: { cardId: number; photoId: number }) => maintenanceApi.deletePhoto(cardId, photoId),
    onSuccess: (_data, { cardId, photoId }) => {
      queryClient.removeQueries({ queryKey: maintenanceQueryKeys.photoContent(cardId, photoId) })
      void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.photos(cardId) })
      toast.success(t("messages.photoDeleted"))
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("errors.photoDeleteFailed")),
  })
}

export function useDeleteMaintenanceSignature() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: number) => maintenanceApi.deleteSignature(cardId),
    onSuccess: (_data, cardId) => {
      queryClient.removeQueries({ queryKey: maintenanceQueryKeys.signatureContent(cardId) })
      void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.signature(cardId) })
      toast.success(t("messages.signatureDeleted"))
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("errors.signatureDeleteFailed")),
  })
}
