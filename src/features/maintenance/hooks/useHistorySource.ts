import { useQuery } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"

/**
 * @deprecated Use `customerService.getHistory` (via `useCustomer`) which reads
 * the dedicated /customers/:id/maintenance-history endpoint.
 */
export function useHistorySource(customerId: string | undefined) {
  const id = customerId ?? ""
  return useQuery({
    queryKey: ["history", "cards", id],
    queryFn: () => maintenanceService.getCardsByCustomer(Number(id)),
    enabled: Boolean(id),
  })
}
