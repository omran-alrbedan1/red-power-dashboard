import { useQuery } from "@tanstack/react-query"

import { dashboardQueryKeys } from "../services/dashboard-query-keys"
import type { DashboardStats } from "../types/dashboard.types"
import { dashboardApi } from "../services/dashboard.service"

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: dashboardApi.getStats,
  })
}