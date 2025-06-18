import type { User, LoginFormData, SignupFormData } from "@/types"

// Mock JWT token generation
const generateMockJWT = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }),
  )
  const signature = btoa("mock-signature")
  return `${header}.${payload}.${signature}`
}

// Add refresh token generation
const generateRefreshToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      type: "refresh"
    }),
  )
  const signature = btoa("mock-refresh-signature")
  return `${header}.${payload}.${signature}`
}

// Mock user database
const mockUsers: User[] = [{ id: "1", email: "demo@example.com", name: "Demo User" }]

// Auth API functions
export const authAPI = {
  async login(credentials: LoginFormData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - check against demo credentials
    if (credentials.email === "demo@example.com" && credentials.password === "password123") {
      const user: User = { id: "1", email: credentials.email, name: "Demo User" }
      const token = generateMockJWT(user)
      const refreshToken = generateRefreshToken(user)
      return { success: true, data: { user, token, refreshToken } }
    }

    // Also allow any new signups to work
    const existingUser = mockUsers.find((u) => u.email === credentials.email)
    if (existingUser) {
      const user: User = existingUser
      const token = generateMockJWT(user)
      const refreshToken = generateRefreshToken(user)
      return { success: true, data: { user, token, refreshToken } }
    }

    throw new Error("Invalid email or password. Use demo@example.com / password123")
  },

  async signup(userData: SignupFormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.find((u) => u.email === userData.email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.email.split("@")[0],
    }

    mockUsers.push(newUser)
    const token = generateMockJWT(newUser)
    const refreshToken = generateRefreshToken(newUser)

    return { success: true, data: { user: newUser, token, refreshToken } }
  },

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.exp < Date.now()) {
        return null // Token expired
      }
      return mockUsers.find((u) => u.id === payload.sub) || null
    } catch {
      return null
    }
  },

  async refreshToken(refreshToken: string): Promise<{ user: User; token: string } | null> {
    try {
      const payload = JSON.parse(atob(refreshToken.split(".")[1]))
      if (payload.exp < Date.now() || payload.type !== "refresh") {
        return null // Refresh token expired or invalid
      }
      
      const user = mockUsers.find((u) => u.id === payload.sub)
      if (!user) return null

      const newToken = generateMockJWT(user)
      return { user, token: newToken }
    } catch {
      return null
    }
  }
}

// Add token expiration check utility
export const checkTokenExpiration = async (token: string): Promise<boolean> => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const expirationTime = payload.exp
    const currentTime = Date.now()
    
    // If token expires in less than 5 minutes, consider it expired
    return currentTime >= expirationTime - 5 * 60 * 1000
  } catch {
    return true // Consider invalid tokens as expired
  }
}

// Add automatic token refresh utility
export const refreshTokenIfNeeded = async (token: string, refreshToken: string): Promise<string | null> => {
  try {
    const isExpired = await checkTokenExpiration(token)
    if (!isExpired) return token

    const result = await authAPI.refreshToken(refreshToken)
    if (!result) return null

    const { token: newToken } = result
    localStorage.setItem("wellness_token", newToken)
    return newToken
  } catch {
    return null
  }
}
