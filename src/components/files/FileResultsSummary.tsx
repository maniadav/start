import React from "react";
import { Badge } from "@management/components/ui/badge";
import { FileRequestBody } from "../../hooks/files/useFileFilters";

interface FileResultsSummaryProps {
  dataLength: number;
  hasActiveFiltersOrSorts: boolean;
  activeFiltersCount: number;
  requestBody: FileRequestBody;
}

export const FileResultsSummary: React.FC<FileResultsSummaryProps> = ({
  dataLength,
  hasActiveFiltersOrSorts,
  activeFiltersCount,
  requestBody,
}) => {
  if (!hasActiveFiltersOrSorts) return null;

  const getSortFieldLabel = (field?: string) => {
    switch (field) {
      case "file_size":
        return "File Size";
      case "date_created":
        return "Date Created";
      case "task_id":
        return "Task ID";
      case "child_id":
        return "Child ID";
      default:
        return field || "Unknown";
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="secondary">{dataLength} files found</Badge>
      {activeFiltersCount > 0 && (
        <span>
          • {activeFiltersCount} filter
          {activeFiltersCount !== 1 ? "s" : ""} active
        </span>
      )}
      {(requestBody.sortField !== "date_created" ||
        requestBody.sortDirection !== "desc") && (
        <span>
          • Sorted by {getSortFieldLabel(requestBody.sortField)}
        </span>
      )}
    </div>
  );
};
