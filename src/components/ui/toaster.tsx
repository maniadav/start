"use client"

import * as React from "react"
import { useToast } from "../../hooks/useToast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
// Import utility function for classnames
import { cn } from "./utils"
import { ToastPosition } from "../../hooks/useToast"

// Define position classes
const positionClasses: Record<ToastPosition, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
  t: "top-0 left-1/2 -translate-x-1/2",
  b: "bottom-0 left-1/2 -translate-x-1/2"
}

// Custom viewport for each position
const CustomToastViewport = ({ position, className, ...props }: {
  position: ToastPosition,
  className?: string,
  [key: string]: any
}) => (
  <ToastViewport
    className={cn(
      "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px]",
      positionClasses[position],
      position.startsWith("b") ? "flex-col" : "flex-col-reverse",
      className
    )}
    {...props}
  />
)

export function Toaster() {
  const { toasts } = useToast()
  
  // Group toasts by position
  const toastsByPosition = toasts.reduce<Record<ToastPosition, typeof toasts>>((acc, toast) => {
    const position = toast.position || "t";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, typeof toasts>);

  // Get all positions that have toasts
  const activePositions = Object.keys(toastsByPosition) as ToastPosition[];

  return (
    <ToastProvider>
      {activePositions.map(position => (
        <React.Fragment key={position}>
          {toastsByPosition[position].map(({ id, title, description, action, status, ...props }) => (
            <Toast key={id} {...props} className={cn(
              props.className,
              status === "success" && "bg-green-50 border-green-200 text-green-800",
              status === "error" && "bg-red-50 border-red-200 text-red-800",
              status === "info" && "bg-blue-50 border-blue-200 text-blue-800"
            )}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          ))}
          <CustomToastViewport position={position} />
        </React.Fragment>
      ))}
    </ToastProvider>
  )
}
