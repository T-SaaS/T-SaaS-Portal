import { Control, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { DateRangeInput } from "@/molecules/DateRangeInput";

export interface JobFormProps {
  control: Control<any>;
  employerName: string;
  positionHeldName: string;
  businessName: string;
  companyEmail: string;
  fromMonthName: string;
  fromYearName: string;
  toMonthName: string;
  toYearName: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function JobForm({
  control,
  employerName,
  positionHeldName,
  businessName,
  companyEmail,
  fromMonthName,
  fromYearName,
  toMonthName,
  toYearName,
  label,
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

  return (
    <div className={className}>
      <Label>
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </Label>

      <div className="space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-sm text-red-500">{businessNameError.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Company Email</Label>
            <Input placeholder="abc@transportation.com" {...companyEmailField} />
            {companyEmailError && (
              <p className="text-sm text-red-500">{companyEmailError.message}</p>
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
