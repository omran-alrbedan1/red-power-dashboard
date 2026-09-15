import { useQuery } from "@tanstack/react-query"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { maintenanceApi } from "../services/maintenance-api.service"

const STALE_TIME = 30 * 1000
const GC_TIME = 5 * 60 * 1000

export function useCustomerVehicles(customerId: number | null | undefined) {
  return useQuery({
    queryKey: maintenanceQueryKeys.customerVehicles(customerId ?? 0),
    queryFn: () => maintenanceApi.customerVehicles(customerId as number),
    enabled: customerId != null,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}