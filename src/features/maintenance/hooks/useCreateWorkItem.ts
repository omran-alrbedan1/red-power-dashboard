import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceApi, type CreateWorkItemInput } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

export function useCreateWorkItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateWorkItemInput) => maintenanceApi.createWorkItem(input),
    onSuccess: (_data, variables) => {
      // Use the cardId from mutation input for invalidation
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(variables.cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(variables.cardId)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
    },
  })
}
