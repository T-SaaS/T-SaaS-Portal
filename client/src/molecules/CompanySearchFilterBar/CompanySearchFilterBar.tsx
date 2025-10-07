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

export interface CompanyFilters {
  companyId?: string;
  status?: string;
}

export interface CompanySearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  availableCompanies: Array<{ id: string; name: string }>;
  availableStatuses: string[];
  searchPlaceholder?: string;
}

export function CompanySearchFilterBar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableCompanies,
  availableStatuses,
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
            <DialogTitle>Filter Drivers</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <div className="col-span-3">
                <Select
                  value={filters.companyId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("companyId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
