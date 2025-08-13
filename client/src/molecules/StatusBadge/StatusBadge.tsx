import { Badge } from "@/atoms/Badge";
import { DriverApplication, Driver } from "@/types";

export interface StatusBadgeProps {
  status:
    | DriverApplication["status"]
    | Driver["status"]
    | "pending"
    | "approved"
    | "rejected";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      // Initial states
      case "New":
        return {
          label: "New",
          status: "info" as const,
          variant: "outline" as const,
        };

      // Processing states
      case "Under Review":
        return {
          label: "Under Review",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "On Hold":
        return {
          label: "On Hold",
          status: "warning" as const,
          variant: "destructive" as const,
        };

      // Background check states
      case "MVR Check":
        return {
          label: "MVR Check",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "Drug Screening":
        return {
          label: "Drug Screening",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "PSP Review":
        return {
          label: "PSP Review",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "Background Complete":
        return {
          label: "Background Complete",
          status: "success" as const,
          variant: "default" as const,
        };

      // Final states
      case "Hired":
        return {
          label: "Hired",
          status: "success" as const,
          variant: "default" as const,
        };
      case "Approved":
        return {
          label: "Approved",
          status: "success" as const,
          variant: "default" as const,
        };
      case "Rejected":
        return {
          label: "Rejected",
          status: "error" as const,
          variant: "destructive" as const,
        };
      case "Disqualified":
        return {
          label: "Disqualified",
          status: "error" as const,
          variant: "destructive" as const,
        };
      case "Expired":
        return {
          label: "Expired",
          status: "error" as const,
          variant: "destructive" as const,
        };

      // Driver statuses
      case "active":
        return {
          label: "Active",
          status: "success" as const,
          variant: "default" as const,
        };
      case "out_of_duty":
        return {
          label: "Out of Duty",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "no_longer_employed":
        return {
          label: "No Longer Employed",
          status: "error" as const,
          variant: "destructive" as const,
        };

      // Legacy statuses for backward compatibility
      case "pending":
        return {
          label: "Pending",
          status: "warning" as const,
          variant: "secondary" as const,
        };
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
