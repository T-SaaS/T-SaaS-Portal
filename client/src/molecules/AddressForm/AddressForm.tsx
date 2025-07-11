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
import { DateRangeInput } from "@/molecules/DateRangeInput";
import { states } from "@shared/utilities/globalConsts";

export interface AddressFormProps {
  control: Control<any>;
  addressName: string;
  cityName: string;
  stateName: string;
  zipName: string;
  fromMonthName: string;
  fromYearName: string;
  toMonthName: string;
  toYearName: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function AddressForm({
  control,
  addressName,
  cityName,
  stateName,
  zipName,
  fromMonthName,
  fromYearName,
  toMonthName,
  toYearName,
  label = "Address",
  required = false,
  className,
}: AddressFormProps) {
  const {
    field: addressField,
    fieldState: { error: addressError },
  } = useController({
    name: addressName,
    control,
  });

  const {
    field: cityField,
    fieldState: { error: cityError },
  } = useController({
    name: cityName,
    control,
  });

  const {
    field: stateField,
    fieldState: { error: stateError },
  } = useController({
    name: stateName,
    control,
  });

  const {
    field: zipField,
    fieldState: { error: zipError },
  } = useController({
    name: zipName,
    control,
  });

  return (
    <div className={className}>
      <Label>
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </Label>

      <div className="space-y-4 mt-2">
        <Input placeholder="123 Main Street" {...addressField} />
        {addressError && (
          <p className="text-sm text-red-500">{addressError.message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input placeholder="San Francisco" {...cityField} />
            {cityError && (
              <p className="text-sm text-red-500">{cityError.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>State</Label>
            <Select
              onValueChange={stateField.onChange}
              value={stateField.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stateError && (
              <p className="text-sm text-red-500">{stateError.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>ZIP Code</Label>
            <Input placeholder="94102" {...zipField} />
            {zipError && (
              <p className="text-sm text-red-500">{zipError.message}</p>
            )}
          </div>
        </div>

        <DateRangeInput
          control={control}
          fromMonthName={fromMonthName}
          fromYearName={fromYearName}
          toMonthName={toMonthName}
          toYearName={toYearName}
          label="Residence Period"
          required={required}
        />
      </div>
    </div>
  );
}
