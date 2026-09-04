import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/context/AuthContext"
import { maintenanceService } from "../services/maintenance.service"

export function useCloseCard() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (cardId: string) => maintenanceService.closeCard(cardId, user?.name),
    onSuccess: (card) => {
      if (!card) return
      queryClient.invalidateQueries({ queryKey: ["maintenance", "card", card.id] })
      queryClient.invalidateQueries({ queryKey: ["maintenance", "list"] })
      queryClient.invalidateQueries({ queryKey: ["activity", "timeline", card.id] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "maintenance-status-counts"] })
    },
  })
}
