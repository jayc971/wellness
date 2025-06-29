import type React from "react"
import { useState } from "react"
import type { LoginFormData, ValidationErrors } from "../../types"
import { validateLogin } from "../../lib/validation"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { loginUser } from "../../store/slices/authSlice"
import { FormField } from "../ui/form-field"
import { LoadingSpinner } from "../ui/loading-spinner"

export function LoginForm() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateLogin(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await dispatch(loginUser(formData)).unwrap()
    } catch (error) {
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@example.com",
      password: "password123",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400">Sign in to your wellness dashboard</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      <FormField label="Email" error={errors.email} required>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
            errors.email
              ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
              : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
          } focus:outline-none focus:ring-4`}
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
            errors.password
              ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
              : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
          } focus:outline-none focus:ring-4`}
          disabled={isLoading}
        />
      </FormField>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3 disabled:transform-none"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : null}
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      <div className="text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-3 px-4 py-2 hover:text-white text-gray-400 rounded-lg text-sm font-medium transition-all duration-200 "
            disabled={isLoading}
          >
            Fill Demo Credentials
          </button>
      </div>
    </form>
  )
}
