import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-4 pt-4 pb-2 font-semibold text-lg", className)} {...props} />
)

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-4 pb-4", className)} {...props} />
)

const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-4 pt-2 pb-4", className)} {...props} />
)

export { Card, CardHeader, CardContent, CardFooter }
