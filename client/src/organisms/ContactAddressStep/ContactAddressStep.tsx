import { Control, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/molecules/FormField";
import { FormSection } from "@/molecules/FormSection";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { months, states } from "@shared/utilities/globalConsts";
import type { DriverFormValues } from "@/types/driverApplicationForm";

export interface ContactAddressStepProps {
  control: Control<DriverFormValues>;
  className?: string;
}

export function ContactAddressStep({
  control,
  className,
}: ContactAddressStepProps) {
  const {
    field: currentStateField,
    fieldState: { error: currentStateError },
  } = useController({
    name: "currentState",
    control,
  });

  const {
    field: currentAddressFromMonthField,
    fieldState: { error: currentAddressFromMonthError },
  } = useController({
    name: "currentAddressFromMonth",
    control,
  });

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="5551234567"
          required
        />

        <FormField
          control={control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="john.smith@email.com"
          required
        />
      </div>

      <FormSection title="Current Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="currentAddress"
            label="Street Address"
            placeholder="123 Main Street"
            required
            className="md:col-span-2"
          />

          <FormField
            control={control}
            name="currentCity"
            label="City"
            placeholder="City"
            required
          />

          <div className="space-y-2">
            <Label>
              <RequiredLabel required>State</RequiredLabel>
            </Label>
            <Select
              onValueChange={currentStateField.onChange}
              value={currentStateField.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentStateError && (
              <p className="text-sm text-red-500 mt-1">
                {currentStateError.message}
              </p>
            )}
          </div>

          <FormField
            control={control}
            name="currentZip"
            label="ZIP Code"
            placeholder="12345"
            required
          />

          <div className="space-y-2">
            <Label>
              <RequiredLabel required>Month Moved In</RequiredLabel>
            </Label>
            <Select
              onValueChange={(value) =>
                currentAddressFromMonthField.onChange(Number(value))
              }
              value={currentAddressFromMonthField.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentAddressFromMonthError && (
              <p className="text-sm text-red-500 mt-1">
                {currentAddressFromMonthError.message}
              </p>
            )}
          </div>

          <FormField
            control={control}
            name="currentAddressFromYear"
            label="Year Moved In"
            type="number"
            placeholder="2024"
            min={1925}
            max={new Date().getFullYear()}
            required
          />
        </div>
      </FormSection>
    </div>
  );
}
