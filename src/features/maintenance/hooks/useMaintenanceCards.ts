import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import type { CreateMaintenanceCardInput, MaintenanceListParams, MaintenanceOptionKind } from "../types/maintenance.types"

export const maintenanceQueryKeys = {
  all: ["maintenance"] as const,
  lists: () => [...maintenanceQueryKeys.all, "list"] as const,
  list: (params: MaintenanceListParams) => [...maintenanceQueryKeys.lists(), params] as const,
  details: () => [...maintenanceQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...maintenanceQueryKeys.details(), id] as const,
  options: (kind: MaintenanceOptionKind) => [...maintenanceQueryKeys.all, "options", kind] as const,
}
export function useMaintenanceCards(params: MaintenanceListParams) { return useQuery({ queryKey: maintenanceQueryKeys.list(params), queryFn: () => maintenanceService.list(params), placeholderData: (old) => old }) }
export function useMaintenanceOptions(kind: MaintenanceOptionKind) { return useQuery({ queryKey: maintenanceQueryKeys.options(kind), queryFn: () => maintenanceService.options(kind), staleTime: 5 * 60_000 }) }
export function useCreateMaintenanceCard() { const qc = useQueryClient(); return useMutation({ mutationFn: (input: CreateMaintenanceCardInput) => maintenanceService.create(input), onSuccess: (card) => { qc.setQueryData(maintenanceQueryKeys.detail(card.id), card); void qc.invalidateQueries({ queryKey: maintenanceQueryKeys.lists() }); void qc.invalidateQueries({ queryKey: ["customers"] }); void qc.invalidateQueries({ queryKey: ["vehicles"] }) } }) }
