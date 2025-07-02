"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Plus } from "lucide-react";

import {
  getOrganizations,
  saveOrganizations,
  getOccupiedStorage,
  getObservers,
} from "@management/lib/data-service";
import { getUsers, saveUsers } from "@management/lib/auth";
import { Button } from "@management/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@management/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { Input } from "@management/components/ui/input";
import { Label } from "@management/components/ui/label";
import { SidebarTrigger } from "@management/components/ui/sidebar";
import { useToast } from "@management/hooks/use-toast";
import { Badge } from "@management/components/ui/badge";
import { Progress } from "@management/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@management/components/ui/select";
import { Textarea } from "@management/components/ui/textarea";
import { DataTable } from "@management/components/data-table";
import { AdvancedFilters } from "@management/components/advanced-filters";
import type {
  Organisation,
  User,
  FilterOptions,
  Status,
} from "@type/management.types";
import { formatFileSize } from "@management/lib/data-service";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = React.useState(getOrganizations());
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<Organisation | null>(null);
  const [orgName, setOrgName] = React.useState("");
  const [orgEmail, setOrgEmail] = React.useState("");
  const [orgAddress, setOrgAddress] = React.useState("");
  const [orgStatus, setOrgStatus] = React.useState<Status>("pending");
  const [orgStorage, setOrgStorage] = React.useState("2048");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminName, setAdminName] = React.useState("");
  const { toast } = useToast();

  const users = getUsers();
  const observers = getObservers();

  // Filter organizations based on current filters
  const filteredOrganizations = React.useMemo(() => {
    let filtered = [...organizations];

    if (filters.search) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          org.id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((org) => filters.status!.includes(org.status));
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter((org) => {
        const orgDate = new Date(org.createdAt);
        if (filters.dateRange?.from && orgDate < filters.dateRange.from)
          return false;
        if (filters.dateRange?.to && orgDate > filters.dateRange.to)
          return false;
        return true;
      });
    }

    if (filters.storageComparison) {
      filtered = filtered.filter((org) => {
        const occupied = getOccupiedStorage(org.id) / (1024 * 1024); // Convert to MB
        const { operator, value } = filters.storageComparison!;
        if (operator === "<") return occupied < value;
        if (operator === "=") return Math.abs(occupied - value) < 1;
        if (operator === ">") return occupied > value;
        return true;
      });
    }

    // if (filters.userCountComparison) {
    //   filtered = filtered.filter((org) => {
    //     const userCount = users.filter((u) => u.organizationId === org.id).length
    //     const { operator, value } = filters.userCountComparison!
    //     if (operator === "<") return userCount < value
    //     if (operator === "=") return userCount === value
    //     if (operator === ">") return userCount > value
    //     return true
    //   })
    // }

    return filtered;
  }, [organizations, filters, users]);

  const columns: ColumnDef<Organisation>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Org ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Org Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      accessorKey: "email",
      header: "Org Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Status;
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
    {
      id: "observers",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            #Observers
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const orgId = row.getValue("id") as string;
        const observerCount = observers.filter(
          (o) => o.organizationId === orgId
        ).length;
        return observerCount;
      },
    },
    {
      id: "users",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            #Users
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const orgId = row.getValue("id") as string;
        // const userCount = users.filter((u) => u.organizationId === orgId).length
        return 10;
      },
    },
    {
      id: "occupiedStorage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Occupied Storage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const orgId = row.getValue("id") as string;
        const occupied = getOccupiedStorage(orgId);
        return formatFileSize(occupied);
      },
    },
    {
      accessorKey: "allowedStorage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Allowed Storage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const allowedMB = row.getValue("allowedStorage") as number;
        return `${allowedMB}MB`;
      },
    },
    {
      id: "storageUsage",
      header: "Usage",
      cell: ({ row }) => {
        const orgId = row.getValue("id") as string;
        const org = row.original;
        const occupied = getOccupiedStorage(orgId);
        const allowed = org.allowedStorage * 1024 * 1024; // Convert MB to bytes
        const percentage = Math.round((occupied / allowed) * 100);

        return (
          <div className="w-20">
            <Progress value={percentage} className="h-2" />
            <span className="text-xs text-muted-foreground">{percentage}%</span>
          </div>
        );
      },
    },
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
  ];

  const handleCreateOrganization = () => {
    if (!orgName || !orgEmail || !adminEmail || !adminName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newUserId = (users.length + 1).toString();
    const newOrgId = (organizations.length + 1).toString();

    const newOrg: Organisation = {
      id: newOrgId,
      name: orgName,
      email: orgEmail,
      address: orgAddress,
      status: orgStatus,
      allowedStorage: Number(orgStorage),
      adminId: newUserId,
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: newUserId,
      email: adminEmail,
      role: "organisation",
      createdAt: new Date().toISOString(),
    };

    const updatedOrgs = [...organizations, newOrg];
    const updatedUsers = [...users, newUser];

    setOrganizations(updatedOrgs);
    saveOrganizations(updatedOrgs);
    saveUsers(updatedUsers);

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
    setOrgAddress(org.address);
    setOrgStatus(org.status);
    setOrgStorage(org.allowedStorage.toString());
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

    const updatedOrg: Organisation = {
      ...editingOrg,
      name: orgName,
      email: orgEmail,
      address: orgAddress,
      status: orgStatus,
      allowedStorage: Number(orgStorage),
    };

    const updatedOrgs = organizations.map((org) =>
      org.id === editingOrg.id ? updatedOrg : org
    );

    setOrganizations(updatedOrgs);
    saveOrganizations(updatedOrgs);

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Organisation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Organisation</DialogTitle>
              <DialogDescription>
                Add a new organization and assign an admin user.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-name">Organisation Name *</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-email">Organisation Email *</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="Enter organization email"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-address">Address</Label>
                <Textarea
                  id="org-address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="Enter organization address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-status">Status</Label>
                  <Select
                    value={orgStatus}
                    onValueChange={(value: Status) => setOrgStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="deactivated">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-storage">Allowed Storage (MB)</Label>
                  <Input
                    id="org-storage"
                    type="number"
                    value={orgStorage}
                    onChange={(e) => setOrgStorage(e.target.value)}
                    placeholder="2048"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-name">Admin Name *</Label>
                  <Input
                    id="admin-name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter admin name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-email">Admin Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateOrganization}>
                Create Organisation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
            data={filteredOrganizations}
            searchKey="name"
            searchPlaceholder="Search by name or ID..."
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organisation</DialogTitle>
            <DialogDescription>
              Update organization configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-org-name">Organisation Name *</Label>
                <Input
                  id="edit-org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-org-email">Organisation Email *</Label>
                <Input
                  id="edit-org-email"
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="Enter organization email"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-org-address">Address</Label>
              <Textarea
                id="edit-org-address"
                value={orgAddress}
                onChange={(e) => setOrgAddress(e.target.value)}
                placeholder="Enter organization address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-org-status">Status</Label>
                <Select
                  value={orgStatus}
                  onValueChange={(value: Status) => setOrgStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-org-storage">Allowed Storage (MB)</Label>
                <Input
                  id="edit-org-storage"
                  type="number"
                  value={orgStorage}
                  onChange={(e) => setOrgStorage(e.target.value)}
                  placeholder="2048"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization}>
              Update Organisation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
