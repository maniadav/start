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
} from "lucide-react";
import { formatFileSize } from "@management/lib/data-service";

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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

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
      header: "Organization",
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
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const file = row.original;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <Ellipsis className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="w-48 bg-white">
    //           <DropdownMenuLabel>File Actions</DropdownMenuLabel>
    //           <DropdownMenuSeparator />

    //           <DropdownMenuItem onClick={() => onViewFile?.(file)}>
    //             <Eye className="mr-2 h-4 w-4" />
    //             View Details
    //           </DropdownMenuItem>

    //           <DropdownMenuItem onClick={() => onEditFile?.(file)}>
    //             <Edit className="mr-2 h-4 w-4" />
    //             Edit Details
    //           </DropdownMenuItem>

    //           <DropdownMenuItem onClick={() => onDownloadFile?.(file)}>
    //             <Download className="mr-2 h-4 w-4" />
    //             Download File
    //           </DropdownMenuItem>

    //           <DropdownMenuSeparator />

    //           <DropdownMenuItem
    //             onClick={() => onDeleteFile?.(file)}
    //             className="text-red-600 focus:text-red-600"
    //           >
    //             <Trash2 className="mr-2 h-4 w-4" />
    //             Delete File
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

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
