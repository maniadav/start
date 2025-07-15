import * as React from "react";
import { Button } from "@management/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@management/components/ui/dialog";
import { Input } from "@management/components/ui/input";
import { Label } from "@management/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@management/components/ui/select";
import { Textarea } from "@management/components/ui/textarea";
import type { Status } from "@type/management.types";

interface OrganisationCreateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orgName: string;
  setOrgName: (v: string) => void;
  orgEmail: string;
  setOrgEmail: (v: string) => void;
  orgAddress: string;
  setOrgAddress: (v: string) => void;
  orgStatus: Status;
  setOrgStatus: (v: Status) => void;
  orgStorage: string;
  setOrgStorage: (v: string) => void;
  adminEmail: string;
  setAdminEmail: (v: string) => void;
  adminName: string;
  setAdminName: (v: string) => void;
  handleCreateOrganization: () => void;
  hasLimitedData?: boolean;
}

export function OrganisationCreateDialog({
  open,
  setOpen,
  orgName,
  setOrgName,
  orgEmail,
  setOrgEmail,
  orgAddress,
  setOrgAddress,
  orgStatus,
  setOrgStatus,
  orgStorage,
  setOrgStorage,
  adminEmail,
  setAdminEmail,
  adminName,
  setAdminName,
  handleCreateOrganization,
  hasLimitedData = false,
}: OrganisationCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Organisation</DialogTitle>
          <DialogDescription>
            Add a new organization with basic information.
            {hasLimitedData && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Note:</strong> Only basic information (Name, Email,
                Status) will be saved due to API limitations.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Core Required Fields - Always Available */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organisation Name *</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                required
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
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="org-status">Status</Label>
            <Select
              value={orgStatus}
              onValueChange={(value: Status) => setOrgStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Extended Fields - Only Show When Full API is Available */}
          {!hasLimitedData && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Additional Information
              </h4>

              <div className="grid gap-2">
                <Label htmlFor="org-address">Address</Label>
                <Textarea
                  id="org-address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="Enter organization address"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-storage">Allowed Storage (MB)</Label>
                <Input
                  id="org-storage"
                  type="number"
                  value={orgStorage}
                  onChange={(e) => setOrgStorage(e.target.value)}
                  placeholder="2048"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-name">Admin Name</Label>
                  <Input
                    id="admin-name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter admin name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
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
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateOrganization} type="button">
            Create Organisation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
