import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerQueryKeys } from "@/features/customers/hooks/useCustomers"
import { vehicleService } from "../services/vehicle.service"
import type { CreateVehicleDto, UpdateVehicleDto, VehicleHistoryParams, VehicleListParams } from "../types/vehicle.types"

export const vehicleQueryKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleQueryKeys.all, "list"] as const,
  list: (params: VehicleListParams) => [...vehicleQueryKeys.lists(), params] as const,
  details: () => [...vehicleQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleQueryKeys.details(), id] as const,
  ownership: (id: string) => [...vehicleQueryKeys.detail(id), "ownership"] as const,
  history: (id: string, params: VehicleHistoryParams) => [...vehicleQueryKeys.detail(id), "history", params] as const,
}

export function useVehicles(params: VehicleListParams) { return useQuery({ queryKey: vehicleQueryKeys.list(params), queryFn: () => vehicleService.list(params), placeholderData: (old) => old }) }
export function useVehicle(id?: string) { return useQuery({ queryKey: vehicleQueryKeys.detail(id ?? ""), queryFn: () => vehicleService.getById(id!), enabled: Boolean(id) }) }
export function useVehicleOwnership(id?: string) { return useQuery({ queryKey: vehicleQueryKeys.ownership(id ?? ""), queryFn: () => vehicleService.ownership(id!), enabled: Boolean(id) }) }
export function useVehicleMaintenanceHistory(id: string | undefined, params: VehicleHistoryParams) { return useQuery({ queryKey: vehicleQueryKeys.history(id ?? "", params), queryFn: () => vehicleService.maintenanceHistory(id!, params), enabled: Boolean(id), placeholderData: (old) => old }) }

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (input: CreateVehicleDto) => vehicleService.create(input), onSuccess: (vehicle, input) => { void qc.invalidateQueries({ queryKey: vehicleQueryKeys.lists() }); void qc.invalidateQueries({ queryKey: customerQueryKeys.detail(input.customerId) }); qc.setQueryData(vehicleQueryKeys.detail(vehicle.id), vehicle) } })
}
export function useUpdateVehicle() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateVehicleDto }) => vehicleService.update(id, input), onSuccess: (_v, vars) => { void qc.invalidateQueries({ queryKey: vehicleQueryKeys.lists() }); void qc.invalidateQueries({ queryKey: vehicleQueryKeys.detail(vars.id) }) } })
}
export function useSetVehicleActive() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => vehicleService.setActive(id, isActive), onSuccess: (_v, vars) => { void qc.invalidateQueries({ queryKey: vehicleQueryKeys.lists() }); void qc.invalidateQueries({ queryKey: vehicleQueryKeys.detail(vars.id) }); void qc.invalidateQueries({ queryKey: vehicleQueryKeys.ownership(vars.id) }) } })
}
export function useTransferVehicleOwnership() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ vehicleId, customerId }: { vehicleId: string; customerId: string; previousCustomerId?: string }) => vehicleService.transferOwnership(vehicleId, customerId), onSuccess: (_o, vars) => { void qc.invalidateQueries({ queryKey: vehicleQueryKeys.all }); void qc.invalidateQueries({ queryKey: customerQueryKeys.lists() }); if(vars.previousCustomerId) void qc.invalidateQueries({ queryKey: customerQueryKeys.detail(vars.previousCustomerId) }); void qc.invalidateQueries({ queryKey: customerQueryKeys.detail(vars.customerId) }); void qc.invalidateQueries({ queryKey: ["maintenance-selector"] }) } })
}
