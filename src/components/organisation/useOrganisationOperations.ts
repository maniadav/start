import { useCallback } from "react";
import { FileRequestBody } from "../../hooks/files/useFileFilters";
import StartUtilityAPI from "@services/start.utility";
import { toast } from "react-hot-toast"; // Or your library of choice
import startUtilityAPI from "@services/start.utility";

// Assuming StartUtilityAPI is your API wrapper
export const useFileOperations = () => {
  // Handle bulk download

  // ...

  const handleBulkDownload = useCallback(
    async (requestBody: FileRequestBody) => {
      // 1. Announce the start and get a unique ID for the toast
      const toastId = toast.loading("Preparing your download...");

      try {
        const prepareData = await startUtilityAPI.files.downloadPost(
          requestBody
        );

        // We no longer need downloadUrl, so we don't extract it.
        const { totalFiles, estimatedSize } = prepareData;

        toast.loading(
          `Found ${totalFiles} files (${estimatedSize}). Starting download...`,
          {
            id: toastId,
          }
        );

        // 2. Update the toast with progress, replacing the old `confirm` dialog
        toast.loading(
          `Found ${totalFiles} files (${estimatedSize}). Starting download...`,
          {
            id: toastId,
          }
        );

        // =================================================================
        // STEP 2: Use the URL to fetch the actual zip file
        // =================================================================
        const downloadResponse = await startUtilityAPI.files.downloadGet(
          requestBody
        );

        // The downloadBulkGet now returns a Response object for ZIP files
        if (!downloadResponse.ok) {
          throw new Error("Failed to download the zip file.");
        }

        const blob = await downloadResponse.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `bulk_download_${
          new Date().toISOString().split("T")[0]
        }.zip`;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // 3. Update the toast to a final success message
        toast.success("Download has started successfully!", {
          id: toastId,
          duration: 4000, // Keep the success message on screen a bit longer
        });
      } catch (error: any) {
        console.error("Bulk download error:", error);
        // 4. On ANY error, update the toast to show a failure message
        toast.error(error.message || "An unexpected error occurred.", {
          id: toastId,
        });
      }
    },
    []
  );

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
