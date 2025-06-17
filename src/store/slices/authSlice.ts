import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AuthState, LoginFormData, SignupFormData } from "../../types"
import { authAPI } from "../../lib/auth"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginFormData, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials)
    const { user, token } = response.data!
    localStorage.setItem("wellness_token", token)
    return { user, token }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed")
  }
})

export const signupUser = createAsyncThunk("auth/signup", async (userData: SignupFormData, { rejectWithValue }) => {
  try {
    const response = await authAPI.signup(userData)
    const { user, token } = response.data!
    localStorage.setItem("wellness_token", token)
    return { user, token }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Signup failed")
  }
})

export const verifyToken = createAsyncThunk("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("wellness_token")
    if (!token) throw new Error("No token found")

    const user = await authAPI.verifyToken(token)
    if (!user) throw new Error("Invalid token")

    return { user, token }
  } catch (error) {
    localStorage.removeItem("wellness_token")
    return rejectWithValue("Token verification failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("wellness_token")
      state.user = null
      state.token = null
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
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
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
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
