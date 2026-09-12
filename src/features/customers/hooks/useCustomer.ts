import { useQuery } from "@tanstack/react-query"
import { customerService } from "../services/customer.service"

export function useCustomer(customerId: string | undefined) {
  const id = Number(customerId)

  const customerQuery = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getById(id),
    enabled: Number.isInteger(id) && id > 0,
  })

  const vehiclesQuery = useQuery({
    queryKey: ["customer", id, "vehicles"],
    queryFn: () => customerService.listVehicles(id),
    enabled: Number.isInteger(id) && id > 0 && !!customerQuery.data,
  })

  const historyQuery = useQuery({
    queryKey: ["customer", id, "history"],
    queryFn: () => customerService.getHistory(id),
    enabled: Number.isInteger(id) && id > 0 && !!customerQuery.data,
  })

  return {
    customer: customerQuery.data,
    vehicles: vehiclesQuery.data ?? [],
    history: historyQuery.data,
    isLoading:
      customerQuery.isLoading || vehiclesQuery.isLoading || historyQuery.isLoading,
    isError:
      customerQuery.isError || vehiclesQuery.isError || historyQuery.isError,
    error: customerQuery.error || vehiclesQuery.error || historyQuery.error,
    refetch: () => {
      customerQuery.refetch()
      vehiclesQuery.refetch()
      historyQuery.refetch()
    },
  }
}
