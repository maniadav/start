"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Plus } from "lucide-react";

import { getCurrentUser } from "@management/lib/auth";
import {
  getObservers,
  saveObservers,
  getFiles,
  formatFileSize,
} from "@management/lib/data-service";
import { getUsers } from "@management/lib/auth";
import { Button } from "@management/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import { CustomDialog } from "@management/components/ui/custom-dialog";
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
import { useToast } from "@management/hooks/use-toast";
import { Badge } from "@management/components/ui/badge";
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
import type { Observer, FilterOptions, Status } from "@type/management.types";
import SidebarTrigger from "@management/SidebarTrigger";
import { getCurrentMember } from "@utils/auth.utils";

export default function ObserversPage() {
  const member = getCurrentMember();
  const [observers, setObservers] = React.useState(
    getObservers().filter((o) => o.organizationId === member?.profile?.id)
  );
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingObserver, setEditingObserver] = React.useState<Observer | null>(
    null
  );
  const [observerName, setObserverName] = React.useState("");
  const [observerEmail, setObserverEmail] = React.useState("");
  const [observerAddress, setObserverAddress] = React.useState("");
  const [observerStatus, setObserverStatus] = React.useState<Status>("pending");
  const { toast } = useToast();

  const users = getUsers();
  const files = getFiles();

  // Filter observers based on current filters
  const filteredObservers = React.useMemo(() => {
    let filtered = [...observers];

    if (filters.search) {
      filtered = filtered.filter(
        (observer) =>
          observer.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          observer.id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((observer) =>
        filters.status!.includes(observer.status)
      );
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter((observer) => {
        const observerDate = new Date(observer.createdAt);
        if (filters.dateRange?.from && observerDate < filters.dateRange.from)
          return false;
        if (filters.dateRange?.to && observerDate > filters.dateRange.to)
          return false;
        return true;
      });
    }

    return filtered;
  }, [observers, filters]);

  const columns: ColumnDef<Observer>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Observer ID
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
            Name
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
      header: "Email",
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
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return (
          <div className="max-w-32 truncate" title={address}>
            {address}
          </div>
        );
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
        const observerId = row.getValue("id") as string;
        // const userCount = users.filter((u) => u.observerId === observerId).length
        return 10;
      },
    },
    {
      id: "files",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            #Files
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const observerId = row.getValue("id") as string;
        const fileCount = files.filter(
          (f) => f.observerId === observerId
        ).length;
        return fileCount;
      },
    },
    {
      id: "totalStorage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Storage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const observerId = row.getValue("id") as string;
        const observerFiles = files.filter((f) => f.observerId === observerId);
        const totalSize = observerFiles.reduce(
          (acc, file) => acc + file.size,
          0
        );
        return formatFileSize(totalSize);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const observer = row.original;

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
              <DropdownMenuItem onClick={() => handleEditObserver(observer)}>
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

  const handleCreateObserver = () => {
    if (!observerName || !observerEmail || !member) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const allObservers = getObservers();
    const newObserverId = (allObservers.length + 1).toString();

    const newObserver: Observer = {
      id: newObserverId,
      name: observerName,
      email: observerEmail,
      address: observerAddress,
      status: observerStatus,
      organizationId: member.organizationId!,
      createdAt: new Date().toISOString(),
    };

    const updatedObservers = [...allObservers, newObserver];
    saveObservers(updatedObservers);
    setObservers(
      updatedObservers.filter((o) => o.organizationId === member.organizationId)
    );

    toast({
      title: "Observer created",
      description: `${observerName} has been created successfully`,
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditObserver = (observer: Observer) => {
    setEditingObserver(observer);
    setObserverName(observer.name);
    setObserverEmail(observer.email);
    setObserverAddress(observer.address);
    setObserverStatus(observer.status);
    setIsEditDialogOpen(true);
  };

  const handleUpdateObserver = () => {
    if (!editingObserver || !observerName || !observerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedObserver: Observer = {
      ...editingObserver,
      name: observerName,
      email: observerEmail,
      address: observerAddress,
      status: observerStatus,
    };

    const allObservers = getObservers();
    const updatedObservers = allObservers.map((observer) =>
      observer.id === editingObserver.id ? updatedObserver : observer
    );

    saveObservers(updatedObservers);
    setObservers(
      updatedObservers.filter(
        (o) => o.organizationId === member?.organizationId
      )
    );

    toast({
      title: "Observer updated",
      description: `${observerName} has been updated successfully`,
    });

    resetForm();
    setIsEditDialogOpen(false);
    setEditingObserver(null);
  };

  const resetForm = () => {
    setObserverName("");
    setObserverEmail("");
    setObserverAddress("");
    setObserverStatus("pending");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Observers</h2>
        </div>
        <CustomDialog.Trigger onClick={() => setIsCreateDialogOpen(true)}>
          <Button variant="default" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Observer
          </Button>
        </CustomDialog.Trigger>
        <CustomDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        >
          <CustomDialog.Content
            className="max-w-2xl"
            onClose={() => setIsCreateDialogOpen(false)}
          >
            <CustomDialog.Header>
              <CustomDialog.Title>Create New Observer</CustomDialog.Title>
              <CustomDialog.Description>
                Add a new observer to your organization.
              </CustomDialog.Description>
            </CustomDialog.Header>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="observer-name">Observer Name *</Label>
                  <Input
                    id="observer-name"
                    value={observerName}
                    onChange={(e) => setObserverName(e.target.value)}
                    placeholder="Enter observer name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observer-email">Observer Email *</Label>
                  <Input
                    id="observer-email"
                    type="email"
                    value={observerEmail}
                    onChange={(e) => setObserverEmail(e.target.value)}
                    placeholder="Enter observer email"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observer-address">Address</Label>
                <Textarea
                  id="observer-address"
                  value={observerAddress}
                  onChange={(e) => setObserverAddress(e.target.value)}
                  placeholder="Enter observer address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observer-status">Status</Label>
                <Select
                  value={observerStatus}
                  onValueChange={(value: Status) => setObserverStatus(value)}
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
            </div>
            <CustomDialog.Footer>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateObserver}>Create Observer</Button>
            </CustomDialog.Footer>
          </CustomDialog.Content>
        </CustomDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Observer Management</CardTitle>
          <div className="flex items-center gap-2">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              showStatusFilter
              showDateFilter
            />
          </div>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          <DataTable
            columns={columns}
            data={filteredObservers}
            searchKey="name"
            searchPlaceholder="Search by name or ID..."
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <CustomDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <CustomDialog.Content
          className="max-w-2xl"
          onClose={() => setIsEditDialogOpen(false)}
        >
          <CustomDialog.Header>
            <CustomDialog.Title>Edit Observer</CustomDialog.Title>
            <CustomDialog.Description>
              Update observer information.
            </CustomDialog.Description>
          </CustomDialog.Header>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-observer-name">Observer Name *</Label>
                <Input
                  id="edit-observer-name"
                  value={observerName}
                  onChange={(e) => setObserverName(e.target.value)}
                  placeholder="Enter observer name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-observer-email">Observer Email *</Label>
                <Input
                  id="edit-observer-email"
                  type="email"
                  value={observerEmail}
                  onChange={(e) => setObserverEmail(e.target.value)}
                  placeholder="Enter observer email"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-observer-address">Address</Label>
              <Textarea
                id="edit-observer-address"
                value={observerAddress}
                onChange={(e) => setObserverAddress(e.target.value)}
                placeholder="Enter observer address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-observer-status">Status</Label>
              <Select
                value={observerStatus}
                onValueChange={(value: Status) => setObserverStatus(value)}
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
          </div>
          <CustomDialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateObserver}>Update Observer</Button>
          </CustomDialog.Footer>
        </CustomDialog.Content>
      </CustomDialog>
    </div>
  );
}
