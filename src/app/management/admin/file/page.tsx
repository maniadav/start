"use client";

import * as React from "react";

import {
  getFiles,
  getOrganizations,
  getSurveys,
  getObservers,
} from "@management/lib/data-service";
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
        <CardContent className="w-auto overflow-x-scroll">
          <FileTable data={filteredFiles} />
        </CardContent>
      </Card>
    </div>
  );
}
