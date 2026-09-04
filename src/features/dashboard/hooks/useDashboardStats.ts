import { useQuery } from "@tanstack/react-query"
import { maintenanceService } from "@/features/maintenance/services/maintenance.service"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "maintenance-status-counts"],
    queryFn: () => maintenanceService.getStatusCounts(),
  })
}
