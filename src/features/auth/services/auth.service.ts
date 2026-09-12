import { apiRequest, type SessionTokens } from "@/lib/api/client"
import type { LoginCredentials, UpdatePasswordPayload, User } from "../types/auth.types"

interface ApiUser {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  role: "ADMIN" | "SUPER_ADMIN"
}

interface AuthResponse extends SessionTokens {
  user: ApiUser
}

const mapUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
  role: user.role === "SUPER_ADMIN" ? "super_admin" : "admin",
})

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: SessionTokens }> {
    const response = await apiRequest<AuthResponse>({
      method: "POST",
      url: "/auth/login",
      data: credentials,
      skipAuth: true,
      skipRefresh: true,
    })
    return { user: mapUser(response.user), tokens: response }
  },

  async refresh(): Promise<SessionTokens> {
    const refreshToken = sessionStorage.getItem("red-power-refresh-token")
    if (!refreshToken) throw new Error("No refresh token available")
    const response = await apiRequest<AuthResponse>({
      method: "POST",
      url: "/auth/refresh",
      headers: { Authorization: `Bearer ${refreshToken}` },
      skipAuth: true,
      skipRefresh: true,
    })
    return response
  },

  async getCurrentUser(): Promise<User> {
    return mapUser(await apiRequest<ApiUser>({ method: "GET", url: "/users/me" }))
  },

  async logout(): Promise<void> {
    await apiRequest<null>({ method: "POST", url: "/auth/logout", skipRefresh: true })
  },

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    await apiRequest<{ message: string }>({ method: "PATCH", url: "/users/me/password", data: payload, skipRefresh: true })
  },
}
