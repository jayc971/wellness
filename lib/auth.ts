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
      return { success: true, data: { user, token } }
    }

    // Also allow any new signups to work
    const existingUser = mockUsers.find((u) => u.email === credentials.email)
    if (existingUser) {
      const user: User = existingUser
      const token = generateMockJWT(user)
      return { success: true, data: { user, token } }
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

    return { success: true, data: { user: newUser, token } }
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
}
