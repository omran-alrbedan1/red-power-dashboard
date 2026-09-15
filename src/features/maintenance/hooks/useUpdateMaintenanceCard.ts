import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { maintenanceApi } from "../services/maintenance-api.service"
import type { UpdateMaintenanceCardInput } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

interface UpdateMaintenanceCardVariables {
  cardId: number
  input: UpdateMaintenanceCardInput
}

export function useUpdateMaintenanceCard() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, input }: UpdateMaintenanceCardVariables) =>
      maintenanceApi.update(cardId, input),
    onSuccess: (_data, variables) => {
      const cardId = String(variables.cardId)
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(cardId) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.workActivity(cardId) })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
      toast.success(t("messages.cardUpdated", "Card updated successfully"))
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("errors.updateFailed", "Failed to update the card"),
      )
    },
  })
}