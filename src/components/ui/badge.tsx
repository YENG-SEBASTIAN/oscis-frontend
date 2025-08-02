import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive"
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
  }

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  )
}
