import { useQuery } from "@tanstack/react-query"
import { customerService } from "../services/customer.service"
import { customerQueryKeys } from "./useCustomers"

export function useCustomer(customerId: string | undefined) {
  const id = customerId ?? ""
  return useQuery({
    queryKey: customerQueryKeys.detail(id),
    queryFn: () => customerService.getById(id),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      const status = "statusCode" in error ? error.statusCode : undefined
      return status === 404 ? false : failureCount < 2
    },
  })
}
