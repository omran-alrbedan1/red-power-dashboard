import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useCardDetailForHistory(cardId: number | undefined) {
  return useQuery({
    queryKey: maintenanceQueryKeys.detail(cardId?.toString() || ""),
    queryFn: () => maintenanceApi.getById(cardId!),
    enabled: Boolean(cardId),
  })
}
