import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FilterDateRangeProps {
  fromDate?: string;
  toDate?: string;
  onDateRangeChange: (from: string | undefined, to: string | undefined) => void;
}

export function FilterDateRange({
  fromDate,
  toDate,
  onDateRangeChange,
}: FilterDateRangeProps) {
  const handleFromDateChange = (value: string) => {
    onDateRangeChange(value || undefined, toDate);
  };

  const handleToDateChange = (value: string) => {
    onDateRangeChange(fromDate, value || undefined);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label htmlFor="from-date" className="text-xs">
          From
        </Label>
        <Input
          id="from-date"
          type="date"
          value={fromDate || ""}
          onChange={(e) => handleFromDateChange(e.target.value)}
          className="text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to-date" className="text-xs">
          To
        </Label>
        <Input
          id="to-date"
          type="date"
          value={toDate || ""}
          onChange={(e) => handleToDateChange(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );
}
