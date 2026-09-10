const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1"
const DEFAULT_TIMEOUT_MS = 15_000

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "")
}

function resolveTimeout(value: string | undefined): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

export const apiConfig = Object.freeze({
  baseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL),
  timeoutMs: resolveTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
})
