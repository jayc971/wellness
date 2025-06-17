import type { LoginFormData, SignupFormData, WellnessLogData, ValidationErrors } from "@/types"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateLogin = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.email) {
    errors.email = "Email is required"
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!data.password) {
    errors.password = "Password is required"
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long"
  }

  return errors
}

export const validateSignup = (data: SignupFormData): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.email) {
    errors.email = "Email is required"
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!data.password) {
    errors.password = "Password is required"
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long"
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password"
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return errors
}

export const validateWellnessLog = (data: Partial<WellnessLogData>): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.mood) {
    errors.mood = "Please select your mood"
  }

  if (data.sleepDuration === undefined || data.sleepDuration < 0 || data.sleepDuration > 12) {
    errors.sleepDuration = "Sleep duration must be between 0 and 12 hours"
  }

  if (!data.activityNotes) {
    errors.activityNotes = "Activity notes are required"
  } else if (data.activityNotes.length > 200) {
    errors.activityNotes = "Activity notes must be 200 characters or less"
  }

  return errors
}
