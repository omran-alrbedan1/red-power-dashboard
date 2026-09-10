export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN_KEY = "red-power-access-token"
const REFRESH_TOKEN_KEY = "red-power-refresh-token"
const LEGACY_MOCK_USER_KEY = "red-power-user"

function getStorage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null
  },

  getRefreshToken(): string | null {
    return getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null
  },

  setTokens(tokens: AuthTokens): void {
    const storage = getStorage()
    storage?.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    storage?.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },

  clear(): void {
    const storage = getStorage()
    storage?.removeItem(ACCESS_TOKEN_KEY)
    storage?.removeItem(REFRESH_TOKEN_KEY)
    storage?.removeItem(LEGACY_MOCK_USER_KEY)
  },

  hasSession(): boolean {
    return Boolean(this.getAccessToken() && this.getRefreshToken())
  },
}
