import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/features/auth/context/AuthContext"
import type { UserRole } from "@/features/auth/types/auth.types"
export function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) { const { user } = useAuth(); return user && roles.includes(user.role) ? <>{children}</> : <Navigate to="/settings" replace/> }
