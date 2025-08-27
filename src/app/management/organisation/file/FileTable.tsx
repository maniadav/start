import * as React from "react";
import { DataTable } from "components/table/data-table";
import { Badge } from "@management/components/ui/badge";
import { Button } from "@management/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Delete,
  Download,
  Edit,
  MoreHorizontal,
  View,
} from "lucide-react";
import {
  formatFileSize,
  getOrganizations,
  getSurveys,
  getObservers,
} from "@management/lib/data-service";
import { getUsers } from "@management/lib/auth";
import type { UploadedFile } from "@type/management.types";
import type { ColumnDef } from "@tanstack/react-table";

interface FileData {
  task_id: string;
  file_size: number;
  organisation_id: string;
  observer_id: string;
  child_id: string;
  date_created: string;
  file_url: string;
  last_updated: string;
}

interface FileTableProps {
  data: FileData[];
}

export function FileTable({ data }: FileTableProps) {
  const surveys = getSurveys();
  const observers = getObservers();
  const organizations = getOrganizations();
  const users = getUsers();

  const columns: ColumnDef<FileData>[] = [
    {
      accessorKey: "task_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "file_size",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Size
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {formatFileSize(row.getValue("file_size"))}
          </div>
        );
      },
    },
    {
      accessorKey: "organisation_id",
      header: "Organisation ID",
      cell: ({ row }) => {
        const orgId = row.getValue("organisation_id") as string;
        const org = organizations.find(
          (o) => o.unique_id === orgId || o.user_id === orgId
        );
        return (
          <div>
            <div className="font-medium">{orgId}</div>
            {org && (
              <div className="text-xs text-muted-foreground mt-1">
                {org.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "observer_id",
      header: "Observer ID",
      cell: ({ row }) => {
        const observerId = row.getValue("observer_id") as string;
        const observer = observers.find((o) => o.id === observerId);
        return (
          <div>
            <div className="font-medium">{observerId}</div>
            {observer && (
              <div className="text-xs text-muted-foreground mt-1">
                {observer.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "child_id",
      header: "Child ID",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("child_id")}</div>;
      },
    },
    {
      accessorKey: "date_created",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return new Date(row.getValue("date_created")).toLocaleString();
      },
    },
    {
      accessorKey: "last_updated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return new Date(row.getValue("last_updated")).toLocaleString();
      },
    },
    {
      accessorKey: "file_url",
      header: "File URL",
      cell: ({ row }) => {
        const url = row.getValue("file_url") as string;
        return (
          <div className="max-w-[200px] truncate">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {url}
            </a>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;

        const handleDownload = () => {
          const link = document.createElement("a");
          link.href = file.file_url;
          link.download = `${file.task_id}_${file.child_id}`;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.click();
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white py-2">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onClick={() =>
              //   handleOrgActions("view", org.unique_id || org.user_id || "")
              // }
              >
                <View className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={() =>
              //   handleOrgActions("edit", org.unique_id || org.user_id || "")
              // }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={() =>
              //   handleOrgActions("delete", org.unique_id || org.user_id || "")
              // }
              >
                <Delete className="mr-2 h-4 w-4" />
                Delete Organisation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="task_id"
      searchPlaceholder="Search by task ID or child ID..."
    />
  );
}
