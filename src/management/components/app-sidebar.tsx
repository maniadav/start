"use client";

import { Building2, FileText, Home, Upload, Users, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser, hasRole } from "@management/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@management/components/ui/sidebar";
import UserNav from "@components/user/user-sign-out";
import { useAuth } from "state/provider/AuthProvider";

export function AppSidebar() {
  const pathname = usePathname();
  const { member } = useAuth();

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
  if (hasRole(member, ["admin"])) {
    menuItems = adminItems;
  } else if (hasRole(member, ["organisation"])) {
    menuItems = orgAdminItems;
  } else if (hasRole(member, ["observer"])) {
    menuItems = observerItems;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">START Management</p>
            <p className="text-xs text-muted-foreground capitalize">
              {member.role.replace("_", " ")}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
