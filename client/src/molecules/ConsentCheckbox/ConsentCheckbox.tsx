import { Control, useController } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";

export interface ConsentCheckboxProps {
  control: Control<any>;
  name: string;
  label: string;
  description: string;
  required?: boolean;
  className?: string;
}

export function ConsentCheckbox({
  control,
  name,
  label,
  description,
  required = false,
  className,
}: ConsentCheckboxProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className={className}>
      <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={field.value === 1}
            onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <Label className="text-sm font-medium text-slate-900">
              <RequiredLabel required={required}>{label}</RequiredLabel>
            </Label>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
