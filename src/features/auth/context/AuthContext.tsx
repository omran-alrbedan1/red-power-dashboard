import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { configureApiSession } from "@/lib/api/client"
import type { LoginCredentials, UpdatePasswordPayload, User } from "../types/auth.types"
import { authService } from "../services/auth.service"
import { authTokenStorage } from "../services/session-storage"

interface AuthContextState {
  user: User | null
  isAuthenticated: boolean
  status: "initializing" | "authenticated" | "anonymous"
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updatePassword: (payload: UpdatePasswordPayload) => Promise<void>
}

const AuthContext = createContext<AuthContextState | undefined>(undefined)

const LEGACY_USER_KEY = "red-power-user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthContextState["status"]>("initializing")

  const clearSession = useCallback(() => {
    authTokenStorage.clear()
    localStorage.removeItem(LEGACY_USER_KEY)
    queryClient.clear()
    setUser(null)
    setStatus("anonymous")
  }, [queryClient])

  useEffect(() => {
    configureApiSession({
      getAccessToken: () => authTokenStorage.read()?.accessToken ?? null,
      refresh: async () => {
        const tokens = await authService.refresh()
        authTokenStorage.write(tokens)
        return tokens
      },
      clear: clearSession,
    })

    const restoreSession = async () => {
      localStorage.removeItem(LEGACY_USER_KEY)
      if (!authTokenStorage.read()) {
        setStatus("anonymous")
        return
      }
      try {
        setUser(await authService.getCurrentUser())
        setStatus("authenticated")
      } catch {
        clearSession()
      }
    }
    void restoreSession()
    return () => configureApiSession(null)
  }, [clearSession])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: authenticatedUser, tokens } = await authService.login(credentials)
    authTokenStorage.write(tokens)
    setUser(authenticatedUser)
    setStatus("authenticated")
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } finally { clearSession() }
  }, [clearSession])

  const updatePassword = useCallback(async (payload: UpdatePasswordPayload) => {
    await authService.updatePassword(payload)
    clearSession()
  }, [clearSession])

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isAuthenticated: status === "authenticated",
      status,
      login,
      logout,
      updatePassword,
    }),
    [user, status, login, logout, updatePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
