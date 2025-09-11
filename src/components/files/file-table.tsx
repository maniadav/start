import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatFileSize } from "@management/lib/data-service";
import { DataTable } from "@components/table/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { Eye, Edit, Download, Trash2, Ellipsis } from "lucide-react";

interface FileData {
  task_id: string;
  file_size: number;
  organisation_id: string;
  observer_id: string;
  child_id: string;
  date_created: string;
  file_url: string;
  last_updated: string;
}

interface SimplifiedFileTableProps {
  data: FileData[];
  onViewFile?: (file: FileData) => void;
  onEditFile?: (file: FileData) => void;
  onDeleteFile?: (file: FileData) => void;
  onDownloadFile?: (file: FileData) => void;
  hideSearchBar?: boolean;
}

export function FileTable({
  data,
  onViewFile,
  onEditFile,
  onDeleteFile,
  onDownloadFile,
  hideSearchBar = false,
}: SimplifiedFileTableProps) {
  // Define table columns
  const columns: ColumnDef<FileData>[] = [
    {
      accessorKey: "task_id",
      header: "Task ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.getValue("task_id")}
        </div>
      ),
    },
    {
      accessorKey: "file_size",
      header: "File Size",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatFileSize(row.getValue("file_size"))}
        </div>
      ),
    },
    {
      accessorKey: "organisation_id",
      header: "Organisation",
      cell: ({ row }) => (
        <div className="font-medium text-sm">
          {row.getValue("organisation_id")}
        </div>
      ),
    },
    {
      accessorKey: "observer_id",
      header: "Observer",
      cell: ({ row }) => (
        <div className="font-medium text-sm">{row.getValue("observer_id")}</div>
      ),
    },
    {
      accessorKey: "child_id",
      header: "Child ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.getValue("child_id")}
        </div>
      ),
    },
    {
      accessorKey: "date_created",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date_created"));
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">
              {date.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;
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

              <DropdownMenuItem onClick={() => onViewFile?.(file)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEditFile?.(file)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onDownloadFile?.(file)}>
                <Download className="mr-2 h-4 w-4" />
                Download File
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDeleteFile?.(file)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} summaryLabel="files" />;
}
