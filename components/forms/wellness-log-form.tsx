"use client"

import type React from "react"
import { useState } from "react"
import type { WellnessLogData, ValidationErrors } from "@/types"
import { validateWellnessLog } from "@/lib/validation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createLog } from "@/store/slices/wellnessSlice"
import { FormField } from "@/components/ui/form-field"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function WellnessLogForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading, error } = useAppSelector((state) => state.wellness)

  const [formData, setFormData] = useState<Partial<WellnessLogData>>({
    mood: undefined,
    sleepDuration: 8,
    activityNotes: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const processedValue = name === "sleepDuration" ? Number(value) : value

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    // Clear field error when user starts typing
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
          date: formData.date || new Date().toISOString().split("T")[0],
        }),
      ).unwrap()

      // Reset form
      setFormData({
        mood: undefined,
        sleepDuration: 8,
        activityNotes: "",
        date: new Date().toISOString().split("T")[0],
      })
      setErrors({})
    } catch (error) {
      // Error is handled by Redux
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add Wellness Log</h3>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <FormField label="How are you feeling?" error={errors.mood} required>
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

        <FormField label="Date" error={errors.date} required>
          <Popover>
            <PopoverTrigger asChild>
              <button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-auto px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600",
                  errors.date
                    ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                    : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700",
                  !formData.date && "text-muted-foreground",
                  "focus:outline-none focus:ring-4" // Added ring styles on focus
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="flex-1">
                  {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
              align="start"
            >
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, date: date ? date.toISOString().split("T")[0] : undefined }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormField>

        <FormField label={`Sleep Duration: ${formData.sleepDuration} hours`} error={errors.sleepDuration} required>
          <div className="relative">
            <input
              type="range"
              name="sleepDuration"
              min="0"
              max="12"
              step="0.15"
              value={formData.sleepDuration || 8}
              onChange={handleChange}
              className="w-full h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg appearance-none cursor-pointer slider-custom"
              disabled={isLoading}
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((formData.sleepDuration || 8) / 12) * 100}%, #dcfce7 ${((formData.sleepDuration || 8) / 12) * 100}%, #dcfce7 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </FormField>

        <FormField label="Activity" error={errors.activityNotes} required className="flex-1">
          <textarea
            name="activityNotes"
            value={formData.activityNotes || ""}
            onChange={handleChange}
            placeholder="Describe your activities, thoughts, or observations..."
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading ? "Saving..." : "Save Log Entry"}
        </button>
      </form>
    </div>
  )
}
