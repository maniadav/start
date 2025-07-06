import * as React from "react";
import { Button } from "@management/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@management/components/ui/dialog";
import { Input } from "@management/components/ui/input";
import { Label } from "@management/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@management/components/ui/select";
import { Textarea } from "@management/components/ui/textarea";
import { useToast } from "@management/hooks/use-toast";
import type { Status, Organisation, User } from "@type/management.types";

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
}: OrganisationCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateOrganization}>
            Create Organisation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
