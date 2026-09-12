import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useMaintenanceCard(cardId: string | undefined) {
  const id = cardId ?? ""
  return useQuery({
    queryKey: maintenanceQueryKeys.detail(id),
    queryFn: () => maintenanceApi.getById(Number(id)),
    enabled: Boolean(id),
  })
}

export function useUpdateMaintenanceCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: Parameters<typeof maintenanceService.update>[1]
    }) => maintenanceService.update(id, patch),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: ["history"] })
    },
  })
}