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

interface OrganisationEditDialogProps {
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
  handleUpdateOrganization: () => void;
  hasLimitedData?: boolean;
}

export function OrganisationEditDialog({
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
  handleUpdateOrganization,
  hasLimitedData = false,
}: OrganisationEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Organisation</DialogTitle>
          <DialogDescription>
            Update organization information.
            {hasLimitedData && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Note:</strong> Only basic information (Name, Email,
                Status) can be edited due to API limitations.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Core fields that are always available */}
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

          {/* Extended fields - only show when not limited */}
          {!hasLimitedData && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="edit-org-address">Address</Label>
                <Textarea
                  id="edit-org-address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="Enter organization address"
                />
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
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateOrganization}>
            Update Organisation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
