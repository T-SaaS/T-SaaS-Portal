import { SearchInput } from "@/atoms/SearchInput";
import { ActionButton } from "@/atoms/ActionButton";
import { Filter } from "lucide-react";

export interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
  searchPlaceholder?: string;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  onFilterClick,
  searchPlaceholder = "Search applications...",
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <ActionButton icon={Filter} variant="outline" onClick={onFilterClick}>
        Filter
      </ActionButton>
    </div>
  );
}
