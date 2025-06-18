import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { verifyToken } from "./store/slices/authSlice"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { ThemeProvider } from "../contexts/ThemeContext"

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Verify existing token
    dispatch(verifyToken())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
        />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
