import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@lib/utils";
import { ButtonProps, buttonVariants } from "@components/button/button"

// Types for better readability
interface PaginationProps extends React.ComponentProps<"nav"> {
  className?: string
}

interface PaginationContentProps extends React.ComponentProps<"ul"> {
  className?: string
}

interface PaginationItemProps extends React.ComponentProps<"li"> {
  className?: string
}

interface PaginationLinkProps extends React.ComponentProps<"a"> {
  isActive?: boolean
  size?: ButtonProps["size"]
}

interface PaginationNavigationProps extends React.ComponentProps<typeof PaginationLink> {
  className?: string
}

// Main Pagination Container
const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)

// Pagination Content List
const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
)

// Individual Pagination Item
const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
)

// Pagination Link with Active State
const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
)

// Previous Page Button
const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationNavigationProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  )
)

// Next Page Button
const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNavigationProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
)

// Ellipsis for Truncated Pages
const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

// Set display names for better debugging
Pagination.displayName = "Pagination"
PaginationContent.displayName = "PaginationContent"
PaginationItem.displayName = "PaginationItem"
PaginationLink.displayName = "PaginationLink"
PaginationPrevious.displayName = "PaginationPrevious"
PaginationNext.displayName = "PaginationNext"
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
