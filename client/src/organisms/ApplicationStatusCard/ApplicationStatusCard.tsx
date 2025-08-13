import { StatusCard, StatusCardConfig } from "@/molecules/StatusCard";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { DriverApplication } from "@/types";

export interface ApplicationStatusCardProps {
  application: DriverApplication;
  onStatusTransition: (targetStatus: string) => void;
  onHireDriver: () => void;
  statusNotes: string;
  onStatusNotesChange: (notes: string) => void;
  hireNotes: string;
  onHireNotesChange: (notes: string) => void;
  statusError: string | null;
  statusSuccess: string | null;
  hireError: string | null;
  hireSuccess: string | null;
  loading: boolean;
}

export function ApplicationStatusCard({
  application,
  onStatusTransition,
  onHireDriver,
  statusNotes,
  onStatusNotesChange,
  hireNotes,
  onHireNotesChange,
  statusError,
  statusSuccess,
  hireError,
  hireSuccess,
  loading,
}: ApplicationStatusCardProps) {
  const getStatusCardConfig = (): StatusCardConfig | null => {
    switch (application.status) {
      case "New":
        return {
          title: "Application Submitted",
          description:
            "This application has been submitted and is ready for initial review.",
          icon: "📋",
          color: "blue",
          action: "Review Application",
          actionIcon: "👁️",
          actionVariant: "default",
          showNotes: false,
          onAction: () => onStatusTransition("Under Review"),
        };

      case "Under Review":
        return {
          title: "Under Review",
          description:
            "Application is being reviewed. Check if all required consents are signed.",
          icon: "🔍",
          color: "yellow",
          action: "Complete Review",
          actionIcon: "✅",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("MVR Check"),
        };

      case "On Hold":
        return {
          title: "Application On Hold",
          description:
            "Application is on hold. Review the reason and take appropriate action.",
          icon: "⏸️",
          color: "orange",
          action: "Resume Processing",
          actionIcon: "▶️",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("Under Review"),
        };

      case "MVR Check":
        return {
          title: "Motor Vehicle Record Check",
          description:
            "MVR check is in progress. Update status when results are received.",
          icon: "🚗",
          color: "blue",
          action: "MVR Complete",
          actionIcon: "✅",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("Drug Screening"),
        };

      case "Drug Screening":
        return {
          title: "Drug Screening",
          description:
            "Drug screening is in progress. Update status when results are received.",
          icon: "🧪",
          color: "purple",
          action: "Drug Test Complete",
          actionIcon: "✅",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("PSP Review"),
        };

      case "PSP Review":
        return {
          title: "PSP Review Required",
          description:
            "Pre-Employment Screening Program review is required for this application.",
          icon: "📋",
          color: "indigo",
          action: "PSP Review Complete",
          actionIcon: "✅",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("Background Complete"),
        };

      case "Background Complete":
        return {
          title: "Background Check Complete",
          description:
            "All background checks have been completed. Ready for final approval.",
          icon: "✅",
          color: "green",
          action: "Approve Application",
          actionIcon: "👍",
          actionVariant: "default",
          showNotes: true,
          onAction: () => onStatusTransition("Approved"),
        };

      case "Approved":
        return {
          title: "Ready to Hire",
          description:
            "This application has been approved and is ready to be converted to a driver.",
          icon: "👤",
          color: "green",
          action: "Hire Driver",
          actionIcon: "🎉",
          actionVariant: "default",
          showNotes: true,
          onAction: onHireDriver,
          customContent: (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-green-800">
                  Hire Notes (optional)
                </label>
                <Textarea
                  value={hireNotes}
                  onChange={(e) => onHireNotesChange(e.target.value)}
                  placeholder="Add notes about hiring this driver..."
                  rows={2}
                  className="mt-1 border-green-200 focus:border-green-500"
                />
              </div>

              {/* Error/Success Messages */}
              {hireError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">{hireError}</span>
                </div>
              )}

              {hireSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{hireSuccess}</span>
                </div>
              )}
            </div>
          ),
        };

      case "Rejected":
        return {
          title: "Application Rejected",
          description:
            "This application has been rejected. Review the reason and take appropriate action.",
          icon: "❌",
          color: "red",
          action: "Reconsider",
          actionIcon: "🔄",
          actionVariant: "outline",
          showNotes: true,
          onAction: () => onStatusTransition("Under Review"),
        };

      case "Disqualified":
        return {
          title: "Driver Disqualified",
          description:
            "This driver has been disqualified. Review the reason and take appropriate action.",
          icon: "🚫",
          color: "red",
          action: "Review Decision",
          actionIcon: "📋",
          actionVariant: "outline",
          showNotes: true,
          onAction: () => onStatusTransition("Under Review"),
        };

      default:
        return null;
    }
  };

  const config = getStatusCardConfig();
  if (!config) return null;

  return (
    <StatusCard
      config={config}
      notes={statusNotes}
      onNotesChange={onStatusNotesChange}
      error={statusError}
      success={statusSuccess}
      loading={loading}
    />
  );
}
