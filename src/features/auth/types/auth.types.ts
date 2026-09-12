export type UserRole = "admin" | "super_admin"

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface LoginCredentials {
  email: string
  password: string
}
