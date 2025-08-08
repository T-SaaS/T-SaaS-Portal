import { useState } from "react";
import { SearchInput } from "@/atoms/SearchInput";
import { ActionButton } from "@/atoms/ActionButton";
import { Filter, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterDateRange } from "@/molecules/FilterDateRange";
import { DriverApplication } from "@/types";
import { Company } from "@shared/schema";

export interface ApplicationFilters {
  status?: DriverApplication["status"];
  company_id?: string;
  dateFrom?: string;
  dateTo?: string;
  state?: string;
  position?: string;
  background_check_status?: string;
}

export type ApplicationFiltersType = ApplicationFilters;

export interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  companies: Company[];
  availableStatuses: DriverApplication["status"][];
  availableStates: string[];
  availablePositions: string[];
  searchPlaceholder?: string;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  companies,
  availableStatuses,
  availableStates,
  availablePositions,
  searchPlaceholder = "Search applications...",
}: SearchFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof ApplicationFilters,
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value || undefined,
    });
  };

  const handleDateRangeChange = (
    from: string | undefined,
    to: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      dateFrom: from,
      dateTo: to,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  );

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <ActionButton icon={Filter} variant="outline" className="relative">
            Filter
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></span>
            )}
          </ActionButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Filter Applications</span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value || undefined)
                }
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div className="space-y-2">
              <Label htmlFor="company-filter">Company</Label>
              <Select
                value={filters.company_id || "all"}
                onValueChange={(value) =>
                  handleFilterChange("company_id", value || undefined)
                }
              >
                <SelectTrigger id="company-filter">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Submitted Date Range</Label>
              <FilterDateRange
                fromDate={filters.dateFrom}
                toDate={filters.dateTo}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <Label htmlFor="state-filter">State</Label>
              <Select
                value={filters.state || "all"}
                onValueChange={(value) =>
                  handleFilterChange("state", value || undefined)
                }
              >
                <SelectTrigger id="state-filter">
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {availableStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position Filter */}
            <div className="space-y-2">
              <Label htmlFor="position-filter">Position</Label>
              <Select
                value={filters.position || "all"}
                onValueChange={(value) =>
                  handleFilterChange("position", value || undefined)
                }
              >
                <SelectTrigger id="position-filter">
                  <SelectValue placeholder="All positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All positions</SelectItem>
                  {availablePositions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Background Check Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="background-check-filter">
                Background Check Status
              </Label>
              <Select
                value={filters.background_check_status || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "background_check_status",
                    value || undefined
                  )
                }
              >
                <SelectTrigger id="background-check-filter">
                  <SelectValue placeholder="All background check statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All background check statuses
                  </SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
