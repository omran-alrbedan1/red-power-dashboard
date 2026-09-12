import type { AxiosError } from "axios"
import type { ApiErrorBody } from "./contracts"

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: unknown

  constructor({ status, message, code, details }: { status: number; message: string; code?: string; details?: unknown }) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  const axiosError = error as AxiosError<ApiErrorBody>
  const body = axiosError.response?.data
  const message = Array.isArray(body?.message)
    ? body.message.join(" ")
    : body?.message || axiosError.message || "تعذر إتمام الطلب."

  return new ApiError({
    status: axiosError.response?.status ?? 0,
    message,
    code: body?.error?.code,
    details: body?.error?.details,
  })
}

/**
 * Get a translated error message based on error code and HTTP status.
 * Falls back to the raw message if no translation is found.
 */
export function getTranslatedErrorMessage(
  error: ApiError,
  t: (key: string, params?: Record<string, unknown>) => string
): string {
  // Try error code translation first
  if (error.code) {
    const codeKey = `api.errors.${error.code}`
    const translated = t(codeKey)
    if (translated !== codeKey) return translated
  }

  // Try status code translation
  const statusKey = `api.http.${error.status}`
  const translated = t(statusKey)
  if (translated !== statusKey) return translated

  // Fall back to the raw message
  return error.message
}

/**
 * Check if error is a specific type based on status or code
 */
export function isErrorType(error: ApiError, type: 'notFound' | 'permission' | 'conflict' | 'validation'): boolean {
  switch (type) {
    case 'notFound':
      return error.status === 404
    case 'permission':
      return error.status === 403 || error.status === 401
    case 'conflict':
      return error.status === 409
    case 'validation':
      return error.status === 422 || (error.code?.includes('validation') ?? false)
    default:
      return false
  }
}
