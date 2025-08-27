import { useCallback } from "react";
import { FileRequestBody } from "./useFileFilters";

export const useFileOperations = () => {
  // Handle bulk download
  const handleBulkDownload = useCallback(async (requestBody: FileRequestBody) => {
    try {
      const response = await fetch("/api/v1/files/download/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate bulk download");
      }

      const result = await response.json();
      console.log("Bulk download initiated:", result);

      // You can show a success message or redirect to download status page
      alert(`Bulk download initiated successfully! Job ID: ${result.jobId}`);
    } catch (error) {
      console.error("Bulk download error:", error);
      throw error;
    }
  }, []);

  // Action handlers for file operations
  const handleViewFile = useCallback((file: any) => {
    console.log("View file:", file);
    // Implement your view logic here
  }, []);

  const handleEditFile = useCallback((file: any) => {
    console.log("Edit file:", file);
    // Implement your edit logic here
  }, []);

  const handleDeleteFile = useCallback((file: any) => {
    console.log("Delete file:", file);
    if (confirm(`Are you sure you want to delete file ${file.task_id}?`)) {
      console.log("Deleting file:", file.task_id);
    }
  }, []);

  const handleDownloadFile = useCallback((file: any) => {
    console.log("Download file:", file);
    if (file.file_url) {
      const link = document.createElement("a");
      link.href = file.file_url;
      link.download = `${file.task_id}_${file.child_id}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    }
  }, []);

  return {
    handleBulkDownload,
    handleViewFile,
    handleEditFile,
    handleDeleteFile,
    handleDownloadFile,
  };
};
