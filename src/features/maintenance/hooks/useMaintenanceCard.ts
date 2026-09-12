import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

const STALE_TIME = 30 * 1000
const GC_TIME = 5 * 60 * 1000

export function useMaintenanceCard(cardId: string | undefined) {
  const id = cardId ?? ""
  return useQuery({
    queryKey: maintenanceQueryKeys.detail(id),
    queryFn: () => maintenanceApi.getById(Number(id)),
    enabled: Boolean(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}