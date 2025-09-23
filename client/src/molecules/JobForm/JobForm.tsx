import { Control, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangeInput } from "@/molecules/DateRangeInput";

// Reusable phone validation pattern
const PHONE_REGEX =
  /^[\+]?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const PHONE_ERROR_MESSAGE =
  "Phone number must be a valid US number (e.g., 123-456-7890, (123) 456-7890, +1-123-456-7890)";

// Phone validation utility
const validatePhone = (value: string): string | true => {
  if (!value) return true; // Allow empty for optional fields
  if (!PHONE_REGEX.test(value)) {
    return PHONE_ERROR_MESSAGE;
  }
  return true;
};

// Phone input formatting utility
const formatPhoneInput = (value: string): string => {
  return value.replace(/[^\d+]/g, ""); // Only allow digits and +
};

export interface JobFormProps {
  control: Control<any>;
  employerName: string;
  positionHeldName: string;
  businessName: string;
  companyEmail: string;
  companyPhone: string;
  reasonForLeaving: string;
  fromMonthName: string;
  fromYearName: string;
  toMonthName: string;
  toYearName: string;
  required?: boolean;
  className?: string;
}

export function JobForm({
  control,
  employerName,
  positionHeldName,
  businessName,
  companyEmail,
  companyPhone,
  reasonForLeaving,
  fromMonthName,
  fromYearName,
  toMonthName,
  toYearName,
  required = false,
  className,
}: JobFormProps) {
  const {
    field: employerField,
    fieldState: { error: employerError },
  } = useController({
    name: employerName,
    control,
  });

  const {
    field: positionField,
    fieldState: { error: positionError },
  } = useController({
    name: positionHeldName,
    control,
  });

  const {
    field: businessNameField,
    fieldState: { error: businessNameError },
  } = useController({
    name: businessName,
    control,
  });

  const {
    field: companyEmailField,
    fieldState: { error: companyEmailError },
  } = useController({
    name: companyEmail,
    control,
  });

  const {
    field: companyPhoneField,
    fieldState: { error: companyPhoneError },
  } = useController({
    name: companyPhone,
    control,
  });

  const {
    field: reasonForLeavingField,
    fieldState: { error: reasonForLeavingError },
  } = useController({
    name: reasonForLeaving,
    control,
  });

  // Handle phone input with validation and formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInput(e.target.value);
    companyPhoneField.onChange(formattedValue);
  };

  const handlePhoneBlur = () => {
    const validation = validatePhone(companyPhoneField.value);
    if (validation !== true) {
      // You can set a custom error here if needed
      console.warn(validation);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Employer Name</Label>
            <Input placeholder="ABC Transportation" {...employerField} />
            {employerError && (
              <p className="text-sm text-red-500">{employerError.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Position Held</Label>
            <Input placeholder="Delivery Driver" {...positionField} />
            {positionError && (
              <p className="text-sm text-red-500">{positionError.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input placeholder="ABC Transportation" {...businessNameField} />
            {businessNameError && (
              <p className="text-sm text-red-500">
                {businessNameError.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Company Email</Label>
            <Input
              placeholder="abc@transportation.com"
              {...companyEmailField}
            />
            {companyEmailError && (
              <p className="text-sm text-red-500">
                {companyEmailError.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Company Phone</Label>
            <Input
              placeholder="123-456-7890"
              {...companyPhoneField}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
            />
            {companyPhoneError && (
              <p className="text-sm text-red-500">
                {companyPhoneError.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Reason for Leaving</Label>
            <Input placeholder="Resigned" {...reasonForLeavingField} />
            {reasonForLeavingError && (
              <p className="text-sm text-red-500">
                {reasonForLeavingError.message}
              </p>
            )}
          </div>
        </div>

        <DateRangeInput
          control={control}
          fromMonthName={fromMonthName}
          fromYearName={fromYearName}
          toMonthName={toMonthName}
          toYearName={toYearName}
          label="Employment Period"
          required={required}
        />
      </div>
    </div>
  );
}
