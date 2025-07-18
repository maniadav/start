"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { fetchOrganisations } from "@management/lib/data-service";
import { Button } from "@management/components/ui/button";
import type { Organisation, FilterOptions } from "@type/management.types";
import { OrganisationTable } from "./OrganisationTable";
import SidebarTrigger from "@management/SidebarTrigger";
import CreateOrganisationPopup from "components/popup/CreateOrganisationPopup";
import StartUtilityAPI from "@services/start.utility";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const nextApi = useMemo(() => new StartUtilityAPI(), []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const res = await nextApi.organisation.list();
      setOrganizations(res.data || []);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Organisation</h2>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Add Organisation
          </Button>
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
          />
        )}
      </div>
      <CreateOrganisationPopup
        showFilter={isCreateDialogOpen}
        closeModal={() => setIsCreateDialogOpen((prev) => !prev)}
        onSuccess={() => {
          loadOrganizations();
        }}
      />
    </>
  );
}
