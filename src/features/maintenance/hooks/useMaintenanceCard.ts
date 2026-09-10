import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import { maintenanceQueryKeys } from "./useMaintenanceCards"
import type { RequiredWorkInput, UpdateMaintenanceCardInput, UpdateRequiredWorkInput } from "../types/maintenance.types"

const refresh = (qc: ReturnType<typeof useQueryClient>, id: string) => { void qc.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(id) }); void qc.invalidateQueries({ queryKey: maintenanceQueryKeys.lists() }); void qc.invalidateQueries({ queryKey: ["customers"] }); void qc.invalidateQueries({ queryKey: ["vehicles"] }) }
export function useMaintenanceCard(id?: string) { return useQuery({ queryKey: maintenanceQueryKeys.detail(id ?? ""), queryFn: () => maintenanceService.getById(id!), enabled: Boolean(id) }) }
export function useUpdateMaintenanceCard() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateMaintenanceCardInput }) => maintenanceService.update(id, input), onSuccess: (card) => { qc.setQueryData(maintenanceQueryKeys.detail(card.id), card); refresh(qc, card.id) } }) }
export function useCloseMaintenanceCard() { const qc = useQueryClient(); return useMutation({ mutationFn: maintenanceService.close, onSuccess: (card) => { qc.setQueryData(maintenanceQueryKeys.detail(card.id), card); refresh(qc, card.id) } }) }
export function useReopenMaintenanceCard() { const qc = useQueryClient(); return useMutation({ mutationFn: maintenanceService.reopen, onSuccess: (card) => { qc.setQueryData(maintenanceQueryKeys.detail(card.id), card); refresh(qc, card.id) } }) }
export function useCreateRequiredWork() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ cardId, input }: { cardId: string; input: RequiredWorkInput }) => maintenanceService.createWork(cardId, input), onSuccess: (_work, vars) => refresh(qc, vars.cardId) }) }
export function useUpdateRequiredWork() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ cardId, workId, input }: { cardId: string; workId: string; input: UpdateRequiredWorkInput }) => maintenanceService.updateWork(cardId, workId, input), onSuccess: (_work, vars) => refresh(qc, vars.cardId) }) }
export function useDeleteRequiredWork() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ cardId, workId }: { cardId: string; workId: string }) => maintenanceService.deleteWork(cardId, workId), onSuccess: (_v, vars) => refresh(qc, vars.cardId) }) }
