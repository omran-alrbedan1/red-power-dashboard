import axios from "axios"
import type { ApiErrorResponse } from "./api.types"

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode?: number,
    readonly details?: unknown,
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data
    if (response?.error?.code) {
      return new ApiClientError(
        response.message || "Request failed.",
        response.error.code,
        response.statusCode,
        response.error.details,
      )
    }

    if (!error.response) {
      const isArabic = document.documentElement.lang === "ar"
      return new ApiClientError(
        isArabic
          ? "تعذر الاتصال بالخادم. تحقق من اتصال الشبكة وحاول مرة أخرى."
          : "Unable to reach the server. Check your connection and try again.",
        "network.unavailable",
      )
    }
  }

  const isArabic = document.documentElement.lang === "ar"
  return new ApiClientError(
    isArabic
      ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      : "An unexpected error occurred. Please try again.",
    "system.unexpected_error",
  )
}
