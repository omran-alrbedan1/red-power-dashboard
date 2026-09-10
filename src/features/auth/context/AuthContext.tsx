import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { LoginCredentials, User } from "../types/auth.types"
import { authService } from "../services/auth.service"
import { tokenStorage } from "@/lib/api/token-storage"
import { AUTH_SESSION_EXPIRED_EVENT } from "@/lib/api/http-client"

interface AuthContextState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    let active = true

    const initializeSession = async () => {
      if (!tokenStorage.hasSession()) {
        if (active) setIsInitializing(false)
        return
      }

      try {
        const authenticatedUser = await authService.getCurrentUser()
        if (active) setUser(authenticatedUser)
      } catch {
        tokenStorage.clear()
        if (active) setUser(null)
      } finally {
        if (active) setIsInitializing(false)
      }
    }

    void initializeSession()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const handleExpiredSession = () => setUser(null)
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedUser = await authService.login(credentials)
    setUser(authenticatedUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isAuthenticated: user !== null && tokenStorage.hasSession(),
      isInitializing,
      login,
      logout,
    }),
    [user, isInitializing, login, logout],
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
