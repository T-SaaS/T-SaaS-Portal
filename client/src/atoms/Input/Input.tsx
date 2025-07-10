import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <ShadcnInput
        ref={ref}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
