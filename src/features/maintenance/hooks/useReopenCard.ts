import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/context/AuthContext"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

export function useReopenCard() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (cardId: number) => {
      // Only super admins can reopen cards
      if (user?.role !== "super_admin") {
        throw new Error("UNAUTHORIZED: Only super admins can reopen cards")
      }
      return maintenanceApi.reopenCard(cardId)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(String(variables)) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(String(variables)) })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
    },
  })
}
