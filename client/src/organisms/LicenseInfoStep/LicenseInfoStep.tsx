import { Control, useController, useWatch } from "react-hook-form";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
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

  const {
    field: expirationDateField,
    fieldState: { error: expirationDateError },
  } = useController({
    name: "licenseExpirationDate",
    control,
  });

  const {
    field: medicalCardExpirationField,
    fieldState: { error: medicalCardExpirationError },
  } = useController({
    name: "medicalCardExpirationDate",
    control,
  });

  // Watch expiration dates for real-time validation
  const licenseExpirationDate = useWatch({
    control,
    name: "licenseExpirationDate",
  });

  const medicalCardExpirationDate = useWatch({
    control,
    name: "medicalCardExpirationDate",
  });

  // Check if dates are expired
  const isLicenseExpired =
    licenseExpirationDate && new Date(licenseExpirationDate) < new Date();
  const isMedicalCardExpired =
    medicalCardExpirationDate &&
    new Date(medicalCardExpirationDate) < new Date();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Expiration Alerts */}
      {isLicenseExpired && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your driver's license has expired. Please provide a valid,
            non-expired license.
          </AlertDescription>
        </Alert>
      )}

      {isMedicalCardExpired && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your medical card has expired. Please provide a valid, non-expired
            medical card.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-2">
          <Label>
            <RequiredLabel required>License Expiration Date</RequiredLabel>
          </Label>
          <input
            type="date"
            value={expirationDateField.value || ""}
            onChange={expirationDateField.onChange}
            onBlur={expirationDateField.onBlur}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {expirationDateError && (
            <p className="text-sm text-red-500 mt-1">
              {expirationDateError.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            <RequiredLabel required>Medical Card Expiration Date</RequiredLabel>
          </Label>
          <input
            type="date"
            value={medicalCardExpirationField.value || ""}
            onChange={medicalCardExpirationField.onChange}
            onBlur={medicalCardExpirationField.onBlur}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {medicalCardExpirationError && (
            <p className="text-sm text-red-500 mt-1">
              {medicalCardExpirationError.message}
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
    </div>
  );
}
