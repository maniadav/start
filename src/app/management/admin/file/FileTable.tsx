import * as React from "react";
import { DataTable } from "@management/components/data-table";
import { Badge } from "@management/components/ui/badge";
import { Button } from "@management/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@management/components/ui/dropdown-menu";
import { ArrowUpDown, Download, MoreHorizontal } from "lucide-react";
import { formatFileSize } from "@management/lib/data-service";
import type { UploadedFile } from "@type/management.types";

interface FileTableProps {
  columns: any;
  data: UploadedFile[];
}

export function FileTable({ columns, data }: FileTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search by file name or ID..."
    />
  );
}
