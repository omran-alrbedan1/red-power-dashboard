import { useQuery } from "@tanstack/react-query"
import { customerService } from "../services/customer.service"
import { customerQueryKeys } from "../services/customer-query-keys"

export function useCustomer(
  customerId: string | undefined,
) {
  const id = Number(customerId)

  const isValidId =
    Number.isInteger(id) && id > 0

  const customerQuery = useQuery({
    queryKey: customerQueryKeys.detail(id),
    queryFn: () =>
      customerService.getById(id),
    enabled: isValidId,
  })

  const historyQuery = useQuery({
    queryKey: customerQueryKeys.history(id),
    queryFn: () =>
      customerService.getHistory(id),
    enabled:
      isValidId &&
      Boolean(customerQuery.data),
  })

  return {
    customer:
      customerQuery.data,

    vehicles:
      customerQuery.data
        ?.currentVehicles ?? [],

    history:
      historyQuery.data,

    isLoading:
      customerQuery.isLoading ||
      historyQuery.isLoading,

    isError:
      customerQuery.isError ||
      historyQuery.isError,

    error:
      customerQuery.error ||
      historyQuery.error,

    refetch: async () => {
      await Promise.all([
        customerQuery.refetch(),
        historyQuery.refetch(),
      ])
    },
  }
}