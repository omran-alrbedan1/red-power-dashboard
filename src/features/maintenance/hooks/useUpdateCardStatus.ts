import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import { useAuth } from "@/features/auth/context/AuthContext"
import type { MaintenanceStatus } from "../types/maintenance.types"

export function useUpdateCardStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      cardId,
      status,
    }: {
      cardId: string
      status: MaintenanceStatus
    }) => {
      return maintenanceService.updateCardStatus(cardId, status, user?.name)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenance", "card", data?.id] })
      queryClient.invalidateQueries({ queryKey: ["activity", "timeline", data?.id] })
      queryClient.invalidateQueries({ queryKey: ["maintenance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "maintenance-status-counts"] })
    },
  })
}
