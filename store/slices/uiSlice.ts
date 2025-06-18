import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIState } from "@/types"

const initialState: UIState = {
  theme: "light",
  leftPanelWidth: 35,
  isResizing: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("wellness_theme", state.theme)

      if (state.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
      localStorage.setItem("wellness_theme", state.theme)

      if (state.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    setLeftPanelWidth: (state, action: PayloadAction<number>) => {
      state.leftPanelWidth = Math.min(Math.max(action.payload, 25), 50)
    },
    setIsResizing: (state, action: PayloadAction<boolean>) => {
      state.isResizing = action.payload
    },
  },
})

export const { toggleTheme, setTheme, setLeftPanelWidth, setIsResizing } = uiSlice.actions
export type { UIState }
export default uiSlice.reducer
