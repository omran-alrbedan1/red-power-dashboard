import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import { useAuth } from "@/features/auth/context/AuthContext"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"
import type { WorkStatus } from "../types/work-item.types"

export function useUpdateWorkItem() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      cardId,
      workItemId,
      updates,
    }: {
      cardId: string
      workItemId: string
      updates: Partial<{
        description: string
        estimatedCost: number | null
        displayOrder: number
        quantity: number
        progress: number
        assignee: string
        status: WorkStatus
        isRequired: boolean
      }>
    }) => {
      return maintenanceService.updateWorkItem(
        cardId,
        workItemId,
        updates,
        user?.name
      )
    },
    onSuccess: (_data, variables) => {
      // Use the cardId from mutation input for invalidation
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
    },
  })
}
