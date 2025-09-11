import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Delete,
  View,
  Ellipsis,
  Key,
  Trash2,
} from "lucide-react";
import { Badge } from "@management/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { DataTable } from "@components/table/table";

export function OrganisationTable({
  data,
  handleOrgActions,
  hideSearchBar = false,
}: any) {
  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      {
        accessorKey: "user_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Org ID
            </Button>
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Org Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "joinedOn",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Joined On
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const joinedOn = row.getValue("joined_on");
          return joinedOn
            ? new Date(joinedOn as string).toLocaleDateString()
            : "N/A";
        },
      },
      {
        accessorKey: "email",
        header: "Org Email",
        cell: ({ row }) => {
          const email = row.getValue("email");
          return email || "N/A";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          if (!status) return "N/A";
          return <Badge>{String(status)}</Badge>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const org = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuLabel>File Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions(
                      "credential",
                      org.unique_id || org.user_id || ""
                    )
                  }
                >
                  <Key className="mr-2 h-4 w-4" />
                  Set Credentials
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions("edit", org.unique_id || org.user_id || "")
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions(
                      "delete",
                      org.unique_id || org.user_id || ""
                    )
                  }
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleOrgActions]
  );

  return (
    <DataTable data={data} columns={columns} summaryLabel="organisations" />
  );
}
