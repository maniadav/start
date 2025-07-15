"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";

import {
  fetchOrganisations,
  saveOrganizations,
  getOccupiedStorage,
} from "@management/lib/data-service";
import { getUsers, saveUsers } from "@management/lib/auth";
import { Button } from "@management/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { useToast } from "@management/hooks/use-toast";
import { Badge } from "@management/components/ui/badge";
import { Progress } from "@management/components/ui/progress";
import type {
  Organisation,
  User,
  FilterOptions,
  Status,
} from "@type/management.types";
import { formatFileSize } from "@management/lib/data-service";
import { OrganisationCreateDialog } from "./OrganisationCreateDialog";
import { OrganisationEditDialog } from "./OrganisationEditDialog";
import { OrganisationTable } from "./OrganisationTable";
import SidebarTrigger from "@management/SidebarTrigger";
import { useEffect, useState } from "react";
import CreateOrganisationPopup from "components/popup/CreateOrganisationPopup";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organisation | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgStatus, setOrgStatus] = useState<Status>("pending");
  const [orgStorage, setOrgStorage] = useState("2048");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [hasLimitedData, setHasLimitedData] = useState(false);
  const { toast } = useToast();

  const users = getUsers();

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await fetchOrganisations();
      setOrganizations(data);
      // Check if we have limited data structure
      if (data.length > 0) {
        const firstOrg = data[0];
        // Check if essential fields from full Organisation interface are missing
        const isLimited =
          !firstOrg.address || firstOrg.allowedStorage === undefined;
        setHasLimitedData(isLimited);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load organizations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  // Filter organizations based on current filters
  const filteredOrganizations = React.useMemo(() => {
    let filtered = [...organizations];

    if (filters.search) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          org.unique_id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((org) => filters.status!.includes(org.status));
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter((org) => {
        const orgDate = new Date(org.joined_on);
        if (filters.dateRange?.from && orgDate < filters.dateRange.from)
          return false;
        if (filters.dateRange?.to && orgDate > filters.dateRange.to)
          return false;
        return true;
      });
    }

    if (filters.storageComparison && !hasLimitedData) {
      filtered = filtered.filter((org) => {
        const occupied = getOccupiedStorage(org.unique_id) / (1024 * 1024); // Convert to MB
        const { operator, value } = filters.storageComparison!;
        if (operator === "<") return occupied < value;
        if (operator === "=") return Math.abs(occupied - value) < 1;
        if (operator === ">") return occupied > value;
        return true;
      });
    }

    return filtered;
  }, [organizations, filters, hasLimitedData]);

  const columns: ColumnDef<Organisation>[] = React.useMemo(
    () => [
      {
        accessorKey: "unique_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Org ID
            </Button>
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Org Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "joined_on",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Joined On
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const joinedOn = row.getValue("joined_on");
          return joinedOn
            ? new Date(joinedOn as string).toLocaleDateString()
            : "N/A";
        },
      },
      {
        accessorKey: "email",
        header: "Org Email",
        cell: ({ row }) => {
          const email = row.getValue("email");
          return email || "N/A";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as Status;
          if (!status) return "N/A";
          return (
            <Badge
              variant={
                status === "active"
                  ? "default"
                  : status === "pending"
                  ? "secondary"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      // Conditionally include columns based on data availability
      ...(hasLimitedData
        ? []
        : [
            {
              id: "observers",
              header: ({ column }: any) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    #Observers
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }: any) => {
                const orgId = row.getValue("user_id") as string;
                const observerCount = observers.filter(
                  (o) => o.user_id === orgId
                ).length;
                return observerCount;
              },
            },
            {
              id: "users",
              header: ({ column }: any) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    #Users
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }: any) => {
                const orgId = row.getValue("user_id") as string;
                // const userCount = users.filter((u) => u.organizationId === orgId).length
                return 10;
              },
            },
            {
              id: "occupiedStorage",
              header: ({ column }: any) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Occupied Storage
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }: any) => {
                const orgId = row.getValue("user_id") as string;
                const occupied = getOccupiedStorage(orgId);
                return formatFileSize(occupied);
              },
            },
            {
              accessorKey: "allowedStorage",
              header: ({ column }: any) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Allowed Storage
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }: any) => {
                const allowedMB = row.getValue("allowedStorage") as number;
                return allowedMB ? `${allowedMB}MB` : "N/A";
              },
            },
            {
              id: "storageUsage",
              header: "Usage",
              cell: ({ row }: any) => {
                const orgId = row.getValue("user_id") as string;
                const org = row.original;
                const occupied = getOccupiedStorage(orgId);
                const allowed = (org.allowedStorage || 100) * 1024 * 1024; // Convert MB to bytes, default to 100MB
                const percentage = Math.round((occupied / allowed) * 100);

                return (
                  <div className="w-20">
                    <Progress value={percentage} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                );
              },
            },
          ]),
      {
        id: "actions",
        cell: ({ row }) => {
          const org = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEditOrg(org)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [hasLimitedData]
  );

  const handleCreateOrganization = () => {
    if (!orgName || !orgEmail) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Name and Email)",
        variant: "destructive",
      });
      return;
    }

    // Create organization with basic required fields
    const newOrgId = `org_${Date.now()}`;

    const newOrg: Organisation = {
      name: orgName,
      email: orgEmail,
      address: hasLimitedData ? "" : orgAddress,
      status: orgStatus,
      joined_on: new Date().toISOString(),
      ...(hasLimitedData
        ? {}
        : {
            allowedStorage: Number(orgStorage),
            adminId: `admin_${Date.now()}`,
          }),
    };

    // Update local state
    const updatedOrgs = [...organizations, newOrg];
    setOrganizations(updatedOrgs);

    if (!hasLimitedData) {
      // Only save if we have full API support
      const newUser: User = {
        id: `admin_${Date.now()}`,
        email: adminEmail,
        role: "organisation",
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveOrganizations(updatedOrgs);
      saveUsers(updatedUsers);
    }

    toast({
      title: "Organisation created",
      description: `${orgName} has been created successfully`,
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditOrg = (org: Organisation) => {
    setEditingOrg(org);
    setOrgName(org.name);
    setOrgEmail(org.email);
    setOrgAddress(org.address || "");
    setOrgStatus(org.status);
    setOrgStorage((org.allowedStorage || 100).toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrganization = () => {
    if (!editingOrg || !orgName || !orgEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create updated organization - always allow basic field updates
    const updatedOrg: Organisation = {
      ...editingOrg,
      name: orgName,
      email: orgEmail,
      status: orgStatus,
      ...(hasLimitedData
        ? {}
        : {
            address: orgAddress,
            allowedStorage: Number(orgStorage),
          }),
    };

    const updatedOrgs = organizations.map((org) =>
      org.user_id === editingOrg.user_id ? updatedOrg : org
    );

    setOrganizations(updatedOrgs);

    if (!hasLimitedData) {
      saveOrganizations(updatedOrgs);
    }

    toast({
      title: "Organisation updated",
      description: `${orgName} has been updated successfully`,
    });

    resetForm();
    setIsEditDialogOpen(false);
    setEditingOrg(null);
  };

  const resetForm = () => {
    setOrgName("");
    setOrgEmail("");
    setOrgAddress("");
    setOrgStatus("pending");
    setOrgStorage("2048");
    setAdminEmail("");
    setAdminName("");
  };

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
          <>
            {hasLimitedData && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Limited Data View:</strong> Some columns are hidden
                  because the API returned limited organization data. Full
                  storage metrics, user counts, and observer counts are not
                  available in this view. Create and edit functionality may be
                  limited.
                </p>
              </div>
            )}
            <OrganisationTable
              columns={columns}
              data={filteredOrganizations}
              filters={filters}
              setFilters={setFilters}
              hasLimitedData={hasLimitedData}
            />
          </>
        )}

        <OrganisationEditDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          orgName={orgName}
          setOrgName={setOrgName}
          orgEmail={orgEmail}
          setOrgEmail={setOrgEmail}
          orgAddress={orgAddress}
          setOrgAddress={setOrgAddress}
          orgStatus={orgStatus}
          setOrgStatus={setOrgStatus}
          orgStorage={orgStorage}
          setOrgStorage={setOrgStorage}
          handleUpdateOrganization={handleUpdateOrganization}
          hasLimitedData={hasLimitedData}
        />
      </div>
      <CreateOrganisationPopup
        showFilter={isCreateDialogOpen}
        closeModal={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          // Refresh the organisations list after successful creation
          loadOrganizations();
        }}
      />
    </>
  );
}
