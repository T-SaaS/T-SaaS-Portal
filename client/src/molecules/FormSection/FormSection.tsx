import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function FormSection({
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <h3 className={cn("text-lg font-medium text-slate-900", titleClassName)}>
        {title}
      </h3>
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </div>
  );
}
