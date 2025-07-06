"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Download, MoreHorizontal } from "lucide-react";

import {
  getFiles,
  getOrganizations,
  getSurveys,
  getObservers,
  formatFileSize,
} from "@management/lib/data-service";
import { getUsers } from "@management/lib/auth";
import { Button } from "@management/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { Badge } from "@management/components/ui/badge";
import { DataTable } from "@management/components/data-table";
import { AdvancedFilters } from "@management/components/advanced-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@management/components/ui/select";
import { Label } from "@management/components/ui/label";
import type { UploadedFile, FilterOptions } from "@type/management.types";
import SidebarTrigger from "@management/SidebarTrigger";
import { FileFilters } from "./FileFilters";
import { FileTable } from "./FileTable";

export default function AdminFilesPage() {
  const [files] = React.useState(getFiles());
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [surveyFilter, setSurveyFilter] = React.useState<string>("all");
  const [orgFilter, setOrgFilter] = React.useState<string>("all");
  const [observerFilter, setObserverFilter] = React.useState<string>("all");

  const organizations = getOrganizations();
  const surveys = getSurveys();
  const users = getUsers();
  const observers = getObservers();

  // Filter files based on current filters
  const filteredFiles = React.useMemo(() => {
    let filtered = [...files];

    if (filters.search) {
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          file.id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (surveyFilter !== "all") {
      filtered = filtered.filter((file) => file.surveyId === surveyFilter);
    }

    if (orgFilter !== "all") {
      filtered = filtered.filter((file) => file.organizationId === orgFilter);
    }

    if (observerFilter !== "all") {
      filtered = filtered.filter((file) => file.observerId === observerFilter);
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter((file) => {
        const fileDate = new Date(file.uploadedAt);
        if (filters.dateRange?.from && fileDate < filters.dateRange.from)
          return false;
        if (filters.dateRange?.to && fileDate > filters.dateRange.to)
          return false;
        return true;
      });
    }

    return filtered;
  }, [files, filters, surveyFilter, orgFilter, observerFilter]);

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
            <Badge variant="outline">{surveyId}</Badge>
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
            <Badge variant="outline">{observerId}</Badge>
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
            <Badge variant="outline">{orgId}</Badge>
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
            <Badge variant="outline">{userId}</Badge>
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">
          All Uploaded Files
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <FileFilters
            filters={filters}
            setFilters={setFilters}
            surveyFilter={surveyFilter}
            setSurveyFilter={setSurveyFilter}
            orgFilter={orgFilter}
            setOrgFilter={setOrgFilter}
            observerFilter={observerFilter}
            setObserverFilter={setObserverFilter}
            surveys={surveys}
            organizations={organizations}
            observers={observers}
          />
        </CardHeader>
        <CardContent>
          <FileTable columns={columns} data={filteredFiles} />
        </CardContent>
      </Card>
    </div>
  );
}
