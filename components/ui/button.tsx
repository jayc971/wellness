import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg transform hover:scale-[1.02]",
      destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transform hover:scale-[1.02]",
      outline:
        "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transform hover:scale-105",
      secondary:
        "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md transform hover:scale-105",
      ghost:
        "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transform hover:scale-105",
      link: "text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-11 rounded-xl px-8",
      icon: "h-10 w-10",
    }

    return <button className={cn(baseClasses, variants[variant], sizes[size], className)} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
