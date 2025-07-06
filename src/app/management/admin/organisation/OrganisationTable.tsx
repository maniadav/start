import * as React from "react";
import { DataTable } from "@management/components/data-table";
import { AdvancedFilters } from "@management/components/advanced-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@management/components/ui/card";
import type { Organisation, FilterOptions, Status } from "@type/management.types";

interface OrganisationTableProps {
  columns: any;
  data: Organisation[];
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

export function OrganisationTable({ columns, data, filters, setFilters }: OrganisationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organisation Management</CardTitle>
        <div className="flex items-center gap-2">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            showStorageFilter
            showUserCountFilter
            showStatusFilter
            showDateFilter
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by name or ID..."
        />
      </CardContent>
    </Card>
  );
}
