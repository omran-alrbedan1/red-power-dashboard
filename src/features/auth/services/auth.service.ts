import { httpClient } from "@/lib/api/http-client"
import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { tokenStorage } from "@/lib/api/token-storage"
import type { ApiSuccessResponse } from "@/lib/api/api.types"
import type {
  AuthSessionDto,
  AuthUserDto,
  LoginCredentials,
  User,
} from "../types/auth.types"

function toUser(user: AuthUserDto): User {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return { ...user, name: fullName || user.email }
}

function saveSession(session: AuthSessionDto): User {
  tokenStorage.setTokens({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  })
  return toUser(session.user)
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await httpClient.post<ApiSuccessResponse<AuthSessionDto>>(
      API_ENDPOINTS.auth.login,
      credentials,
    )
    return saveSession(response.data.data)
  },

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<ApiSuccessResponse<AuthUserDto>>(
      API_ENDPOINTS.auth.me,
    )
    return toUser(response.data.data)
  },

  async logout(): Promise<void> {
    try {
      if (tokenStorage.getAccessToken()) {
        await httpClient.post(API_ENDPOINTS.auth.logout)
      }
    } finally {
      tokenStorage.clear()
    }
  },
}
