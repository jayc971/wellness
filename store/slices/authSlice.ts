import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AuthState, LoginFormData, SignupFormData } from "@/types"
import { authAPI } from "@/lib/auth"

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginFormData, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials)
    const { user, token, refreshToken } = response.data!
    localStorage.setItem("wellness_token", token)
    localStorage.setItem("wellness_refresh_token", refreshToken)
    return { user, token, refreshToken }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed")
  }
})

export const signupUser = createAsyncThunk("auth/signup", async (userData: SignupFormData, { rejectWithValue }) => {
  try {
    const response = await authAPI.signup(userData)
    const { user, token, refreshToken } = response.data!
    localStorage.setItem("wellness_token", token)
    localStorage.setItem("wellness_refresh_token", refreshToken)
    return { user, token, refreshToken }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Signup failed")
  }
})

export const refreshUserToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("wellness_refresh_token")
    if (!refreshToken) throw new Error("No refresh token found")

    const result = await authAPI.refreshToken(refreshToken)
    if (!result) throw new Error("Invalid refresh token")

    const { user, token } = result
    localStorage.setItem("wellness_token", token)
    return { user, token, refreshToken }
  } catch (error) {
    localStorage.removeItem("wellness_token")
    localStorage.removeItem("wellness_refresh_token")
    return rejectWithValue("Token refresh failed")
  }
})

export const verifyToken = createAsyncThunk("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("wellness_token")
    const refreshToken = localStorage.getItem("wellness_refresh_token")
    
    if (!token || !refreshToken) throw new Error("No tokens found")

    const user = await authAPI.verifyToken(token)
    if (!user) {
      // Try to refresh the token if verification fails
      const result = await authAPI.refreshToken(refreshToken)
      if (!result) throw new Error("Invalid tokens")
      
      const { user: refreshedUser, token: newToken } = result
      localStorage.setItem("wellness_token", newToken)
      return { user: refreshedUser, token: newToken, refreshToken }
    }

    return { user, token, refreshToken }
  } catch (error) {
    localStorage.removeItem("wellness_token")
    localStorage.removeItem("wellness_refresh_token")
    return rejectWithValue("Token verification failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("wellness_token")
      localStorage.removeItem("wellness_refresh_token")
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Refresh token
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.error = action.payload as string
      })
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
