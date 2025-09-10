import { useState, useCallback, useEffect } from "react";
import { FileRequestBody } from "./useFileFilters";
import startUtilityAPI from "@services/start.utility";

export const useFileData = (requestBody: FileRequestBody) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data with current request body
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading files with request body...", requestBody);

      // Build query parameters for backend API
      const queryParams = new URLSearchParams();

      // Add all non-default values to query params
      Object.entries(requestBody).forEach(([key, value]) => {
        if (
          value &&
          value !== "" &&
          value !== "all" &&
          value !== 0 &&
          value !== Infinity
        ) {
          queryParams.set(key, value.toString());
        }
      });

      const res = await startUtilityAPI.files.list(queryParams.toString());
      // Ensure data is always an array
      const filesData = Array.isArray(res.data.files) ? res.data.files : [];
      setData(filesData || []);
      console.log("files data", res);
    } catch (error) {
      console.error("Failed to load files data:", error);
      setData([]); // fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }, [requestBody]);

  // Reload data when request body changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique values for filter dropdowns
  const safeData = Array.isArray(data) ? data : [];
  const uniqueObservers = [
    ...new Set(safeData.map((file) => file.observer_id)),
  ].sort();
  const uniqueOrganizations = [
    ...new Set(safeData.map((file) => file.organisation_id)),
  ].sort();
  const uniqueChildren = [
    ...new Set(safeData.map((file) => file.child_id)),
  ].sort();

  return {
    data,
    loading,
    loadData,
    uniqueObservers,
    uniqueOrganizations,
    uniqueChildren,
  };
};
