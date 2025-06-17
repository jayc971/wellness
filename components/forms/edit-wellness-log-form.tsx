import type React from "react"
import { useState } from "react"
import type { WellnessLogData, ValidationErrors } from "@/types"
import { validateWellnessLog } from "@/lib/validation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateLog } from "@/store/slices/wellnessSlice"
import { FormField } from "@/components/ui/form-field"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface EditWellnessLogFormProps {
  log: WellnessLogData
  onSuccess: () => void
  onCancel: () => void
}

export function EditWellnessLogForm({ log, onSuccess, onCancel }: EditWellnessLogFormProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<WellnessLogData>>({
    mood: log.mood,
    sleepDuration: log.sleepDuration,
    activityNotes: log.activityNotes,
    date: log.date,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitError, setSubmitError] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const processedValue = name === "sleepDuration" ? Number(value) : value

    setFormData((prev) => ({ ...prev, [name]: processedValue }))

    // Clear field error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    setSubmitError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateWellnessLog(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (!user) return

    setIsLoading(true)
    try {
      await dispatch(
        updateLog({
          logId: log.id!,
          logData: {
            ...(formData as WellnessLogData),
            userId: user.id,
            date: formData.date || log.date,
          },
        }),
      ).unwrap()

      onSuccess()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update log")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {submitError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 font-medium">{submitError}</p>
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
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600",
                errors.date
                  ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                  : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700",
                !formData.date && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date ? date.toISOString().split("T")[0] : undefined,
                }))
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

      <FormField label="Activity" error={errors.activityNotes} required>
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

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:shadow-md transform hover:scale-105"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 disabled:transform-none"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading ? "Updating..." : "Update Log Entry"}
        </button>
      </div>
    </form>
  )
}
