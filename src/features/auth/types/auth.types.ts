export type UserRole = "ADMIN" | "SUPER_ADMIN"

export interface AuthUserDto {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: UserRole
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface User extends AuthUserDto {
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSessionDto {
  accessToken: string
  refreshToken: string
  user: AuthUserDto
}
