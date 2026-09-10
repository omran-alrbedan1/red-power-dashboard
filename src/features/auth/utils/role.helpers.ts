import type { User, UserRole } from "../types/auth.types"

type RoleSource = User | UserRole | null | undefined

function resolveRole(source: RoleSource): UserRole | null {
  if (!source) return null
  return typeof source === "string" ? source : source.role
}

export const isAdmin = (source: RoleSource): boolean => resolveRole(source) === "ADMIN"

export const isSuperAdmin = (source: RoleSource): boolean =>
  resolveRole(source) === "SUPER_ADMIN"

export const canManageMaintenanceOptions = isSuperAdmin

export const canReopenMaintenanceCard = isSuperAdmin

export const canAccessGarageOperations = (source: RoleSource): boolean =>
  isAdmin(source) || isSuperAdmin(source)
