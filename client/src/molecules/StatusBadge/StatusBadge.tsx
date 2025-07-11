import { Badge } from "@/atoms/Badge";
import { DriverApplication } from "@/types";

interface StatusBadgeProps {
  status: DriverApplication["status"];
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          status: "success" as const,
          variant: "default" as const,
        };
      case "rejected":
        return {
          label: "Rejected",
          status: "error" as const,
          variant: "destructive" as const,
        };
      case "pending":
        return {
          label: "Pending",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      default:
        return {
          label: status,
          status: "info" as const,
          variant: "outline" as const,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant={config.variant}
      status={config.status}
      className={className}
    >
      {config.label}
    </Badge>
  );
}
