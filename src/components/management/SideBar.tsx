"use client";

import {
  Building2,
  FileText,
  LayoutDashboard,
  Users,
  Eye,
  UploadCloudIcon,
  NotebookPen,
  CircleArrowOutUpLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@components/management/SidebarProvider";
import { useAuth } from "state/provider/AuthProvider";
import React from "react";
import { UserNav } from "@components/ui/UserNav";

export function SideBar() {
  const pathname = usePathname();

  const { member } = useAuth();

  const { collapsed, toggleSidebar } = useSidebar();

  if (!member) return null;

  const adminItems = [
    {
      title: "Home",
      url: "/",
      icon: CircleArrowOutUpLeft,
    },
    {
      title: "Dashboard",
      url: "/management/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Organisation",
      url: "/management/admin/organisation",
      icon: Building2,
    },
    {
      title: "Observer",
      url: "/management/admin/observer",
      icon: Eye,
    },
    {
      title: "All Files",
      url: "/management/admin/files",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/management/admin/settings",
      icon: Settings,
    },
  ];

  const orgAdminItems = [
    {
      title: "Home",
      url: "/",
      icon: CircleArrowOutUpLeft,
    },
    {
      title: "Dashboard",
      url: "/management/organisation/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Observer",
      url: "/management/organisation/observer",
      icon: Eye,
    },

    {
      title: "File Manager",
      url: "/management/organisation/files",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/management/organisation/settings",
      icon: Settings,
    },
  ];

  const observerItems = [
    {
      title: "Home",
      url: "/",
      icon: CircleArrowOutUpLeft,
    },
    {
      title: "Dashboard",
      url: "/management/observer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Child",
      url: "/management/observer/child",
      icon: Users,
    },
    {
      title: "Upload Survey",
      url: "/management/observer/upload",
      icon: UploadCloudIcon,
    },
    {
      title: "Start Survey",
      url: "/management/observer/survey",
      icon: NotebookPen,
    },
    {
      title: "Settings",
      url: "/management/observer/settings",
      icon: Settings,
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
      className={`h-screen border-r-2 border-gray-100 flex flex-col min-h-screen bg-background transition-all duration-200 ${
        collapsed ? "w-16 items-center justify-center" : "w-64"
      }`}
    >
      {/* Top Title */}
      <div className="flex items-center gap-2 px-2 py-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold">START Management</p>
            <p className="text-xs text-muted-foreground capitalize">
              {member.role.replace("_", " ")}
            </p>
          </div>
        )}
      </div>

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
                  ? "bg-primary text-white"
                  : "hover:bg-gray-200 text-muted-foreground"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t p-2 flex justify-center">
        <UserNav />
      </div>
    </aside>
  );
}
