import { Control, useWatch, useController } from "react-hook-form";
import { FormField } from "@/molecules/FormField";
import { SSNInput } from "@/molecules/SSNInput";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { positions } from "@shared/utilities/globalConsts";

export interface PersonalInfoStepProps {
  control: Control<DriverFormValues>;
  className?: string;
}

export function PersonalInfoStep({
  control,
  className,
}: PersonalInfoStepProps) {
  // Watch the date of birth field to calculate age
  const dob = useWatch({
    control,
    name: "dob",
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
        name="firstName"
        label="First Name"
        placeholder="Enter your first name"
        required
      />

      <FormField
        control={control}
        name="lastName"
        label="Last Name"
        placeholder="Enter your last name"
        required
      />

      <FormField
        control={control}
        name="dob"
        label="Date of Birth"
        type="date"
        required
        max={new Date().toISOString().split("T")[0] as unknown as number}
      />

      <SSNInput
        control={control}
        name="socialSecurityNumber"
        label="Social Security Number"
        required
        className="md:col-span-1"
      />

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
