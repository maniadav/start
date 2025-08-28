import { useState, useCallback, useEffect } from "react";
import StartUtilityAPI from "@services/start.utility";
import { FileRequestBody } from "./useFileFilters";

export const useFileData = (requestBody: FileRequestBody) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data with current request body
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading files with request body...", requestBody);
      const START_API = new StartUtilityAPI();

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

      const res = await START_API.files.list(queryParams.toString());
      setData(res.data.files || []);
      console.log("files data", res || 0);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setLoading(false);
    }
  }, [requestBody]);

  // Reload data when request body changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique values for filter dropdowns
  const uniqueObservers = [
    ...new Set(data.map((file) => file.observer_id)),
  ].sort();
  const uniqueOrganizations = [
    ...new Set(data.map((file) => file.organisation_id)),
  ].sort();
  const uniqueChildren = [...new Set(data.map((file) => file.child_id))].sort();

  return {
    data,
    loading,
    loadData,
    uniqueObservers,
    uniqueOrganizations,
    uniqueChildren,
  };
};
