"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
} from "@management/components/ui/sidebar";
import { AppSidebar } from "@management/components/app-sidebar";
import { getCurrentMember, hasValidRole } from "@utils/auth.utils";
import { PAGE_ROUTES } from "@constants/route.constant";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const member = getCurrentMember();

  useEffect(() => {
    if (!member) {
      router.push(PAGE_ROUTES.LOGIN.path);
      return;
    }

    if (!hasValidRole(member, ["admin"])) {
      router.push(PAGE_ROUTES.LOGIN.path);
      return;
    }
  }, [member, router]);

  if (!member || !hasValidRole(member, ["admin"])) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
