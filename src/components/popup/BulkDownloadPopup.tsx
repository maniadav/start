import React, { useState, useMemo } from "react";
import { Button } from "@components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "@management/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PopupModal } from "components/common/PopupModal";
import {
  Download,
  Filter,
  X,
  Calendar,
  User,
  Building,
  FileText,
  HardDrive,
  CheckCircle,
  Clock,
} from "lucide-react";

interface BulkDownloadPopupProps {
  show: boolean;
  onClose: () => void;
  data: any[];
  onDownload: (filters: any) => Promise<void>;
}

export function BulkDownloadPopup({
  show,
  onClose,
  data,
  onDownload,
}: BulkDownloadPopupProps) {
  // Filter states
  const [selectedObserver, setSelectedObserver] = useState<string>("all");
  const [selectedOrganization, setSelectedOrganization] =
    useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [fileSizeRange, setFileSizeRange] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: Infinity,
  });

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  // Get unique values for filter dropdowns
  const uniqueObservers = useMemo(() => {
    const observers = [...new Set(data.map((file) => file.observer_id))];
    return observers.sort();
  }, [data]);

  const uniqueOrganizations = useMemo(() => {
    const orgs = [...new Set(data.map((file) => file.organisation_id))];
    return orgs.sort();
  }, [data]);

  const uniqueTasks = useMemo(() => {
    const tasks = [...new Set(data.map((file) => file.task_id))];
    return tasks.sort();
  }, [data]);

  // Calculate filtered data count
  const filteredDataCount = useMemo(() => {
    return data.filter((file) => {
      // Observer filter
      if (selectedObserver !== "all" && file.observer_id !== selectedObserver) {
        return false;
      }

      // Organization filter
      if (
        selectedOrganization !== "all" &&
        file.organisation_id !== selectedOrganization
      ) {
        return false;
      }

      // Task filter
      if (selectedTask !== "all" && file.task_id !== selectedTask) {
        return false;
      }

      // Date range filter
      if (
        dateRange.start &&
        new Date(file.date_created) < new Date(dateRange.start)
      ) {
        return false;
      }
      if (
        dateRange.end &&
        new Date(file.date_created) > new Date(dateRange.end)
      ) {
        return false;
      }

      // File size filter
      if (fileSizeRange.min > 0 && file.file_size < fileSizeRange.min) {
        return false;
      }
      if (
        fileSizeRange.max !== Infinity &&
        file.file_size > fileSizeRange.max
      ) {
        return false;
      }

      return true;
    }).length;
  }, [
    data,
    selectedObserver,
    selectedOrganization,
    selectedTask,
    dateRange,
    fileSizeRange,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedObserver("all");
    setSelectedOrganization("all");
    setSelectedTask("all");
    setDateRange({ start: "", end: "" });
    setFileSizeRange({ min: 0, max: Infinity });
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedObserver !== "all" ||
    selectedOrganization !== "all" ||
    selectedTask !== "all" ||
    dateRange.start ||
    dateRange.end ||
    fileSizeRange.min > 0 ||
    fileSizeRange.max !== Infinity;

  // Handle bulk download
  const handleBulkDownload = async () => {
    if (filteredDataCount === 0) {
      setDownloadStatus("No files match the selected criteria");
      return;
    }

    setIsDownloading(true);
    setDownloadStatus("Initiating bulk download...");

    try {
      const filters = {
        observerId: selectedObserver !== "all" ? selectedObserver : undefined,
        organisationId:
          selectedOrganization !== "all" ? selectedOrganization : undefined,
        taskId: selectedTask !== "all" ? selectedTask : undefined,
        dateStart: dateRange.start || undefined,
        dateEnd: dateRange.end || undefined,
        fileSizeMin: fileSizeRange.min > 0 ? fileSizeRange.min : undefined,
        fileSizeMax:
          fileSizeRange.max !== Infinity ? fileSizeRange.max : undefined,
      };

      await onDownload(filters);
      setDownloadStatus("Download initiated successfully!");

      // Close popup after successful download
      setTimeout(() => {
        onClose();
        setDownloadStatus("");
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error("Bulk download error:", error);
      setDownloadStatus("Failed to initiate download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PopupModal
      show={show}
      onRequestClose={onClose}
      customStyle="w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto"
    >
      <div className="bg-white rounded-lg shadow-xl m-4">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Bulk Download Files
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-primary font-bold" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Filter Options */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Download Criteria
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Observer Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Observer
                </label>
                <select
                  value={selectedObserver}
                  onChange={(e) => setSelectedObserver(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Observers</option>
                  {uniqueObservers.map((observer) => (
                    <option key={observer} value={observer}>
                      {observer}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Organization
                </label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Organizations</option>
                  {uniqueOrganizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Task ID
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Tasks</option>
                  {uniqueTasks.map((task) => (
                    <option key={task} value={task}>
                      {task}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="text-sm border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Start Date"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="text-sm border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* File Size Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  File Size (MB)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={
                      fileSizeRange.min === 0
                        ? ""
                        : fileSizeRange.min / (1024 * 1024)
                    }
                    onChange={(e) =>
                      setFileSizeRange((prev) => ({
                        ...prev,
                        min: e.target.value
                          ? parseFloat(e.target.value) * 1024 * 1024
                          : 0,
                      }))
                    }
                    className="text-sm border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={
                      fileSizeRange.max === Infinity
                        ? ""
                        : fileSizeRange.max / (1024 * 1024)
                    }
                    onChange={(e) =>
                      setFileSizeRange((prev) => ({
                        ...prev,
                        max: e.target.value
                          ? parseFloat(e.target.value) * 1024 * 1024
                          : Infinity,
                      }))
                    }
                    className="text-sm border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="secondary">
                    {filteredDataCount} files selected
                  </Badge>
                )}
              </div>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Download Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">Download Summary</h5>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{filteredDataCount} files will be downloaded</span>
                  </div>
                  {hasActiveFilters && (
                    <div className="text-xs text-gray-500 mt-1">
                      Based on your selected criteria
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {filteredDataCount}
                </div>
                <div className="text-xs text-gray-500">files</div>
              </div>
            </div>
          </div>

          {/* Download Status */}
          {downloadStatus && (
            <div
              className={`p-3 rounded-lg ${
                downloadStatus.includes("successfully")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : downloadStatus.includes("Failed")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {downloadStatus.includes("successfully") ? (
                  <CheckCircle className="h-4 w-4" />
                ) : downloadStatus.includes("Failed") ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{downloadStatus}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDownloading}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                disabled={isDownloading}
              >
                Reset
              </Button>

              <Button
                onClick={handleBulkDownload}
                disabled={isDownloading || filteredDataCount === 0}
                className="bg-primary hover:bg-red-700 text-white"
              >
                {isDownloading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download {filteredDataCount} Files
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
}
