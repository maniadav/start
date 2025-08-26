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
    if (!user || !user?.childId) {
      if (protectedRoutes.includes(currentPath)) {
        router.push(PAGE_ROUTES.MANAGEMENT.OBSERVER.CHILD.path);
        return;
      }
    }
  }, [router, user, currentPath, protectedRoutes]);

  useEffect(() => {
    if (!hasValidRole(member, ["observer"])) {
      router.push(PAGE_ROUTES.LOGIN.path);
      return;
    }
  }, [member, router]);

  if (!member || !hasValidRole(member, ["observer"])) {
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
