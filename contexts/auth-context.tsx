import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User, AuthState, LoginFormData, SignupFormData } from "@/types"
import { authAPI } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>
  signup: (userData: SignupFormData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "CLEAR_USER" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "CLEAR_USER":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for stored token on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("wellness_token")
        if (token) {
          const user = await authAPI.verifyToken(token)
          if (user) {
            dispatch({ type: "SET_USER", payload: { user, token } })
            return
          } else {
            localStorage.removeItem("wellness_token")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("wellness_token")
      }

      dispatch({ type: "SET_LOADING", payload: false })
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginFormData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await authAPI.login(credentials)
      const { user, token } = response.data!
      localStorage.setItem("wellness_token", token)
      dispatch({ type: "SET_USER", payload: { user, token } })
      navigate("/dashboard")
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const signup = async (userData: SignupFormData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await authAPI.signup(userData)
      const { user, token } = response.data!
      localStorage.setItem("wellness_token", token)
      dispatch({ type: "SET_USER", payload: { user, token } })
      navigate("/dashboard")
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("wellness_token")
    dispatch({ type: "CLEAR_USER" })
    navigate("/auth")
  }

  return <AuthContext.Provider value={{ ...state, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
