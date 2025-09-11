import React from "react";
import { Button } from "@components/button/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import {
  Filter,
  SortAsc,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";
import { FileRequestBody } from "../../hooks/files/useFileFilters";

interface FileControlBarProps {
  requestBody: FileRequestBody;
  onUpdate: (updates: Partial<FileRequestBody>) => void;
  onFilterClick: () => void;
  onSortClick: () => void;
  onBulkDownloadClick: () => void;
  onResetClick: () => void;
  activeFiltersCount: number;
  hasActiveFiltersOrSorts: boolean;
}

export const FileActions: React.FC<FileControlBarProps> = ({
  requestBody,
  onUpdate,
  onFilterClick,
  onSortClick,
  onBulkDownloadClick,
  onResetClick,
  activeFiltersCount,
  hasActiveFiltersOrSorts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Task ID, Child ID, Organisation, or Observer..."
          value={requestBody.searchTerm || ""}
          onChange={(e) => onUpdate({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Sort Button */}
        {/* <Button
          variant="outline"
          onClick={onSortClick}
          className="flex items-center gap-2"
        >
          <SortAsc className="h-4 w-4" />
          Sort
          {(requestBody.sortField !== "date_created" ||
            requestBody.sortDirection !== "desc") && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 text-xs"
            >
              1
            </Badge>
          )}
        </Button> */}

        {/* Bulk Download Button */}
        <Button
          variant="outline"
          onClick={onBulkDownloadClick}
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <Download className="h-4 w-4" />
          Bulk Download
        </Button>

        {/* Reset Button */}
        {hasActiveFiltersOrSorts && (
          <Button
            variant="outline"
            onClick={onResetClick}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
