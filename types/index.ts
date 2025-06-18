// TypeScript interfaces for type safety
export interface User {
  id: string
  email: string
  name?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface WellnessLogData {
  id?: string
  mood: "Happy" | "Stressed" | "Tired" | "Focused"
  sleepDuration: number
  activityNotes: string
  date: string
  userId: string
}

export interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
  mood?: string
  sleepDuration?: string
  activityNotes?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface WellnessState {
  logs: WellnessLogData[]
  isLoading: boolean
  error: string | null
  searchTerm: string
}

export interface UIState {
  theme: "light" | "dark"
  leftPanelWidth: number
  isResizing: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
