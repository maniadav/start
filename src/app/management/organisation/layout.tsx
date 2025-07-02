"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, hasRole } from "@management/lib/auth"
import { SidebarProvider, SidebarInset } from "@management/components/ui/sidebar"
import { AppSidebar } from "@management/components/app-sidebar"

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!hasRole(user, ["organisation"])) {
      router.push("/login")
      return
    }
  }, [user, router])

  if (!user || !hasRole(user, ["organisation"])) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
