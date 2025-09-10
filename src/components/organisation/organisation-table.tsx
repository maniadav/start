import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@management/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@management/components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import {
  Filter,
  Eye,
  Edit,
  Download,
  Trash2,
  EllipsisVertical,
  Ellipsis,
  ArrowUpDown,
  MoreHorizontal,
  Delete,
  View,
} from "lucide-react";
import { formatFileSize } from "@management/lib/data-service";
import { Organisation, Status } from "@type/management.types";
import { Badge } from "@management/components/ui/badge";

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

export function OrganisationTable({
  data,
  handleOrgActions,
  hideSearchBar = false,
}: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      {
        accessorKey: "user_id",
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
        accessorKey: "joinedOn",
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
          return <Badge>{status}</Badge>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const org = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-white p-8">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white py-2">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions(
                      "credential",
                      org.unique_id || org.user_id || ""
                    )
                  }
                >
                  <View className="mr-2 h-4 w-4" />
                  Set Credential
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions("edit", org.unique_id || org.user_id || "")
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleOrgActions(
                      "delete",
                      org.unique_id || org.user_id || ""
                    )
                  }
                >
                  <Delete className="mr-2 h-4 w-4" />
                  Delete Organisation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      {data.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{data.length} files</span>
          {sorting.length > 0 && (
            <span>
              • Sorted by {sorting[0].id} (
              {sorting[0].desc ? "Descending" : "Ascending"})
            </span>
          )}
        </div>
      )}

      {/* Results Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12">
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-2"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No files available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
