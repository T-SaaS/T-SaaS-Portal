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

export interface CompanyFilters {
  domain?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CompanySearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  availableDomains: string[];
  searchPlaceholder?: string;
}

export function CompanySearchFilterBar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableDomains,
  searchPlaceholder = "Search companies...",
}: CompanySearchFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof CompanyFilters,
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
          <ActionButton
            icon={Filter}
            variant={hasActiveFilters ? "default" : "outline"}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </ActionButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Companies</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <div className="col-span-3">
                <Select
                  value={filters.domain || "all"}
                  onValueChange={(value) => handleFilterChange("domain", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {availableDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date Range</Label>
              <div className="col-span-3">
                <FilterDateRange
                  fromDate={filters.dateFrom}
                  toDate={filters.dateTo}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
