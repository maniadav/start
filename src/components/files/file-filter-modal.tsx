import React from "react";
import { Button } from "@components/button/button";
import { PopupModal } from "@components/ui/PopupModal";
import { Filter, X } from "lucide-react";
import { FileRequestBody } from "../../hooks/files/useFileFilters";
import TASK_TYPE from "@constants/survey.type.constant";
import { ROLE, RoleAllowed } from "@constants/role.constant";

interface FileFilterModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  requestBody: FileRequestBody;
  pendingRequestBody: FileRequestBody;
  onUpdate: (updates: Partial<FileRequestBody>) => void;
  // Filter options
  uniqueObservers: string[];
  uniqueOrganizations: string[];
  uniqueChildren: string[];
  activeFiltersCount: number;
  role: RoleAllowed;
}

export const FileFilterModal: React.FC<FileFilterModalProps> = ({
  show,
  onClose,
  onSubmit,
  requestBody,
  pendingRequestBody,
  onUpdate,
  uniqueObservers,
  uniqueOrganizations,
  uniqueChildren,
  activeFiltersCount,
  role,
}) => {
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
              <Filter className="h-5 w-5 text-blue-600" />
              Filter Options
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
          {/* Filter Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Observer Filter */}
            {role === ROLE.ADMIN && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Organization
                </label>
                <select
                  value={requestBody.organisationId || "all"}
                  onChange={(e) => onUpdate({ organisationId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Organizations</option>
                  {uniqueOrganizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(role === ROLE.ADMIN || role === ROLE.ORGANISATION) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Observer
                </label>
                <select
                  value={pendingRequestBody.observerId || "all"}
                  onChange={(e) => onUpdate({ observerId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Observers</option>
                  {uniqueObservers.map((observer) => (
                    <option key={observer} value={observer}>
                      {observer}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Child Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Child ID
              </label>
              <select
                value={pendingRequestBody.childId || "all"}
                onChange={(e) => onUpdate({ childId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Children</option>
                {uniqueChildren.map((child) => (
                  <option key={child} value={child}>
                    {child}
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
                value={pendingRequestBody.taskId || "all"}
                onChange={(e) => onUpdate({ taskId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tasks</option>
                {TASK_TYPE.map((task) => (
                  <option key={task} value={task}>
                    {task}
                  </option>
                ))}
              </select>
            </div>

            {/* File Size Range */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                File Size (MB)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={
                    pendingRequestBody.fileSizeMin === 0 || !pendingRequestBody.fileSizeMin
                      ? ""
                      : pendingRequestBody.fileSizeMin / (1024 * 1024)
                  }
                  onChange={(e) =>
                    onUpdate({
                      fileSizeMin: e.target.value
                        ? parseFloat(e.target.value) * 1024 * 1024
                        : 0,
                    })
                  }
                  className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={
                    pendingRequestBody.fileSizeMax === Infinity ||
                    !pendingRequestBody.fileSizeMax
                      ? ""
                      : pendingRequestBody.fileSizeMax / (1024 * 1024)
                  }
                  onChange={(e) =>
                    onUpdate({
                      fileSizeMax: e.target.value
                        ? parseFloat(e.target.value) * 1024 * 1024
                        : Infinity,
                    })
                  }
                  className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div> */}

            {/* Date Range */}
            {/* <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={pendingRequestBody.dateStart || ""}
                  onChange={(e) => onUpdate({ dateStart: e.target.value })}
                  className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  type="date"
                  value={pendingRequestBody.dateEnd || ""}
                  onChange={(e) => onUpdate({ dateEnd: e.target.value })}
                  className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div> */}
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {activeFiltersCount} filter
              {activeFiltersCount !== 1 ? "s" : ""} active
            </div>
            <div className="flex gap-2 items-center justify-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};
