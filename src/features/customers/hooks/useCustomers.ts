import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { customerService, type CustomerInput, type VehicleInput } from "../services/customer.service"
import { customerQueryKeys } from "../services/customer-query-keys"
import type { CustomerFilterValues } from "../configs/customer-filter.config"

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

export function useCustomers(page: number, limit: number, filters?: CustomerFilterValues) {
  const search = filters?.search.trim() || undefined
  return useQuery({
    queryKey: customerQueryKeys.list(page, limit, search),
    queryFn: () => customerService.list({ page, limit, search }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useCreateCustomer() {
  const { t } = useTranslation("customers")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CustomerInput) => customerService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
      toast.success(t("messages.created", "Customer created successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.createFailed", "Failed to create customer"))
    },
  })
}

export function useUpdateCustomer() {
  const { t } = useTranslation("customers")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CustomerInput }) =>
      customerService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.detail(variables.id) })
      toast.success(t("messages.updated", "Customer updated successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.updateFailed", "Failed to update customer"))
    },
  })
}

export function useAddVehicle() {
  const { t } = useTranslation("customers")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ customerId, input }: { customerId: number; input: VehicleInput }) =>
      customerService.addVehicle(customerId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.detail(variables.customerId) })
      toast.success(t("messages.vehicleAdded", "Vehicle added successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.vehicleAddFailed", "Failed to add vehicle"))
    },
  })
}

export function useTransferVehicleOwnership() {
  const { t } = useTranslation("customers")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleId, customerId }: { vehicleId: number; customerId: number }) =>
      customerService.transferOwnership(vehicleId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      queryClient.invalidateQueries({ queryKey: ["maintenance-selector"] })
      toast.success(t("messages.ownershipTransferred", "Vehicle ownership transferred successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.ownershipTransferFailed", "Failed to transfer vehicle ownership"))
    },
  })
}