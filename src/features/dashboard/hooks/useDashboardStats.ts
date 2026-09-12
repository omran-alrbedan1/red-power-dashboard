import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "@/features/maintenance/services/maintenance-api.service"
import { maintenanceQueryKeys } from "@/features/maintenance/services/maintenance-query-keys"

export function useDashboardStats() {
  return useQuery({
    queryKey: maintenanceQueryKeys.dashboardStats(),
    queryFn: () => maintenanceApi.dashboardStats(),
  })
}
