import type React from "react"
import { useState } from "react"
import type { SignupFormData, ValidationErrors } from "../../types"
import { validateSignup } from "../../lib/validation"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { signupUser } from "../../store/slices/authSlice"
import { FormField } from "../ui/form-field"
import { LoadingSpinner } from "../ui/loading-spinner"

export function SignupForm() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
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

    const validationErrors = validateSignup(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await dispatch(signupUser(formData)).unwrap()
    } catch (error) {
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Email" error={errors.email} required>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword} required>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </FormField>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3 disabled:transform-none"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : null}
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  )
}
