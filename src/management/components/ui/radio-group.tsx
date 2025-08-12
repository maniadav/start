"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@management/lib/utils"

interface RadioGroupContextProps {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextProps | undefined>(undefined)

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  className?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = React.useCallback((newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }, [onValueChange])

    const contextValue = React.useMemo(
      () => ({ value: currentValue, onValueChange: handleValueChange, name }),
      [currentValue, handleValueChange, name]
    )

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string
  className?: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup")
    }

    const isChecked = context.value === value
    const radioId = id || `radio-${value}`

    const handleChange = () => {
      context.onValueChange?.(value)
    }

    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={context.name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
            className
          )}
        >
          {isChecked && (
            <Circle className="h-2.5 w-2.5 fill-current text-current" />
          )}
        </div>
        {children}
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
