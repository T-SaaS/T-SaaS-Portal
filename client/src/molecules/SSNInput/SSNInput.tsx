import { Control, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/atoms/RequiredLabel";
import { cn } from "@/lib/utils";

export interface SSNInputProps {
  control: Control<any>;
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function SSNInput({
  control,
  name,
  label,
  required = false,
  className,
}: SSNInputProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format SSN with dashes
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
    } else if (value.length >= 4) {
      value = value.replace(/(\d{3})(\d{2})/, "$1-$2");
    }
    field.onChange(value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </Label>
      <Input
        placeholder="123-45-6789"
        {...field}
        onChange={handleChange}
        maxLength={11}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
