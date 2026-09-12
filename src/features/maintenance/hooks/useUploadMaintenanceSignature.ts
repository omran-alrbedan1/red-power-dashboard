import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useUploadMaintenanceSignature() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, file }: { cardId: number; file: File }) =>
      maintenanceApi.uploadSignature(cardId, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(data.id)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      toast.success(t("messages.signatureUploaded", "Signature uploaded successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.mediaUploadFailed", "Failed to upload the signature"))
    },
  })
}