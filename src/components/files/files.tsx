"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useState } from "react";
import LoadingSection from "@components/section/loading-section";
import { FileTable } from "@components/files/file-table";
import { BulkDownloadPopup } from "@components/popup/BulkDownloadPopup";
import { useFileFilters, useFileData, useFileOperations } from "@hooks/files";
import { SidebarTriggerComp } from "@management/SidebarTrigger";
import { FileResultsSummary } from "./file-results-summary";
import { FileFilterModal } from "./file-filter-modal";
import { FileActions } from "./file-actions";
import { RoleAllowed } from "@constants/role.constant";

const Files = ({ role }: { role: RoleAllowed }) => {
  // Modal states
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [showBulkDownloadPopup, setShowBulkDownloadPopup] = useState(false);
  // Use custom hooks
  const {
    requestBody,
    pendingRequestBody,
    updateFields,
    submitFilters,
    resetAll,
    hasActiveFiltersOrSorts,
    getActiveFiltersCount,
  } = useFileFilters();

  const {
    data,
    loading,
    uniqueObservers,
    uniqueOrganizations,
    uniqueChildren,
  } = useFileData(requestBody);

  const {
    handleBulkDownload,
    handleViewFile,
    handleEditFile,
    handleDeleteFile,
    handleDownloadFile,
  } = useFileOperations();

  // Handle filter submission
  const handleFilterSubmit = () => {
    submitFilters();
    setShowFilterPopup(false);
  };

  return (
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title="Uplaod Files" />

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSection />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Control Bar */}
              <FileActions
                requestBody={requestBody}
                onUpdate={updateFields}
                onFilterClick={() => setShowFilterPopup(true)}
                onSortClick={() => setShowSortPopup(true)}
                onBulkDownloadClick={() => setShowBulkDownloadPopup(true)}
                onResetClick={resetAll}
                activeFiltersCount={getActiveFiltersCount()}
                hasActiveFiltersOrSorts={hasActiveFiltersOrSorts}
              />

              {/* Results Summary */}
              <FileResultsSummary
                dataLength={data.length}
                hasActiveFiltersOrSorts={hasActiveFiltersOrSorts}
                activeFiltersCount={getActiveFiltersCount()}
                requestBody={requestBody}
              />

              {/* File Table */}
              <FileTable
                data={data}
                onViewFile={handleViewFile}
                onEditFile={handleEditFile}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
                hideSearchBar={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <FileFilterModal
        show={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        requestBody={requestBody}
        pendingRequestBody={pendingRequestBody}
        onUpdate={updateFields}
        onSubmit={handleFilterSubmit}
        uniqueObservers={uniqueObservers}
        uniqueOrganizations={uniqueOrganizations}
        uniqueChildren={uniqueChildren}
        activeFiltersCount={getActiveFiltersCount()}
        role={role}
      />

      {/* Sort Modal */}
      {/* <FileSortModal
        show={showSortPopup}
        onClose={() => setShowSortPopup(false)}
        requestBody={requestBody}
        pendingRequestBody={pendingRequestBody}
        onUpdate={updateFields}
        onSubmit={handleFilterSubmit}
      /> */}

      {/* Bulk Download Popup */}
      <BulkDownloadPopup
        show={showBulkDownloadPopup}
        onClose={() => setShowBulkDownloadPopup(false)}
        data={data}
        onDownload={handleBulkDownload}
      />
    </div>
  );
};

export default Files;
