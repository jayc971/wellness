import { LogOut, Sun, Moon, Activity } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { logout } from "../../store/slices/authSlice"
import { toggleTheme } from "../../store/slices/uiSlice"

export function DashboardHeader() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)

  console.log('Current theme:', theme)
  console.log('Full UI state:', useAppSelector((state) => state.ui))

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
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

  const handleToggleTheme = () => {
    console.log('Toggling theme from:', theme)
    dispatch(toggleTheme())
    console.log('Theme after toggle:', useAppSelector((state) => state.ui.theme))
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
              onClick={handleToggleTheme}
              className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:shadow-md"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium hover:shadow-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
