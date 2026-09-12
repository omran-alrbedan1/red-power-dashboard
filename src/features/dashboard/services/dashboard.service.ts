import { apiRequest } from "@/lib/api/client"
import type { DashboardStats } from "../types/dashboard.types"


export const dashboardQueryKeys = {
  all: ["dashboard"] as const,

  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
}

export const dashboardApi = {
  getStats: () =>
    apiRequest<DashboardStats>({
      url: "/dashboard/stats",
    }),
}