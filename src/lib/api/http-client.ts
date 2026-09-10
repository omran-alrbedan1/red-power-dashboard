import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import { apiConfig } from "./api.config"
import { API_ENDPOINTS } from "./api.endpoints"
import { normalizeApiError } from "./api-error"
import { tokenStorage, type AuthTokens } from "./token-storage"
import type { ApiSuccessResponse } from "./api.types"

export const AUTH_SESSION_EXPIRED_EVENT = "red-power:auth-session-expired"

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean
}

const baseOptions = {
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeoutMs,
  headers: { Accept: "application/json" },
}

export const httpClient = axios.create(baseOptions)
const refreshClient = axios.create(baseOptions)

let refreshPromise: Promise<AuthTokens> | null = null

function currentLanguage(): string {
  return localStorage.getItem("red-power-language") || document.documentElement.lang || "ar"
}

function expireSession(): void {
  tokenStorage.clear()
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT))
}

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) throw new Error("Refresh token is unavailable.")

  const response = await refreshClient.post<ApiSuccessResponse<AuthTokens>>(
    API_ENDPOINTS.auth.refresh,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Accept-Language": currentLanguage(),
      },
    },
  )

  const tokens = response.data.data
  tokenStorage.setTokens(tokens)
  return tokens
}

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  config.headers["Accept-Language"] = currentLanguage()
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined
    const requestUrl = request?.url ?? ""
    const isRefreshRequest = requestUrl.includes(API_ENDPOINTS.auth.refresh)
    const isLoginRequest = requestUrl.includes(API_ENDPOINTS.auth.login)
    const canRefresh =
      error.response?.status === 401 &&
      Boolean(request) &&
      !request?._authRetry &&
      !isRefreshRequest &&
      !isLoginRequest &&
      tokenStorage.getRefreshToken()

    if (!canRefresh || !request) {
      return Promise.reject(normalizeApiError(error))
    }

    request._authRetry = true

    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null
      })
      const tokens = await refreshPromise
      request.headers.Authorization = `Bearer ${tokens.accessToken}`
      return httpClient(request)
    } catch (refreshError) {
      expireSession()
      return Promise.reject(normalizeApiError(refreshError))
    }
  },
)
