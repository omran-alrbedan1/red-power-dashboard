import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import type { MaintenanceOptionKind } from "../services/maintenance-api.service"

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000

export function useMaintenanceOptions(kind: MaintenanceOptionKind) {
  return useQuery({
    queryKey: maintenanceQueryKeys.options(kind),
    queryFn: () => maintenanceApi.options(kind),
    retry: 1,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}