import React from "react";
import { Button } from "@components/button/button";
import { PopupModal } from "@components/ui/PopupModal";
import { SortAsc, SortDesc, X } from "lucide-react";
import { FileRequestBody } from "../../hooks/files/useFileFilters";

interface FileSortModalProps {
  show: boolean;
  onClose: () => void;
  requestBody: FileRequestBody;
  pendingRequestBody: FileRequestBody;
  onUpdate: (updates: Partial<FileRequestBody>) => void;
  onSubmit: () => void;
}

export const FileSortModal: React.FC<FileSortModalProps> = ({
  show,
  onClose,
  requestBody,
  pendingRequestBody,
  onUpdate,
  onSubmit,
}) => {
  const handleSort = (field: string, direction: string) => {
    onUpdate({ sortField: field, sortDirection: direction });
  };

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
    <PopupModal
      show={show}
      onRequestClose={onClose}
      customStyle="w-full max-w-2xl h-auto max-h-[80vh] overflow-y-auto"
    >
      <div className="bg-white rounded-lg shadow-xl m-4">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SortAsc className="h-5 w-5 text-green-600" />
              Sort Options
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Size Sort */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                File Size
              </label>
              <div className="space-y-2">
                <Button
                  variant={
                    pendingRequestBody.sortField === "file_size" && pendingRequestBody.sortDirection === "asc"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSort("file_size", "asc")}
                  className="w-full justify-start"
                >
                  <SortAsc className="mr-2 h-4 w-4" />
                  Smallest First
                </Button>
                <Button
                  variant={
                    pendingRequestBody.sortField === "file_size" && pendingRequestBody.sortDirection === "desc"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSort("file_size", "desc")}
                  className="w-full justify-start"
                >
                  <SortDesc className="mr-2 h-4 w-4" />
                  Largest First
                </Button>
              </div>
            </div>

            {/* Date Created Sort */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Date Created
              </label>
              <div className="space-y-2">
                <Button
                  variant={
                    pendingRequestBody.sortField === "date_created" && pendingRequestBody.sortDirection === "asc"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSort("date_created", "asc")}
                  className="w-full justify-start"
                >
                  <SortAsc className="mr-2 h-4 w-4" />
                  Oldest First
                </Button>
                <Button
                  variant={
                    pendingRequestBody.sortField === "date_created" && pendingRequestBody.sortDirection === "desc"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSort("date_created", "desc")}
                  className="w-full justify-start"
                >
                  <SortDesc className="mr-2 h-4 w-4" />
                  Newest First
                </Button>
              </div>
            </div>
          </div>

          {/* Sort Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Current: {getSortFieldLabel(pendingRequestBody.sortField)} (
              {pendingRequestBody.sortDirection === "asc" ? "Ascending" : "Descending"})
            </div>
            <div>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};
