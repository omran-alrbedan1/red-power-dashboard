import type { AppRole } from "@/features/auth/types/auth.types"

export const isSuperAdmin = (role?: AppRole) => role === "SUPER_ADMIN"

export const canManageEmployees = (role?: AppRole) => role === "SUPER_ADMIN"

export const canManageMaintenanceOptions = (role?: AppRole) => role === "SUPER_ADMIN"

export const canReopenMaintenanceCard = (role?: AppRole) => role === "SUPER_ADMIN"

export const canEditMaintenanceCard = (role?: AppRole) =>
  role === "ADMIN" || role === "SUPER_ADMIN"
