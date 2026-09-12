import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "@/features/maintenance/services/maintenance-api.service"
import { maintenanceQueryKeys } from "@/features/maintenance/services/maintenance-query-keys"
import type { DashboardStats } from "../types/dashboard.types"

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: maintenanceQueryKeys.dashboardStats(),
    queryFn: () => maintenanceApi.dashboardStats(),
  })
}
