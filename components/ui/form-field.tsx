import type React from "react"

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
  className?: string
}

export function FormField({ label, error, children, required, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  )
}
