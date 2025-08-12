"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@management/components/ui/button";
import type { Organisation, FilterOptions } from "@type/management.types";
import { ObserverTable } from "./ObserverTable";
import SidebarTrigger from "@management/SidebarTrigger";
import CreateOrganisationPopup from "components/popup/CreateOrganisationPopup";
import StartUtilityAPI from "@services/start.utility";
import DeleteOrganisationPopup from "components/popup/DeleteOrganisationPopup";
interface PopupState {
  type: String | null;
  isOpen: boolean;
  observerId: string;
  data?: any; // Optional data to pass to the popup
}

export default function ObserverPage() {
  const [data, setData] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});

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
      console.log("Loading observers...");
      setLoading(true);
      const res = await nextApi.observer.list();
      setData(res.data || []);
      console.log("Observers loaded:", res.data?.length || 0);
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
    console.log("handleSuccess called - reloading organisations");
    loadData();
  }, [loadData]);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Organisation</h2>
          </div>
          <Button onClick={() => openPopup("create")}>Add Organisation</Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading data...</div>
          </div>
        ) : (
          <ObserverTable
            data={data}
            filters={filters}
            setFilters={setFilters}
            handleOrgActions={(
              action: String | null,
              organisation_id: string | undefined
            ) => openPopup(action, organisation_id)}
          />
        )}
      </div>

      {/* Conditional rendering of popups based on popup state */}
      {popupState.type === "create" && (
        <CreateOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={closePopup}
          onSuccess={handleSuccess}
        />
      )}

      {popupState.type === "delete" && (
        <DeleteOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={closePopup}
          onSuccess={handleSuccess}
          organisation_id={popupState.observerId}
        />
      )}
    </>
  );
}
