import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

export function useCloseCard() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: number) => maintenanceApi.closeCard(cardId),
    onSuccess: (_data, cardId) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
      toast.success(t("messages.cardClosed", "Card closed successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.closeFailed", "Failed to close the card"))
    },
  })
}