import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerService } from "../services/customer.service"
import type { CreateCustomerDto, CustomerListParams, UpdateCustomerDto } from "../types/customer.types"
import type { MaintenanceHistoryParams } from "../types/customer.types"

export const customerQueryKeys = {
  all: ["customers"] as const,
  lists: () => [...customerQueryKeys.all, "list"] as const,
  list: (params: CustomerListParams) => [...customerQueryKeys.lists(), params] as const,
  details: () => [...customerQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...customerQueryKeys.details(), id] as const,
  history: (id: string, params: MaintenanceHistoryParams) => [...customerQueryKeys.detail(id), "history", params] as const,
}

export function useSetCustomerActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => customerService.setActive(id, isActive),
    onSuccess: (_customer, variables) => {
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.detail(variables.id) })
    },
  })
}

export function useCustomerMaintenanceHistory(id: string | undefined, params: MaintenanceHistoryParams) {
  return useQuery({
    queryKey: customerQueryKeys.history(id ?? "", params),
    queryFn: () => customerService.maintenanceHistory(id!, params),
    enabled: Boolean(id),
    placeholderData: (previousData) => previousData,
  })
}

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: customerQueryKeys.list(params),
    queryFn: () => customerService.list(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerDto) => customerService.create(input),
    onSuccess: (customer) => {
      queryClient.setQueryData(customerQueryKeys.detail(customer.id), { ...customer, currentVehicles: [] })
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerDto }) => customerService.update(id, input),
    onSuccess: (_customer, variables) => {
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.detail(variables.id) })
    },
  })
}
