import { LogOut, Sun, Moon, Activity } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { logout } from "../../store/slices/authSlice"
import { useTheme } from "@/contexts/ThemeContext"

export function DashboardHeader() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 shadow-sm">
      {/* Container with same max-width and padding as dashboard main */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <Activity size={32} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Wellness Dashboard</h1>
              <div className="flex flex-col gap-1">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {getGreeting()}, {user?.name || user?.email?.split("@")[0]}!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 opacity-75">{getCurrentDate()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
