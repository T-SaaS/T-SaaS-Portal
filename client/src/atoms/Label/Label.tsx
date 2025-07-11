import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <ShadcnLabel ref={ref} className={cn(className)} {...props}>
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </ShadcnLabel>
    );
  }
);

Label.displayName = "Label";
