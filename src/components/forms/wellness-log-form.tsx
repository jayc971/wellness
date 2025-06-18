import type React from "react"
import { useState } from "react"
import type { WellnessLogData, ValidationErrors } from "../../types"
import { validateWellnessLog } from "../../lib/validation"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { createLog } from "../../store/slices/wellnessSlice"
import { FormField } from "../ui/form-field"
import { LoadingSpinner } from "../ui/loading-spinner"
import { getTodayDate } from "../../lib/utils"

export function WellnessLogForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading, error } = useAppSelector((state) => state.wellness)

  const [formData, setFormData] = useState<Partial<WellnessLogData>>({
    mood: undefined,
    sleepDuration: 8,
    activityNotes: "",
    date: getTodayDate(),
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const processedValue = name === "sleepDuration" ? Number(value) : value

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateWellnessLog(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (!user) return

    try {
      await dispatch(
        createLog({
          ...(formData as WellnessLogData),
          userId: user.id,
        }),
      ).unwrap()

      // Reset form
      setFormData({
        mood: undefined,
        sleepDuration: 8,
        activityNotes: "",
        date: getTodayDate(),
      })
      setErrors({})
    } catch (error) {
      // Error is handled by Redux
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add Wellness Log</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Mood" error={errors.mood} required>
          <select
            name="mood"
            value={formData.mood || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
              errors.mood
                ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
            } focus:outline-none focus:ring-4`}
            disabled={isLoading}
          >
            <option value="">Select your mood</option>
            <option value="Happy">😊 Happy</option>
            <option value="Stressed">😰 Stressed</option>
            <option value="Tired">😴 Tired</option>
            <option value="Focused">🎯 Focused</option>
          </select>
        </FormField>

        <FormField label={`Sleep Duration: ${formData.sleepDuration} hours`} error={errors.sleepDuration} required>
          <div className="relative">
            <input
              type="range"
              name="sleepDuration"
              min="0"
              max="12"
              step="0.5"
              value={formData.sleepDuration || 8}
              onChange={handleChange}
              className="w-full h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg appearance-none cursor-pointer slider-custom [&::-webkit-slider-thumb]:opacity-0 [&::-moz-range-thumb]:opacity-0"
              disabled={isLoading}
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(((formData.sleepDuration as number) || 8) / 12) * 100}%, #dcfce7 ${(((formData.sleepDuration as number) || 8) / 12) * 100}%, #dcfce7 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </FormField>

        <FormField label="Activity Notes" error={errors.activityNotes} required>
          <textarea
            name="activityNotes"
            value={formData.activityNotes || ""}
            onChange={handleChange}
            placeholder="Describe your activities"
            maxLength={200}
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none hover:bg-gray-100 dark:hover:bg-gray-600 ${
              errors.activityNotes
                ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
            } focus:outline-none focus:ring-4`}
            disabled={isLoading}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right font-medium">
            {(formData.activityNotes || "").length}/200 characters
          </div>
        </FormField>

        <FormField label="Date" error={errors.date} required>
          <input
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
              errors.date
                ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
            } focus:outline-none focus:ring-4`}
            disabled={isLoading}
          />
        </FormField>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? <LoadingSpinner /> : "Add Log"}
        </button>
      </form>
    </div>
  )
}
