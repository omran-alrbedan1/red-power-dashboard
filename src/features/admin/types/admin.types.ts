import type { AuthUserDto } from "@/features/auth/types/auth.types"
import type { MaintenanceOption, MaintenanceOptionKind } from "@/features/maintenance/types/maintenance.types"
export type AdminUser = AuthUserDto
export interface UsersParams { page: number; limit: number; search?: string }
export interface OptionInput { code: string; label: string; displayOrder: number }
export interface OptionMutation { kind: MaintenanceOptionKind; id: string }
export type AdminMaintenanceOption = MaintenanceOption
