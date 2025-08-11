import { Badge } from "@/atoms/Badge";
import { DriverApplication } from "@/types";

export interface StatusBadgeProps {
  status: DriverApplication["status"] | "pending" | "approved" | "rejected";
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
      case "Reviewing Application":
        return {
          label: "Reviewing",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "On Hold":
        return {
          label: "On Hold",
          status: "warning" as const,
          variant: "destructive" as const,
        };
      case "Signed Consents":
        return {
          label: "Consents Signed",
          status: "success" as const,
          variant: "default" as const,
        };

      // Screening states
      case "Run MVR":
        return {
          label: "MVR Check",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "Drug Screening":
        return {
          label: "Drug Test",
          status: "warning" as const,
          variant: "secondary" as const,
        };
      case "Pre-Employment":
        return {
          label: "Pre-Employment",
          status: "warning" as const,
          variant: "secondary" as const,
        };

      // Final states
      case "Hire Driver":
        return {
          label: "Ready to Hire",
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
      case "Not Hired":
        return {
          label: "Not Hired",
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
