"use client";

import {
  Building2,
  FileText,
  Home,
  Upload,
  Users,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { useSidebar } from "@management/components/SidebarProvider";
import { useAuth } from "state/provider/AuthProvider";
import React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@management/components/ui/button";
import { cn } from "@management/lib/utils";

export function SideBar() {
  const pathname = usePathname();

  const { member } = useAuth();

  const { collapsed, toggleSidebar } = useSidebar();

  if (!member) return null;

  const adminItems = [
    {
      title: "Dashboard",
      url: "/management/admin/dashboard",
      icon: Home,
    },
    {
      title: "Organizations",
      url: "/management/admin/organizations",
      icon: Building2,
    },
    {
      title: "All Files",
      url: "/management/admin/files",
      icon: FileText,
    },
  ];

  const orgAdminItems = [
    {
      title: "Dashboard",
      url: "/org",
      icon: Home,
    },
    {
      title: "Observers",
      url: "/org/observers",
      icon: Eye,
    },
    {
      title: "Surveys",
      url: "/org/surveys",
      icon: FileText,
    },
    {
      title: "Upload Files",
      url: "/org/upload",
      icon: Upload,
    },
    {
      title: "File Manager",
      url: "/org/files",
      icon: FileText,
    },
  ];

  const observerItems = [
    {
      title: "Dashboard",
      url: "/observer",
      icon: Home,
    },
    {
      title: "Users",
      url: "/observer/users",
      icon: Users,
    },
    {
      title: "Files",
      url: "/observer/files",
      icon: FileText,
    },
  ];

  interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  let menuItems: MenuItem[] = [];
  if (member.role === "admin") {
    menuItems = adminItems;
  } else if (member.role === "organisation") {
    menuItems = orgAdminItems;
  } else if (member.role === "observer") {
    menuItems = observerItems;
  }

  return (
    <aside
      className={`flex flex-col min-h-screen bg-background border-r transition-all duration-200 ${
        collapsed ? "w-[40px]" : "w-[100px]"
      }`}
    >
      {/* Collapse/Expand Icon */}
      <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7",
          collapsed ? "self-center mt-2" : "ml-2 mt-2",
          "mb-2"
        )}
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      {/* Top Title */}
      {!collapsed && (
        <div className="flex items-center gap-2 px-2 py-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">START Manager</p>
            <p className="text-xs text-muted-foreground capitalize">
              {member.role.replace("_", " ")}
            </p>
          </div>
        </div>
      )}
      {/* Menu Items */}
      <nav className={`flex-1 ${collapsed ? "px-0" : "px-2"} py-4 space-y-1`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
      {/* Logout at Bottom */}
      <div className="mt-auto border-t p-2 flex justify-center">
        <UserNav />
      </div>
    </aside>
  );
}
