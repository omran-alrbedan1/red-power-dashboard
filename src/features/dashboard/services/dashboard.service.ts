import { apiRequest } from "@/lib/api/client"
import type { DashboardStats } from "../types/dashboard.types"


export const dashboardApi = {
  getStats: () =>
    apiRequest<DashboardStats>({
      url: "/dashboard/stats",
    }),
}