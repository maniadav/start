"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@management/components/ui/button";
import type { Organisation, FilterOptions } from "@type/management.types";
import { OrganisationTable } from "./OrganisationTable";
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

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
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

  const loadOrganisations = React.useCallback(async () => {
    try {
      console.log("Loading organisations...");
      setLoading(true);
      const res = await nextApi.organisation.list();
      setOrganizations(res.data || []);
      console.log("Organisations loaded:", res.data?.length || 0);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  }, [nextApi]);

  useEffect(() => {
    loadOrganisations();
  }, [loadOrganisations]);

  const handleSuccess = React.useCallback(() => {
    console.log("handleSuccess called - reloading organisations");
    loadOrganisations();
  }, [loadOrganisations]);

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
            <div className="text-center">Loading organizations...</div>
          </div>
        ) : (
          <OrganisationTable
            data={organizations}
            filters={filters}
            setFilters={setFilters}
            handleOrgActions={(action, organisation_id) =>
              openPopup(action, organisation_id)
            }
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

      {/* Additional popups can be added here based on type */}
      {/* 
      {popupState.type === 'view' && (
        <ViewOrganisationPopup 
          showFilter={popupState.isOpen}
          closeModal={closePopup}
          organisation_id={popupState.observerId}
        />
      )}
      
      {popupState.type === 'edit' && (
        <EditOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={closePopup}
          onSuccess={() => {
            loadOrganisations();
            closePopup();
          }}
          organisation_id={popupState.observerId}
          data={popupState.data}
        />
      )}
      */}
    </>
  );
}
