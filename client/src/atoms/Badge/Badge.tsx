import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  status?: "success" | "warning" | "error" | "info";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", status, children, ...props }, ref) => {
    const getStatusClasses = () => {
      switch (status) {
        case "success":
          return "bg-green-100 text-green-800 border-green-200";
        case "warning":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "error":
          return "bg-red-100 text-red-800 border-red-200";
        case "info":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "";
      }
    };

    return (
      <ShadcnBadge
        ref={ref}
        variant={variant}
        className={cn(getStatusClasses(), className)}
        {...props}
      >
        {children}
      </ShadcnBadge>
    );
  }
);

Badge.displayName = "Badge";
