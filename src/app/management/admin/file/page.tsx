"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import type { FilterOptions } from "@type/management.types";
import SidebarTrigger from "@management/SidebarTrigger";
import { FileTable } from "./FileTable";
import { useEffect, useMemo, useState } from "react";
import LoadingSection from "components/section/loading-section";
import StartUtilityAPI from "@services/start.utility";

interface PopupState {
  type: String | null;
  isOpen: boolean;
  observerId: string;
  data?: any; // Optional data to pass to the popup
}
export default function AdminFilesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Centralized popup state
  const [popupState, setPopupState] = useState<PopupState>({
    type: null,
    isOpen: false,
    observerId: "",
    data: null,
  });

  const nextApi = useMemo(() => new StartUtilityAPI(), []);

  // Helper functions to manage popup state
  const openPopup = (
    type: String | null,
    observerId: string = "",
    data: any = null
  ) => {
    setPopupState({
      type,
      isOpen: true,
      observerId,
      data,
    });
  };

  const closePopup = () => {
    setPopupState({
      ...popupState,
      isOpen: false,
      type: null,
    });
  };

  const loadData = React.useCallback(async () => {
    try {
      console.log("Loading data...");
      setLoading(true);
      const res = await nextApi.files.list();
      setData(res.data || []);
      console.log("Data loaded:", res.data?.length || 0);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [nextApi]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSuccess = React.useCallback(() => {
    console.log("handleSuccess called - reloading data");
    loadData();
  }, [loadData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">
          All Uploaded Files
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          {/* <FileFilters
            filters={filters}
            setFilters={setFilters}
            surveyFilter={surveyFilter}
            setSurveyFilter={setSurveyFilter}
            orgFilter={orgFilter}
            setOrgFilter={setOrgFilter}
            observerFilter={observerFilter}
            setObserverFilter={setObserverFilter}
            surveys={surveys}
            data={data}
            observers={observers}
          /> */}
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSection />
            </div>
          ) : (
            <FileTable data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
