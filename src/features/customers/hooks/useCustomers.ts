import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { customerService, type CustomerInput, type VehicleInput } from "../services/customer.service"
import type { CustomerFilterValues } from "../configs/customer-filter.config"

export function useCustomers(page: number, limit: number, filters?: CustomerFilterValues) {
  const search = filters?.search.trim() || undefined
  return useQuery({
    queryKey: ["customers", { page, limit, search }],
    queryFn: () => customerService.list({ page, limit, search }),
    staleTime: 300,
    gcTime: 300,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CustomerInput) => customerService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      toast.success("تم إنشاء العميل بنجاح")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل إنشاء العميل")
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CustomerInput }) =>
      customerService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] })
      toast.success("تم تحديث بيانات العميل بنجاح")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل تحديث بيانات العميل")
    },
  })
}

export function useAddVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ customerId, input }: { customerId: number; input: VehicleInput }) =>
      customerService.addVehicle(customerId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      })
      toast.success("تم إضافة المركبة بنجاح")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل إضافة المركبة")
    },
  })
}

export function useTransferVehicleOwnership() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleId, customerId }: { vehicleId: number; customerId: number }) =>
      customerService.transferOwnership(vehicleId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer"] })
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      queryClient.invalidateQueries({ queryKey: ["maintenance-selector"] })
      toast.success("تم نقل ملكية المركبة بنجاح")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل نقل ملكية المركبة")
    },
  })
}
