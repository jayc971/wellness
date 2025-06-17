"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../store/hooks"
import { LoginForm } from "../components/forms/login-form"
import { SignupForm } from "../components/forms/signup-form"
import { LoadingSpinner } from "../components/ui/loading-spinner"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <button
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 relative hover:scale-105 ${
              isLogin
                ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
            {isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 relative hover:scale-105 ${
              !isLogin
                ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
            {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
          </button>
        </div>

        <div className="p-8">{isLogin ? <LoginForm /> : <SignupForm />}</div>

        <div className="px-8 pb-8 pt-4 text-center border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-all duration-200 hover:scale-105"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
