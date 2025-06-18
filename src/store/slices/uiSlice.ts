import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIState } from "../../types"

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("wellness_theme")
  console.log('Loading theme from localStorage:', savedTheme)
  
  if (savedTheme === "dark" || savedTheme === "light") {
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
    return savedTheme
  }
  
  // Check system preference if no saved theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  console.log('System prefers dark mode:', prefersDark)
  return prefersDark ? "dark" : "light"
}

const initialState: UIState = {
  theme: getInitialTheme(),
  leftPanelWidth: Number(localStorage.getItem("wellness_panel_width")) || 35,
  isResizing: false,
}

console.log('Initial UI state:', initialState)

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      console.log('Toggling theme in reducer from:', state.theme)
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("wellness_theme", state.theme)
      console.log('New theme after toggle:', state.theme)

      if (state.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      console.log('Setting theme in reducer to:', action.payload)
      state.theme = action.payload
      localStorage.setItem("wellness_theme", state.theme)

      if (state.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    setLeftPanelWidth: (state, action: PayloadAction<number>) => {
      const clampedWidth = Math.min(Math.max(action.payload, 25), 50)
      state.leftPanelWidth = clampedWidth
      localStorage.setItem("wellness_panel_width", clampedWidth.toString())
    },
    setIsResizing: (state, action: PayloadAction<boolean>) => {
      state.isResizing = action.payload
    },
  },
})

export const { toggleTheme, setTheme, setLeftPanelWidth, setIsResizing } = uiSlice.actions
export default uiSlice.reducer
