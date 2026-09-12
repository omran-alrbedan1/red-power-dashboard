import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import type { ApiPaginated } from "@/lib/api/contracts"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

const STALE_TIME = 30 * 1000
const GC_TIME = 5 * 60 * 1000

interface SelectorCustomer { id: number; name: string; phone: string; email?: string }
interface SelectorVehicle {
  id: number; make: string; model: string; plateNumber: string; manufactureYear: number; vin?: string
  currentOwnership: { id: number; customerId: number } | null
}

export function useSelectorData() {
  return useQuery({
    queryKey: maintenanceQueryKeys.selectorData(),
    queryFn: async () => {
      const [customers, vehicles] = await Promise.all([
        apiRequest<ApiPaginated<SelectorCustomer>>({ url: "/customers", params: { page: 1, limit: 100 } }),
        apiRequest<ApiPaginated<SelectorVehicle>>({ url: "/vehicles", params: { page: 1, limit: 100 } }),
      ])
      return { customers: customers.items, vehicles: vehicles.items.filter((vehicle) => vehicle.currentOwnership) }
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}