import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useDeleteWorkItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { workItemId: number; cardId: number }) => {
      return maintenanceApi.deleteWorkItem(variables.cardId, variables.workItemId)
    },
    onSuccess: (_data, variables) => {
      // Use the cardId from mutation input for invalidation
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(variables.cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(variables.cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.dashboardStats() })
    },
  })
}
