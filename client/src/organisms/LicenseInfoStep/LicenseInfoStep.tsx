import { Control, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/molecules/FormField";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { states, positions } from "@shared/utilities/globalConsts";
import type { DriverFormValues } from "@/types/driverApplicationForm";

export interface LicenseInfoStepProps {
  control: Control<DriverFormValues>;
  className?: string;
}

export function LicenseInfoStep({ control, className }: LicenseInfoStepProps) {
  const {
    field: licenseStateField,
    fieldState: { error: licenseStateError },
  } = useController({
    name: "licenseState",
    control,
  });

  const {
    field: positionField,
    fieldState: { error: positionError },
  } = useController({
    name: "positionAppliedFor",
    control,
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      <FormField
        control={control}
        name="licenseNumber"
        label="License Number"
        placeholder="D123456789"
        required
      />

      <div className="space-y-2">
        <Label>
          <RequiredLabel required>License State</RequiredLabel>
        </Label>
        <Select
          onValueChange={licenseStateField.onChange}
          value={licenseStateField.value}
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
        {licenseStateError && (
          <p className="text-sm text-red-500 mt-1">
            {licenseStateError.message}
          </p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label>
          <RequiredLabel required>Position Applied For</RequiredLabel>
        </Label>
        <Select
          onValueChange={positionField.onChange}
          value={positionField.value}
          
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((position) => (
              <SelectItem key={position.value} value={position.value}>
                {position.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {positionError && (
          <p className="text-sm text-red-500 mt-1">{positionError.message}</p>
        )}
      </div>
    </div>
  );
}
