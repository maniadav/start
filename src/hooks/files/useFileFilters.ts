import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FileRequestBody {
  // Search
  searchTerm?: string;
  
  // Filters
  observerId?: string;
  organisationId?: string;
  childId?: string;
  taskId?: string;
  dateStart?: string;
  dateEnd?: string;
  fileSizeMin?: number;
  fileSizeMax?: number;
  
  // Sorting
  sortField?: string;
  sortDirection?: string;
}

export const useFileFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [requestBody, setRequestBody] = useState<FileRequestBody>(() => ({
    searchTerm: searchParams.get("searchTerm") || "",
    observerId: searchParams.get("observerId") || "all",
    organisationId: searchParams.get("organisationId") || "all",
    childId: searchParams.get("childId") || "all",
    taskId: searchParams.get("taskId") || "all",
    dateStart: searchParams.get("dateStart") || "",
    dateEnd: searchParams.get("dateEnd") || "",
    fileSizeMin: searchParams.get("fileSizeMin") ? parseInt(searchParams.get("fileSizeMin")!) : 0,
    fileSizeMax: searchParams.get("fileSizeMax") ? parseInt(searchParams.get("fileSizeMax")!) : Infinity,
    sortField: searchParams.get("sortField") || "date_created",
    sortDirection: searchParams.get("sortDirection") || "desc",
  }));

  // Update URL with current request body
  const updateURL = useCallback((newRequestBody: FileRequestBody) => {
    const params = new URLSearchParams();

    // Add all non-default values to URL
    Object.entries(newRequestBody).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== 0 && value !== Infinity) {
        if (key === "fileSizeMin" || key === "fileSizeMax") {
          params.set(key, value.toString());
        } else {
          params.set(key, value.toString());
        }
      }
    });

    const newURL = params.toString() ? `?${params.toString()}` : "";
    router.push(`/management/observer/files${newURL}`);
  }, [router]);

  // Update specific field in request body
  const updateField = useCallback((field: keyof FileRequestBody, value: any) => {
    setRequestBody(prev => {
      const newRequestBody = { ...prev, [field]: value };
      updateURL(newRequestBody);
      return newRequestBody;
    });
  }, [updateURL]);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<FileRequestBody>) => {
    setRequestBody(prev => {
      const newRequestBody = { ...prev, ...updates };
      updateURL(newRequestBody);
      return newRequestBody;
    });
  }, [updateURL]);

  // Clear all filters and sorts
  const resetAll = useCallback(() => {
    const defaultRequestBody: FileRequestBody = {
      searchTerm: "",
      observerId: "all",
      organisationId: "all",
      childId: "all",
      taskId: "all",
      dateStart: "",
      dateEnd: "",
      fileSizeMin: 0,
      fileSizeMax: Infinity,
      sortField: "date_created",
      sortDirection: "desc",
    };
    setRequestBody(defaultRequestBody);
    updateURL(defaultRequestBody);
  }, [updateURL]);

  // Check if any filters or sorts are active
  const hasActiveFiltersOrSorts = useMemo(() => {
    return Boolean(
      requestBody.searchTerm ||
      requestBody.observerId !== "all" ||
      requestBody.organisationId !== "all" ||
      requestBody.childId !== "all" ||
      requestBody.taskId !== "all" ||
      requestBody.dateStart ||
      requestBody.dateEnd ||
      (requestBody.fileSizeMin && requestBody.fileSizeMin > 0) ||
      (requestBody.fileSizeMax && requestBody.fileSizeMax !== Infinity) ||
      requestBody.sortField !== "date_created" ||
      requestBody.sortDirection !== "desc"
    );
  }, [requestBody]);

  // Get active filters count
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (requestBody.searchTerm) count++;
    if (requestBody.observerId !== "all") count++;
    if (requestBody.organisationId !== "all") count++;
    if (requestBody.childId !== "all") count++;
    if (requestBody.taskId !== "all") count++;
    if (requestBody.dateStart || requestBody.dateEnd) count++;
    if ((requestBody.fileSizeMin && requestBody.fileSizeMin > 0) || (requestBody.fileSizeMax && requestBody.fileSizeMax !== Infinity)) count++;
    return count;
  }, [requestBody]);

  // Handle sort change
  const handleSort = useCallback((field: string, direction: string) => {
    updateFields({ sortField: field, sortDirection: direction });
  }, [updateFields]);

  return {
    // State
    requestBody,
    
    // Actions
    updateField,
    updateFields,
    resetAll,
    handleSort,
    
    // Computed values
    hasActiveFiltersOrSorts,
    getActiveFiltersCount,
  };
};
