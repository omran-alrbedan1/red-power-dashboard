import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

const STALE_TIME = 30 * 1000
const GC_TIME = 5 * 60 * 1000

export function useMaintenanceActivity(cardId: string | undefined, limit = 50) {
  const id = Number(cardId)
  const enabled = Number.isInteger(id) && id > 0

  return useQuery({
    queryKey: maintenanceQueryKeys.workActivity(cardId ?? ""),
    queryFn: () =>
      maintenanceApi.getActivity(id, { limit }).then((page) => page.items),
    enabled,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}