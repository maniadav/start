"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/button/button";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { useAuth } from "state/provider/AuthProvider";
import { PAGE_ROUTES } from "@constants/route.constant";
import { logOut } from "@utils/auth.utils";
import { useSidebar } from "@components/management/SidebarProvider";

export function UserNav() {
  const router = useRouter();
  const { member } = useAuth();
  const { collapsed } = useSidebar();
  if (!member) return null;

  const handleLogout = () => {
    logOut();
    router.push(PAGE_ROUTES.LOGIN.path);
  };

  return (
    <div className="w-full flex flex-row items-start justify-start">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {member.profile.name
            .split(" ")
            .map((n: any[]) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="ml-2 flex flex-col items-start">
          <p className="text-sm font-medium">{member.profile.name}</p>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </div>
      )}
    </div>
  );
}
