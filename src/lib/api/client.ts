import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios"
import i18n from "@/i18n/config"
import { ApiError, normalizeApiError } from "./api-error"
import type { ApiSuccess } from "./contracts"

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    skipRefresh?: boolean
    _retry?: boolean
  }
}

export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

interface ApiSessionHandlers {
  getAccessToken: () => string | null
  refresh: () => Promise<SessionTokens>
  clear: () => void
}

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1").replace(/\/$/, "")

const http = axios.create({ baseURL })
let sessionHandlers: ApiSessionHandlers | null = null
let refreshPromise: Promise<SessionTokens> | null = null

export function configureApiSession(handlers: ApiSessionHandlers | null) {
  sessionHandlers = handlers
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set("Accept-Language", i18n.language || "ar")
  const accessToken = !config.skipAuth ? sessionHandlers?.getAccessToken() : null
  if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`)
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const apiError = normalizeApiError(error)
    const config = (error as { config?: AxiosRequestConfig }).config
    const shouldRefresh =
      apiError.status === 401 &&
      config &&
      !config.skipAuth &&
      !config.skipRefresh &&
      !config._retry &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/refresh") &&
      apiError.code !== "auth.errors.current_password_incorrect" &&
      sessionHandlers

    // Do not retry on 429 rate limit errors
    if (apiError.status === 429) {
      return Promise.reject(apiError)
    }

    if (!shouldRefresh || !sessionHandlers) return Promise.reject(apiError)

    try {
      config._retry = true
      const activeSession = sessionHandlers
      refreshPromise ??= activeSession.refresh()
      await refreshPromise
      return await http.request(config)
    } catch (refreshError) {
      sessionHandlers?.clear()
      return Promise.reject(normalizeApiError(refreshError))
    } finally {
      refreshPromise = null
    }
  },
)

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<ApiSuccess<T>>(config)
  return response.data.data
}

export async function apiUpload<T>(url: string, body: FormData): Promise<T> {
  return apiRequest<T>({ method: "POST", url, data: body })
}

export async function apiDownload(url: string): Promise<Blob> {
  const response = await http.request<Blob>({ url, method: "GET", responseType: "blob" })
  return response.data
}

export { ApiError }
