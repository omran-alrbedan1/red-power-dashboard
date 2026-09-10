import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { maintenanceQueryKeys } from "@/features/maintenance/hooks/useMaintenanceCards"
import { adminService } from "../services/admin.service"
import type { OptionInput, OptionMutation, UsersParams } from "../types/admin.types"
import type { MaintenanceOptionKind } from "@/features/maintenance/types/maintenance.types"
export const adminKeys = { users: (p: UsersParams) => ["admin","users",p] as const, user: (id:string) => ["admin","users",id] as const }
export const useUsers = (params: UsersParams) => useQuery({ queryKey: adminKeys.users(params), queryFn: () => adminService.users(params), placeholderData: old => old })
export const useUser = (id?: string) => useQuery({ queryKey: adminKeys.user(id ?? ""), queryFn: () => adminService.user(id!), enabled: Boolean(id) })
const invalidate = (qc: ReturnType<typeof useQueryClient>, kind: MaintenanceOptionKind) => void qc.invalidateQueries({ queryKey: maintenanceQueryKeys.options(kind) })
export const useAllMaintenanceOptions = (kind: MaintenanceOptionKind) => useQuery({ queryKey: maintenanceQueryKeys.options(kind), queryFn: () => adminService.options(kind) })
export function useCreateMaintenanceOption(){const qc=useQueryClient();return useMutation({mutationFn:({kind,input}:{kind:MaintenanceOptionKind;input:OptionInput})=>adminService.createOption(kind,input),onSuccess:(_,v)=>invalidate(qc,v.kind)})}
export function useUpdateMaintenanceOption(){const qc=useQueryClient();return useMutation({mutationFn:({kind,id,input}:{kind:MaintenanceOptionKind;id:string;input:Partial<OptionInput>})=>adminService.updateOption(kind,id,input),onSuccess:(_,v)=>invalidate(qc,v.kind)})}
export function useSetMaintenanceOptionActive(){const qc=useQueryClient();return useMutation({mutationFn:({kind,id,active}:OptionMutation&{active:boolean})=>adminService.setOptionActive(kind,id,active),onSuccess:(_,v)=>invalidate(qc,v.kind)})}
export function useDeleteMaintenanceOption(){const qc=useQueryClient();return useMutation({mutationFn:({kind,id}:OptionMutation)=>adminService.deleteOption(kind,id),onSuccess:(_,v)=>invalidate(qc,v.kind)})}
