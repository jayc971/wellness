import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { WellnessState, WellnessLogData } from "@/types"
import { wellnessAPI } from "@/lib/wellness-api"

const initialState: WellnessState = {
  logs: [],
  isLoading: false,
  error: null,
  searchTerm: "",
}

// Async thunks
export const fetchLogs = createAsyncThunk(
  "wellness/fetchLogs",
  async ({ userId, searchTerm }: { userId: string; searchTerm?: string }, { rejectWithValue }) => {
    try {
      const response = await wellnessAPI.getLogs(userId, searchTerm)
      return response.data || []
    } catch (error) {
      return rejectWithValue("Failed to fetch wellness logs")
    }
  },
)

export const createLog = createAsyncThunk(
  "wellness/createLog",
  async (logData: Omit<WellnessLogData, "id">, { rejectWithValue }) => {
    try {
      const response = await wellnessAPI.createLog(logData)
      return response.data!
    } catch (error) {
      return rejectWithValue("Failed to create wellness log")
    }
  },
)

export const updateLog = createAsyncThunk(
  "wellness/updateLog",
  async ({ logId, logData }: { logId: string; logData: Partial<WellnessLogData> }, { rejectWithValue }) => {
    try {
      const response = await wellnessAPI.updateLog(logId, logData)
      return response.data!
    } catch (error) {
      return rejectWithValue("Failed to update wellness log")
    }
  },
)

export const deleteLog = createAsyncThunk("wellness/deleteLog", async (logId: string, { rejectWithValue }) => {
  try {
    await wellnessAPI.deleteLog(logId)
    return logId
  } catch (error) {
    return rejectWithValue("Failed to delete wellness log")
  }
})

const wellnessSlice = createSlice({
  name: "wellness",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch logs
      .addCase(fetchLogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.logs = action.payload
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create log
      .addCase(createLog.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.isLoading = false
        state.logs.unshift(action.payload)
      })
      .addCase(createLog.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update log
      .addCase(updateLog.fulfilled, (state, action) => {
        const index = state.logs.findIndex((log) => log.id === action.payload.id)
        if (index !== -1) {
          state.logs[index] = action.payload
        }
      })
      // Delete log
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter((log) => log.id !== action.payload)
      })
  },
})

export const { setSearchTerm, clearError } = wellnessSlice.actions
export default wellnessSlice.reducer
