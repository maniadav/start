"use client";

import type React from "react";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@management/SidebarProvider";
import { getCurrentMember, hasValidRole } from "@utils/auth.utils";
import { PAGE_ROUTES } from "@constants/route.constant";
import { cn } from "@management/lib/utils";
import { SideBar } from "@management/SideBar";
import { useAuth } from "state/provider/AuthProvider";

export default function OrgnisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const member = getCurrentMember();
  const { user } = useAuth();
  const path = usePathname();
  const currentPath = path.split("?")[0];

  const protectedRoutes = useMemo(
    () => [
      PAGE_ROUTES.MANAGEMENT.OBSERVER.SURVEY.path,
      PAGE_ROUTES.MANAGEMENT.OBSERVER.SURVEY_UPLOAD.path,
    ],
    []
  );

  useEffect(() => {
    // Prevent infinite redirects by checking if we're already on the target route
    if (!hasValidRole(member, ["observer"])) {
      if (path !== PAGE_ROUTES.LOGIN.path) {
        router.push(PAGE_ROUTES.LOGIN.path);
      }
      return;
    }

    // Check if user has required metadata for protected routes
    if (!user || !user?.childId) {
      if (protectedRoutes.includes(currentPath)) {
        if (path !== PAGE_ROUTES.MANAGEMENT.OBSERVER.CHILD.path) {
          router.push(PAGE_ROUTES.MANAGEMENT.OBSERVER.CHILD.path);
        }
        return;
      }
    }
  }, [member, router, user, currentPath, protectedRoutes, path]);

  // Show loading state while checking authentication
  if (!member) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check role after member is loaded
  if (!hasValidRole(member, ["observer"])) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SideBar />
        <main
          className={cn(
            "overflow-y-scroll relative flex min-h-svh flex-1 flex-col bg-background",
            "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow"
          )}
        >
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
