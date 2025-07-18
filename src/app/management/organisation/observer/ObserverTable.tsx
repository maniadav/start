import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Delete, Edit, MoreHorizontal, View } from "lucide-react";
import { DataTable } from "@management/components/data-table";
import { AdvancedFilters } from "@management/components/advanced-filters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import { Button } from "@management/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { Badge } from "@management/components/ui/badge";
import type {
  Organisation,
  FilterOptions,
  Status,
} from "@type/management.types";

interface OrganisationTableProps {
  data: Organisation[];
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  hasLimitedData?: boolean;
  handleOrgActions: (action: string, observer_id: string) => void;
}

export function ObserverTable({
  data,
  filters,
  setFilters,
  hasLimitedData = false,
  handleOrgActions,
}: OrganisationTableProps) {
  const columns: ColumnDef<Organisation>[] = React.useMemo(
    () => [
      {
        accessorKey: "organisation_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Organisation ID
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
              Observer Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "joined_on",
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
        header: "Observer Email",
        cell: ({ row }) => {
          const email = row.getValue("email");
          return email || "N/A";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as Status;
          if (!status) return "N/A";
          return (
            <Badge
              variant={
                status === "active"
                  ? "default"
                  : status === "pending"
                  ? "secondary"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const org = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-white p-8">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white py-2">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions("view", org.unique_id || org.user_id || "")
                  }
                >
                  <View className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions("edit", org.unique_id || org.user_id || "")
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions(
                      "delete",
                      org.unique_id || org.user_id || ""
                    )
                  }
                >
                  <Delete className="mr-2 h-4 w-4" />
                  Delete Organisation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organisation Management</CardTitle>
        <div className="flex items-center gap-2">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            showStorageFilter={!hasLimitedData}
            showUserCountFilter={!hasLimitedData}
            showStatusFilter
            showDateFilter
          />
        </div>
      </CardHeader>
      <CardContent className="w-auto overflow-x-scroll">
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by name..."
        />
      </CardContent>
    </Card>
  );
}
