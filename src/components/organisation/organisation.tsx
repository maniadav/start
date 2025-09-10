"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Search } from "lucide-react";
import LoadingSection from "@components/section/loading-section";
import { OrganisationTable } from "@components/organisation/organisation-table";
import { SidebarTriggerComp } from "@management/SidebarTrigger";
import CreateOrganisationPopup from "@components/popup/CreateOrganisationPopup";
import DeleteOrganisationPopup from "@components/popup/DeleteOrganisationPopup";
import startUtilityAPI from "@services/start.utility";
import { useFileFilters } from "@hooks/files";
import { FilterSummary } from "@components/operation/filter-summary";
import EditOrganisationPopup from "@components/popup/EditOrganisationPopup";
import CredentialPopup from "@components/popup/credential-popup";
import { Button } from "@components/ui/button";

// Define a type for the popup state for better type safety
type PopupType = "create" | "delete" | "credential" | "edit" | null;

const Organisation = () => {
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState<string>("");
  const [popupState, setPopupState] = useState<{
    type: PopupType;
    isOpen: boolean;
    orgId: string | null;
  }>({
    type: null,
    isOpen: false,
    orgId: null,
  });

  const { requestBody, hasActiveFiltersOrSorts, getActiveFiltersCount } =
    useFileFilters();

  // Helper function to manage popup state
  const handlePopup = (type: PopupType, orgId: string | null = null) => {
    setPopupState({
      type,
      isOpen: type !== null, // isOpen is true if type is not null
      orgId,
    });
  };

  // Load organisations from the API
  const loadOrganisations = useCallback(async (orgIdParam?: string) => {
    setLoading(true);
    try {
      const params = orgIdParam ? { organisation_id: orgIdParam } : {};
      const res = await startUtilityAPI.organisation.list(params);
      setOrganisations(res.data || []);
      // Update URL query param if searching
      if (orgIdParam) {
        const url = new URL(window.location.href);
        url.searchParams.set("organisation_id", orgIdParam);
        window.history.replaceState({}, "", url.toString());
      }
    } catch (error) {
      console.error("Failed to load organisations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to handle initial load and URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orgId = params.get("organisation_id");
    if (orgId) {
      setSearchId(orgId);
      loadOrganisations(orgId);
    } else {
      loadOrganisations();
    }
  }, [loadOrganisations]);

  // Success handler to reload data
  const handleSuccess = useCallback(() => {
    handlePopup(null);
    loadOrganisations(searchId || undefined);
  }, [loadOrganisations, searchId]);

  return (
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title="Organisation Management" />
      <Card>
        <CardHeader>
          <CardTitle>Organisation</CardTitle>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSection />
            </div>
          ) : (
            <div className="space-y-4">
              <FilterSummary
                dataLength={organisations.length}
                hasActiveFiltersOrSorts={hasActiveFiltersOrSorts}
                activeFiltersCount={getActiveFiltersCount()}
                requestBody={requestBody}
              />
              <div className="w-full justify-between flex items-center py-4 px-4 gap-2">
                <div className="flex flex-1 max-w-sm relative">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by organisation ID..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="pl-8 bg-white rounded-r-none"
                    />
                  </div>
                  <Button
                    onClick={() => loadOrganisations(searchId || undefined)}
                    className="rounded-l-none"
                    variant={"default"}
                  >
                    Search
                  </Button>
                </div>
                <Button onClick={() => handlePopup("create")} variant="default">
                  Add Organisation
                </Button>
              </div>
              <OrganisationTable
                data={organisations}
                handleOrgActions={(action: string, orgId: string) =>
                  handlePopup(action as PopupType, orgId)
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {popupState.type === "create" && (
        <CreateOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={() => handlePopup(null)}
          onSuccess={handleSuccess}
        />
      )}

      {popupState.type === "credential" && (
        <CredentialPopup
          showFilter={popupState.isOpen}
          closeModal={() => handlePopup(null)}
          onSuccess={handleSuccess}
          organisationId={popupState.orgId as string}
        />
      )}

      {popupState.type === "edit" && (
        <EditOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={() => handlePopup(null)}
          onSuccess={handleSuccess}
          organisation_id={popupState.orgId as string}
        />
      )}

      {popupState.type === "delete" && (
        <DeleteOrganisationPopup
          showFilter={popupState.isOpen}
          closeModal={() => handlePopup(null)}
          onSuccess={handleSuccess}
          organisation_id={popupState.orgId as string}
        />
      )}
    </div>
  );
};

export default Organisation;
