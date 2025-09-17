"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Search } from "lucide-react";
import LoadingSection from "@components/section/loading-section";
import ManagementCreatePopup from "@components/popup/management-create-popup";
import ManagementDeletePopup from "@components/popup/management-delete-popup";
import ManagementEditPopup from "@components/popup/management-edit-popup";
import startUtilityAPI from "@services/start.utility";
import { useFileFilters } from "@hooks/files";
import { FilterSummary } from "@components/ui/filter-summary";
import { Button } from "@components/button/button";
import { ManagementTable } from "./management-table";
import { SidebarTriggerComp } from "@components/ui/SidebarTrigger";
import ManagementActivationPopup from "@components/popup/management-activation-popup";
import CredentialsPopup from "@components/popup/credential-popup";
import { POPUP_TYPES } from "@constants/config.constant";

type PopupType =
  | "create"
  | "delete"
  | "edit"
  | "send-activation-mail"
  | "credentials"
  | null;

type PopupState =
  | { type: null }
  | {
      type:
        | "create"
        | "edit"
        | "delete"
        | "send-activation-mail"
        | "credentials";
      data: {
        id: string | undefined;
        name: string | undefined;
        email: string | undefined;
      };
    };

type NonNullPopupType = Exclude<PopupType, null>;

const Management = ({
  forRole,
  accessedBy,
}: {
  forRole: "observer" | "organisation";
  accessedBy: "organisation" | "admin";
}) => {
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState<string>("");
  const [popupState, setPopupState] = useState<PopupState>({ type: null });

  const showCreateButton =
    (accessedBy === "organisation" && forRole === "observer") ||
    (accessedBy === "admin" && forRole === "organisation");
  const { requestBody, hasActiveFiltersOrSorts, getActiveFiltersCount } =
    useFileFilters();

  // Load organisations from the API
  const loadOrganisations = useCallback(
    async (orgIdParam?: string) => {
      setLoading(true);
      try {
        const params = orgIdParam ? { organisation_id: orgIdParam } : {};
        const res = await startUtilityAPI[forRole].list(params);
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
    },
    [forRole]
  );

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
    setPopupState({ type: null });
    loadOrganisations(searchId || undefined);
  }, [loadOrganisations, searchId]);

  return (
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title={`${forRole} Management`} />
      <Card>
        <CardHeader>
          <CardTitle>{forRole}</CardTitle>
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
                      placeholder={`Search by ${forRole} ID...`}
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
                {showCreateButton && (
                  <Button
                    onClick={() =>
                      setPopupState({
                        type: "create",
                        data: {
                          id: undefined,
                          name: undefined,
                          email: undefined,
                        },
                      })
                    }
                    variant="default"
                  >
                    Add {forRole}
                  </Button>
                )}
              </div>
              <ManagementTable
                data={organisations}
                handlebuttonActions={(
                  action: string,
                  data: {
                    id: string | undefined;
                    name: string | undefined;
                    email: string | undefined;
                  }
                ) => {
                  setPopupState({
                    type: action as NonNullPopupType,
                    data,
                  });
                }}
                forRole={forRole}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {popupState.type === POPUP_TYPES.CREATE && (
        <ManagementCreatePopup
          showFilter={true}
          closeModal={() => setPopupState({ type: null })}
          onSuccess={handleSuccess}
          role={forRole}
        />
      )}

      {popupState.type === POPUP_TYPES.CREDENTIALS && (
        <CredentialsPopup
          showFilter={true}
          closeModal={() => setPopupState({ type: null })}
          onSuccess={handleSuccess}
          data={popupState.data}
        />
      )}

      {popupState.type === POPUP_TYPES.EDIT && (
        <ManagementEditPopup
          showFilter={true}
          closeModal={() => setPopupState({ type: null })}
          onSuccess={handleSuccess}
          organisation_id={popupState.data?.id as string}
          role={forRole}
        />
      )}

      {popupState.type === POPUP_TYPES.DELETE && (
        <ManagementDeletePopup
          showFilter={true}
          closeModal={() => setPopupState({ type: null })}
          onSuccess={handleSuccess}
          organisation_id={popupState.data?.id as string}
          role={forRole}
        />
      )}
      {popupState.type === POPUP_TYPES.SEND_ACTIVATION_MAIL && (
        <ManagementActivationPopup
          showFilter={true}
          closeModal={() => setPopupState({ type: null })}
          onSuccess={handleSuccess}
          user_id={popupState.data?.id as string}
          user_name={popupState.data?.name as string}
          user_email={popupState.data?.email as string}
          role={forRole}
        />
      )}
    </div>
  );
};

export default Management;
