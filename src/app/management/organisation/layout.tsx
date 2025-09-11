"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentMember, hasValidRole } from "@utils/auth.utils";
import { PAGE_ROUTES } from "@constants/route.constant";
import { cn } from "@lib/utils";
import { SideBar } from "@management/SideBar";
import { SidebarProvider } from "@management/SidebarProvider";

export default function OrgnisationLayout({
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

    if (!hasValidRole(member, ["organisation"])) {
      router.push(PAGE_ROUTES.LOGIN.path);
      return;
    }
  }, [member, router]);

  if (!member || !hasValidRole(member, ["organisation"])) {
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
