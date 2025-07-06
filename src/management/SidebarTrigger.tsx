import React from "react";
import { Button } from "@management/components/ui/button";
import { useSidebar } from "./SidebarProvider";
import { cn } from "./lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const SidebarTrigger = () => {
  const { collapsed, toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 p-2 flex text-primary border border-primary")}
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronsRight className="h-4 w-4" />
      ) : (
        <ChevronsLeft className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
