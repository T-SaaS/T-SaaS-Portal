import { cn } from "@/lib/utils";

export interface RequiredLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function RequiredLabel({
  children,
  required = false,
  className,
}: RequiredLabelProps) {
  return (
    <span className={cn(className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );
}
