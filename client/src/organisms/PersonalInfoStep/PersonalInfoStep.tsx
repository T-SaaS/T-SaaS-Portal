import { Control } from "react-hook-form";
import { FormField } from "@/molecules/FormField";
import type { DriverFormValues } from "@/types/driverApplicationForm";

export interface PersonalInfoStepProps {
  control: Control<DriverFormValues>;
  className?: string;
}

export function PersonalInfoStep({
  control,
  className,
}: PersonalInfoStepProps) {
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
        className="md:col-span-1"
      />
    </div>
  );
}
