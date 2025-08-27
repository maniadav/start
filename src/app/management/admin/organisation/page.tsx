"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@components/ui/button";
import type { Organisation, FilterOptions } from "@type/management.types";
import { OrganisationTable } from "./OrganisationTable";
import SidebarTrigger from "@management/SidebarTrigger";
import CreateOrganisationPopup from "components/popup/CreateOrganisationPopup";
import StartUtilityAPI from "@services/start.utility";
import DeleteOrganisationPopup from "components/popup/DeleteOrganisationPopup";
import EditOrganisationPopup from "components/popup/EditOrganisationPopup";
import { Card, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Search, ArrowRight } from "lucide-react";
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
  // Get organisation_id from query param
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const orgId = params.get("organisation_id");
      if (orgId) setOrganisationId(orgId);
    }
  }, []);

  // Centralized popup state
  const [popupState, setPopupState] = useState<PopupState>({
    type: null,
    isOpen: false,
    observerId: "",
    data: null,
  });

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

  const loadOrganisations = React.useCallback(async (searchOrgId?: string) => {
    setLoading(true);
    try {
      console.log("Loading organisations...");
      const START_API = new StartUtilityAPI();
      // Pass organisation_id as param if present
      const params = searchOrgId ? { organisation_id: searchOrgId } : {};
      const res = await START_API.organisation.list(params);
      setOrganizations(res.data || []);
      console.log("Organisations loaded:", res.data?.length || 0);
      // Update URL query param if searching
      if (searchOrgId) {
        const url = new URL(window.location.href);
        url.searchParams.set("organisation_id", searchOrgId);
        window.history.replaceState({}, "", url.toString());
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
          <Card>
            <CardHeader>
              <CardTitle>Organisation Management</CardTitle>
              <div className="flex items-center gap-2">
                {/* <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  showStorageFilter={!hasLimitedData}
                  showUserCountFilter={!hasLimitedData}
                  showStatusFilter
                  showDateFilter
                /> */}
              </div>
            </CardHeader>
            <div className="flex items-center py-4 px-4 gap-2">
              <div className="flex flex-1 max-w-sm relative">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by organisation ID..."
                    value={organisationId || ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value;
                      setOrganisationId(value);
                    }}
                    className="pl-8 bg-white rounded-r-none"
                  />
                </div>
                <Button
                  onClick={() => loadOrganisations(organisationId || undefined)}
                  className="rounded-l-none"
                >
                  Search
                </Button>
              </div>
            </div>
            <OrganisationTable
              data={organizations}
              filters={filters}
              setFilters={setFilters}
              handleOrgActions={(action, organisation_id) =>
                openPopup(action, organisation_id)
              }
            />
          </Card>
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
      
      */}
      {popupState.type === "edit" && (
        <EditOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={closePopup}
          onSuccess={() => {
            loadOrganisations();
            closePopup();
          }}
          organisation_id={popupState.observerId}
          // data={popupState.data}
        />
      )}
    </>
  );
}
