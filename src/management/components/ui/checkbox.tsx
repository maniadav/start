"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@management/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(false)
    const isChecked = checked !== undefined ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e)
      } else {
        setInternalChecked(e.target.checked)
      }
    }

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isChecked ? "bg-primary text-primary-foreground" : "bg-background",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          {isChecked && (
            <div className="flex items-center justify-center text-current">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
