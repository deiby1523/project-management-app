"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, usersApi, getToken, setToken, removeToken } from "./api"
import type { User, LoginRequest, RegisterRequest } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Decode JWT to get user email (simple base64 decode of payload)
function decodeToken(token: string): { sub: string } | null {
  try {
    const payload = token.split(".")[1]
    const decoded = atob(payload)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async (email: string) => {
    try {
      const userData = await usersApi.getByEmail(email)
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      removeToken()
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const token = getToken()
    if (token) {
      const decoded = decodeToken(token)
      if (decoded?.sub) {
        fetchUser(decoded.sub).finally(() => setIsLoading(false))
      } else {
        removeToken()
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [fetchUser])

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    setToken(response.token)
    const decoded = decodeToken(response.token)
    if (decoded?.sub) {
      await fetchUser(decoded.sub)
    }
  }

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data)
    setToken(response.token)
    const decoded = decodeToken(response.token)
    if (decoded?.sub) {
      await fetchUser(decoded.sub)
    }
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
