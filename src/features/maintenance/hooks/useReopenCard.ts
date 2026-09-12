import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useAuth } from "@/features/auth/context/AuthContext"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

export function useReopenCard() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (cardId: number) => {
      // Only super admins can reopen cards
      if (user?.role !== "super_admin") {
        throw new Error(t("errors.reopenUnauthorized", "Only super admins can reopen cards"))
      }
      return maintenanceApi.reopenCard(cardId)
    },
    onSuccess: (_data, cardId) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(cardId)) })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
      toast.success(t("messages.cardReopened", "Card reopened successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.reopenFailed", "Failed to reopen the card"))
    },
  })
}