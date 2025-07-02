"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@management/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent data-[pressed=true]:bg-accent data-[pressed=true]:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed=true]:bg-accent data-[pressed=true]:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToggleProps extends 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
  VariantProps<typeof toggleVariants> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, onPressedChange, children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(false)
    const isPressed = pressed !== undefined ? pressed : internalPressed

    const handleClick = () => {
      const newPressed = !isPressed
      if (onPressedChange) {
        onPressedChange(newPressed)
      } else {
        setInternalPressed(newPressed)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isPressed}
        data-pressed={isPressed}
        className={cn(toggleVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
