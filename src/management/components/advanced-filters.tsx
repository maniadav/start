"use client";

import * as React from "react";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@management/components/ui/button";
import { Calendar } from "@management/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@management/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@management/components/ui/select";
import { Input } from "components/ui/input";
import { Label } from "@management/components/ui/label";
import { Badge } from "@management/components/ui/badge";
import { cn } from "@management/lib/utils";
import type { FilterOptions, Status } from "@type/management.types";

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showStorageFilter?: boolean;
  showUserCountFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  showStorageFilter = false,
  showUserCountFilter = false,
  showStatusFilter = false,
  showDateFilter = false,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const statusOptions: Status[] = ["active", "pending", "deactivated"];

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null) return true;
    return value !== undefined && value !== "";
  }).length;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white p-8" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>

            {showStatusFilter && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status?.[0] || ""}
                  onValueChange={(value) =>
                    updateFilters({
                      status: value ? [value as Status] : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDateFilter && (
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.from
                          ? format(filters.dateRange.from, "PPP")
                          : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.from}
                        onSelect={(date) =>
                          updateFilters({
                            dateRange: {
                              from: date || new Date(),
                              to: filters.dateRange?.to ?? new Date(),
                            },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.dateRange?.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.to
                          ? format(filters.dateRange.to, "PPP")
                          : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.to}
                        onSelect={(date) =>
                          updateFilters({
                            dateRange: {
                              from: filters.dateRange?.from ?? new Date(),
                              to: date || new Date(),
                            },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {showStorageFilter && (
              <div className="space-y-2">
                <Label>Storage Comparison</Label>
                <div className="flex gap-2">
                  <Select
                    value={filters.storageComparison?.operator || ""}
                    onValueChange={(value) =>
                      updateFilters({
                        storageComparison: {
                          ...filters.storageComparison,
                          operator: value as "<" | "=" | ">",
                          value: filters.storageComparison?.value ?? 0,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Op" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<">{"<"}</SelectItem>
                      <SelectItem value="=">=</SelectItem>
                      <SelectItem value=">">{">"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="MB"
                    value={filters.storageComparison?.value ?? ""}
                    onChange={(e) =>
                      updateFilters({
                        storageComparison: {
                          operator: filters.storageComparison?.operator ?? "<",
                          value:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {showUserCountFilter && (
              <div className="space-y-2">
                <Label>User Count Comparison</Label>
                <div className="flex gap-2">
                  <Select
                    value={filters.userCountComparison?.operator || ""}
                    onValueChange={(value) =>
                      updateFilters({
                        userCountComparison: {
                          ...filters.userCountComparison,
                          operator: value as "<" | "=" | ">",
                          value: filters.userCountComparison?.value ?? 0,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Op" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<">{"<"}</SelectItem>
                      <SelectItem value="=">=</SelectItem>
                      <SelectItem value=">">{">"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Count"
                    value={filters.userCountComparison?.value ?? ""}
                    onChange={(e) =>
                      updateFilters({
                        userCountComparison: {
                          operator:
                            filters.userCountComparison?.operator ?? "<",
                          value: Number(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
