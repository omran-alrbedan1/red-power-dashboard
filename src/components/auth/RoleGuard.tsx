import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/features/auth/context/AuthContext"
import type { AppRole } from "@/features/auth/types/auth.types"

interface RoleGuardProps {
  allowedRoles: AppRole[]
  children: ReactNode
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, status } = useAuth()

  if (status === "initializing") return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RoleGuard