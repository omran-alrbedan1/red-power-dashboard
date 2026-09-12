import type { SessionTokens } from "@/lib/api/client"

// Token storage decision (documented in docs/guide.md Phase 1):
// sessionStorage is chosen over localStorage or memory-only storage because:
// - It survives a tab reload, so a valid session can be restored via GET /users/me
//   without forcing login again (acceptance: "valid login restores the session after reload").
// - It is scoped per tab/window, so closing a tab ends the session and reduces
//   cross-tab token reuse compared with localStorage.
// It remains readable by same-origin JavaScript, so the authorization header and
// refresh flow depend on sessionStorage; a server-managed cookie session would
// require additional architecture and is not the current API contract.
// The legacy mock key "red-power-user" is not used for authentication and is
// removed from localStorage by AuthContext.

const ACCESS_TOKEN_KEY = "red-power-access-token"
const REFRESH_TOKEN_KEY = "red-power-refresh-token"

export const authTokenStorage = {
  read(): SessionTokens | null {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
    return accessToken && refreshToken ? { accessToken, refreshToken } : null
  },
  write(tokens: SessionTokens) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },
  clear() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}