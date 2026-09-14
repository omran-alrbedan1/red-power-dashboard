export type AppRole = "SUPER_ADMIN" | "ADMIN"

export interface User {
  id: number
  firstName: string
  lastName: string
  name: string
  email: string
  role: AppRole
  isActive: boolean
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface LoginCredentials {
  email: string
  password: string
}
