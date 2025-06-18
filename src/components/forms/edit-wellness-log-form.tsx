import type React from "react"
import { useState } from "react"
import type { WellnessLogData, ValidationErrors } from "../../types"
import { validateWellnessLog } from "../../lib/validation"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { updateLog } from "../../store/slices/wellnessSlice"
import { FormField } from "../ui/form-field"
import { LoadingSpinner } from "../ui/loading-spinner"

interface EditWellnessLogFormProps {
  log: WellnessLogData
  onSuccess: () => void
  onCancel: () => void
}

export function EditWellnessLogForm({ log, onSuccess, onCancel }: EditWellnessLogFormProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.wellness)

  const [formData, setFormData] = useState<Partial<WellnessLogData>>({
    mood: log.mood,
    sleepDuration: log.sleepDuration,
    activityNotes: log.activityNotes,
    date: log.date,
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

    try {
      await dispatch(updateLog({ logId: log.id!, logData: formData })).unwrap()
      onSuccess()
    } catch (error) {
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Date" error={errors.date} required>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Mood" error={errors.mood} required>
        <select
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          value={formData.activityNotes}
          onChange={handleChange}
          placeholder="What did you do today? How are you feeling?"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </FormField>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:shadow-md transform hover:scale-105"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
