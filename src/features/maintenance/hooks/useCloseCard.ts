import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useCloseCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: number) => maintenanceApi.closeCard(cardId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(variables)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(variables)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.dashboardStats() })
    },
  })
}
