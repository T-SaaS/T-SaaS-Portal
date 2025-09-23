import { Control, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { months } from "@shared/utilities/globalConsts";
import { cn } from "@/lib/utils";

export interface DateRangeInputProps {
  control: Control<any>;
  fromMonthName: string;
  fromYearName: string;
  toMonthName: string;
  toYearName: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function DateRangeInput({
  control,
  fromMonthName,
  fromYearName,
  toMonthName,
  toYearName,
  label,
  required = false,
  className,
}: DateRangeInputProps) {
  const {
    field: fromMonthField,
    fieldState: { error: fromMonthError },
  } = useController({
    name: fromMonthName,
    control,
  });

  const {
    field: fromYearField,
    fieldState: { error: fromYearError },
  } = useController({
    name: fromYearName,
    control,
  });

  const {
    field: toMonthField,
    fieldState: { error: toMonthError },
  } = useController({
    name: toMonthName,
    control,
  });

  const {
    field: toYearField,
    fieldState: { error: toYearError },
  } = useController({
    name: toYearName,
    control,
  });

  const hasError =
    fromMonthError || fromYearError || toMonthError || toYearError;

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From Month</Label>
          <Select
            onValueChange={(value) => fromMonthField.onChange(Number(value))}
            value={fromMonthField.value?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From Year</Label>
          <Input
            type="number"
            placeholder="2020"
            {...fromYearField}
            onChange={(e) => fromYearField.onChange(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To Month</Label>
          <Select
            onValueChange={(value) => toMonthField.onChange(Number(value))}
            value={toMonthField.value?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To Year</Label>
          <Input
            type="number"
            placeholder="2024"
            {...toYearField}
            onChange={(e) => toYearField.onChange(Number(e.target.value))}
          />
        </div>
      </div>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {fromMonthError?.message ||
            fromYearError?.message ||
            toMonthError?.message ||
            toYearError?.message}
        </p>
      )}
    </div>
  );
}
