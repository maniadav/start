import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/button/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Delete,
  View,
  Ellipsis,
  Key,
  Trash2,
  Mail,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DataTable } from "@components/table/table";
import { POPUP_TYPES } from "@constants/config.constant";
interface IManagementTableProps {
  data: any[];
  handlebuttonActions: (
    action: string,
    data: {
      id: string | undefined;
      name: string | undefined;
      email: string | undefined;
    }
  ) => void;
  forRole: "observer" | "organisation";
}

export function ManagementTable({
  data,
  handlebuttonActions,
  forRole,
}: IManagementTableProps) {
  const columns: ColumnDef<any>[] = React.useMemo(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "user_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-left capitalize"
            >
              {`${forRole} ID`}
            </Button>
          );
        },
        cell: ({ row }) => {
          const fullId = row.getValue("user_id") as string;
          const shortId = fullId ? `...${fullId.slice(-4)}` : "N/A";
          
          const handleCopy = () => {
            navigator.clipboard.writeText(fullId);
            toast.success("ID copied to clipboard");
          };

          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{shortId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Copy className="h-3 w-3 text-gray-500" />
              </Button>
            </div>
          );
        },
      },
    ];

    // Add organisation_id column only for observer role
    if (forRole === "observer") {
      baseColumns.push({
        accessorKey: "organisation_id",
        header: "Organisation ID",
        cell: ({ row }) => {
          const fullId = row.getValue("organisation_id") as string;
          const shortId = fullId ? `...${fullId.slice(-4)}` : "N/A";
          
          const handleCopy = () => {
            navigator.clipboard.writeText(fullId);
            toast.success("Organisation ID copied to clipboard");
          };

          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{shortId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Copy className="h-3 w-3 text-gray-500" />
              </Button>
            </div>
          );
        },
      });
    }

    baseColumns.push(
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-left capitalize"
            >
              {`${forRole} Name`}
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
            : "-";
        },
      },
      {
        accessorKey: "email",
        header: `${forRole} Email`,
        cell: ({ row }) => {
          const email = row.getValue("email");
          return email || "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          if (!status) return "-";
          return (
            <Badge variant={status as "active" | "pending" | "blocked"}>
              {String(status)}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuLabel>File Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {forRole === "organisation" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handlebuttonActions(POPUP_TYPES.CREDENTIALS, {
                        id: item.unique_id || item.user_id || "",
                        name: item.name || item.organisation_name || "Unknown",
                        email: item.email || "Unknown",
                      })
                    }
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Set Credentials
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() =>
                    handlebuttonActions(POPUP_TYPES.EDIT, {
                      id: item.unique_id || item.user_id || "",
                      name: item.name || item.organisation_name || "Unknown",
                      email: item.email || "Unknown",
                    })
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>

                {item.status === "pending" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handlebuttonActions(POPUP_TYPES.SEND_ACTIVATION_MAIL, {
                        id: item.unique_id || item.user_id || "",
                        name: item.name || item.organisation_name || "Unknown",
                        email: item.email || "Unknown",
                      })
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Activation Mail
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    handlebuttonActions("delete", {
                      id: item.unique_id || item.user_id || "",
                      name: item.name || item.organisation_name || "Unknown",
                      email: item.email || "Unknown",
                    })
                  }
                  className="text-red-600 focus:text-red-600 capitalize"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {forRole}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );

    return baseColumns;
  }, [handlebuttonActions, forRole]);

  return <DataTable data={data} columns={columns} summaryLabel={forRole} />;
}
