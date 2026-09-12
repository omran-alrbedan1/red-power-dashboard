import { useQuery } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"

export function useHistorySource(customerId: string | undefined) {
  const id = customerId ?? ""
  return useQuery({
    queryKey: ["history", "cards", id],
    queryFn: () => maintenanceService.getCardsByCustomer(Number(id)),
    enabled: Boolean(id),
  })
}
