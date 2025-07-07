import * as React from "react";
import { DataTable } from "@management/components/data-table";
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
import { ArrowUpDown, Download, MoreHorizontal } from "lucide-react";
import {
  formatFileSize,
  getOrganizations,
  getSurveys,
  getObservers,
} from "@management/lib/data-service";
import { getUsers } from "@management/lib/auth";
import type { UploadedFile } from "@type/management.types";
import type { ColumnDef } from "@tanstack/react-table";

interface FileTableProps {
  data: UploadedFile[];
}

export function FileTable({ data }: FileTableProps) {
  const surveys = getSurveys();
  const observers = getObservers();
  const organizations = getOrganizations();
  const users = getUsers();

  const columns: ColumnDef<UploadedFile>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "surveyId",
      header: "Survey ID",
      cell: ({ row }) => {
        const surveyId = row.getValue("surveyId") as string;
        const survey = surveys.find((s) => s.id === surveyId);
        return (
          <div>
            {survey && (
              <div className="text-xs text-muted-foreground mt-1">
                {survey.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "observerId",
      header: "Observer ID",
      cell: ({ row }) => {
        const observerId = row.getValue("observerId") as string;
        const observer = observers.find((o) => o.id === observerId);
        return (
          <div>
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
      accessorKey: "organizationId",
      header: "Org ID",
      cell: ({ row }) => {
        const orgId = row.getValue("organizationId") as string;
        const org = organizations.find((o) => o.id === orgId);
        return (
          <div>
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
      accessorKey: "uploadedBy",
      header: "User ID",
      cell: ({ row }) => {
        const userId = row.getValue("uploadedBy") as string;
        const user = users.find((u) => u.id === userId);
        return (
          <div>
            {user && (
              <div className="text-xs text-muted-foreground mt-1">
                {user.id}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "uploadedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Uploaded At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return new Date(row.getValue("uploadedAt")).toLocaleString();
      },
    },
    {
      accessorKey: "size",
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
        return formatFileSize(row.getValue("size"));
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;

        const handleDownload = () => {
          const link = document.createElement("a");
          link.href = `data:text/csv;charset=utf-8,Sample CSV content for ${file.name}`;
          link.download = file.name;
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>View Survey</DropdownMenuItem>
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
      searchKey="name"
      searchPlaceholder="Search by file name or ID..."
    />
  );
}
