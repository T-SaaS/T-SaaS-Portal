import { PageHeader } from "@/atoms/PageHeader";
import { ActionButton } from "@/atoms/ActionButton";
import { InfoCard } from "@/molecules/InfoCard";
import { StatusManagement } from "@/molecules/StatusManagement";
import { Company, DriverApplication, Address, Job } from "@/types";

// Closed statuses that prevent editing
const CLOSED_STATUSES: DriverApplication["status"][] = [
  "Not Hired",
  "Disqualified",
  "Rejected",
  "Expired",
  "Approved",
];
import {
  Download,
  CheckCircle,
  XCircle,
  Pencil,
  Save,
  User,
  Phone,
  FileText,
  MapPin,
  Briefcase,
  Shield,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ApplicationDetailsViewProps {
  application: DriverApplication;
  company: Company;
  formatDate: (dateString: string) => string;
  isEditing?: boolean;
  onExport?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onStatusChange?: () => void;
}

export function ApplicationDetailsView({
  application,
  company,
  formatDate,
  isEditing = false,
  onExport,
  onApprove,
  onReject,
  onEdit,
  onSave,
  onCancel,
  onStatusChange,
}: ApplicationDetailsViewProps) {
  const formatDateRange = (
    fromMonth: number,
    fromYear: number,
    toMonth: number,
    toYear: number
  ) => {
    const fromDate = new Date(fromYear, fromMonth - 1);
    const toDate = new Date(toYear, toMonth - 1);
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })} - ${toDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })}`;
  };

  const getBackgroundCheckStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Utility function to format log changes in a human-readable way
  const formatLogChanges = (changes: Record<string, any>): string => {
    if (!changes || Object.keys(changes).length === 0) return "";

    const formattedChanges: string[] = [];

    // Helper function to format field names
    const formatFieldName = (field: string): string => {
      const fieldMap: Record<string, string> = {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        phone: "Phone",
        status: "Status",
        company_id: "Company",
        address: "Address",
        city: "City",
        state: "State",
        zip_code: "Zip Code",
        license_number: "License Number",
        license_state: "License State",
        license_expiry: "License Expiry",
        medical_card_number: "Medical Card Number",
        medical_card_expiry: "Medical Card Expiry",
        license_photo: "License Photo",
        medical_card_photo: "Medical Card Photo",
        fair_credit_reporting_act_consent_signature: "Credit Report Consent",
        fmcsa_clearinghouse_consent_signature: "FMCSA Consent",
        drug_test_consent_signature: "Drug Test Consent",
        motor_vehicle_record_consent_signature: "MVR Consent",
        general_consent_signature: "General Consent",
        jobs: "Employment History",
        addresses: "Address History",
      };
      return (
        fieldMap[field] ||
        field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
    };

    // Helper function to format complex values
    const formatComplexValue = (value: any): string => {
      if (value === null || value === undefined) return "None";
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (typeof value === "string") return value;
      if (typeof value === "number") return String(value);

      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return "None";
        if (value.length === 1) return "1 item";
        return `${value.length} items`;
      }

      // Handle objects
      if (typeof value === "object") {
        // Check if it's a signature object
        if (value.uploaded !== undefined) {
          return value.uploaded ? "Signed" : "Not signed";
        }

        // Check if it's a photo object
        if (value.url !== undefined) {
          return value.url ? "Uploaded" : "Not uploaded";
        }

        // For other objects, try to get a meaningful description
        const keys = Object.keys(value);
        if (keys.length === 0) return "Empty object";
        if (keys.length <= 3) {
          return keys
            .map((key) => `${key}: ${formatComplexValue(value[key])}`)
            .join(", ");
        }
        return `${keys.length} properties`;
      }

      return String(value);
    };

    Object.entries(changes).forEach(([field, change]) => {
      if (
        change &&
        typeof change === "object" &&
        "from" in change &&
        "to" in change
      ) {
        // Handle from/to format
        const fromValue = formatComplexValue(change.from);
        const toValue = formatComplexValue(change.to);

        formattedChanges.push(
          `${formatFieldName(field)}: ${fromValue} → ${toValue}`
        );
      } else if (
        change &&
        typeof change === "object" &&
        "old_status" in change &&
        "new_status" in change
      ) {
        // Handle status changes
        formattedChanges.push(
          `Status: ${change.old_status} → ${change.new_status}`
        );
      } else {
        // Handle simple value changes
        const value = formatComplexValue(change);
        formattedChanges.push(`${formatFieldName(field)}: ${value}`);
      }
    });

    return formattedChanges.join(", ");
  };

  // Utility function to format log metadata in a human-readable way
  const formatLogMetadata = (metadata: Record<string, any>): string => {
    if (!metadata || Object.keys(metadata).length === 0) return "";

    const formattedMetadata: string[] = [];

    // Handle other relevant fields (excluding reason since it's displayed separately)
    const relevantFields = ["ip_address", "user_agent", "device_info"];
    relevantFields.forEach((field) => {
      if (metadata[field]) {
        if (field === "device_info" && typeof metadata[field] === "object") {
          const device = metadata[field];
          if (device.deviceType) {
            formattedMetadata.push(`via ${device.deviceType}`);
          }
        } else if (field === "ip_address") {
          formattedMetadata.push(`IP: ${metadata[field]}`);
        } else if (field === "user_agent") {
          // Extract browser info from user agent
          const ua = metadata[field];
          if (ua.includes("Chrome")) formattedMetadata.push("Chrome");
          else if (ua.includes("Firefox")) formattedMetadata.push("Firefox");
          else if (ua.includes("Safari")) formattedMetadata.push("Safari");
          else if (ua.includes("Edge")) formattedMetadata.push("Edge");
          else formattedMetadata.push("unknown browser");
        }
      }
    });

    return formattedMetadata.join(", ");
  };

  const personalInfoFields = [
    {
      label: "Full Name",
      value: `${application.first_name} ${application.last_name}`,
    },
    {
      label: "Date of Birth",
      value: application.dob ? formatDate(application.dob) : "N/A",
    },
    {
      label: "Position Applied For",
      value: application.position_applied_for || "N/A",
    },
    {
      label: "Application ID",
      value: application.id,
    },
  ];

  const contactInfoFields = [
    {
      label: "Email",
      value: application.email,
    },
    {
      label: "Phone",
      value: application.phone,
    },
    {
      label: "Company",
      value: company?.name || "N/A",
    },
  ];

  const statusInfoFields = [
    {
      label: "Status",
      value: application.status,
    },
    {
      label: "Submitted",
      value: formatDate(application.submitted_at),
    },
    {
      label: "Background Check",
      value: application.background_check_status || "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Details"
        description="View and manage driver application"
      >
        {isEditing ? (
          <>
            <ActionButton icon={Save} onClick={onSave}>
              Save Changes
            </ActionButton>
            <ActionButton icon={XCircle} variant="outline" onClick={onCancel}>
              Cancel
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton icon={Download} variant="outline" onClick={onExport}>
              Export
            </ActionButton>
            {!CLOSED_STATUSES.includes(application.status) && (
              <ActionButton icon={Pencil} onClick={onEdit}>
                Edit
              </ActionButton>
            )}
          </>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard
          title="Personal Information"
          icon={User}
          fields={personalInfoFields}
        />
        <InfoCard
          title="Contact Information"
          icon={Phone}
          fields={contactInfoFields}
        />
      </div>

      {/* Status Management */}
      <StatusManagement
        application={application}
        onStatusChange={onStatusChange || (() => {})}
      />

      {/* Current Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Address
              </label>
              <p className="text-slate-900">{application.current_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                City, State, ZIP
              </label>
              <p className="text-slate-900">
                {application.current_city}, {application.current_state}{" "}
                {application.current_zip}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Resident Since
              </label>
              <p className="text-slate-900">
                {formatDateRange(
                  application.current_address_from_month,
                  application.current_address_from_year,
                  new Date().getMonth() + 1,
                  new Date().getFullYear()
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            License Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                License Number
              </label>
              <p className="text-slate-900 font-mono">
                {application.license_number}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                License State
              </label>
              <p className="text-slate-900">{application.license_state}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                License Expiration Date
              </label>
              <p className="text-slate-900">
                {application.license_expiration_date
                  ? formatDate(application.license_expiration_date)
                  : "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Medical Card Expiration Date
              </label>
              <p className="text-slate-900">
                {application.medical_card_expiration_date
                  ? formatDate(application.medical_card_expiration_date)
                  : "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Photos */}
      {(application.license_photo || application.medical_card_photo) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {application.license_photo && application.license_photo.url && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Driver's License Photo
                  </label>
                  <div className="relative">
                    <img
                      src={application.license_photo.url}
                      alt="Driver's License"
                      className="w-full h-48 object-contain rounded-md border"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = application.license_photo!.url!;
                          link.download = `license-photo-${application.id}.png`;
                          link.click();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {application.medical_card_photo &&
                application.medical_card_photo.url && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Medical Card Photo
                    </label>
                    <div className="relative">
                      <img
                        src={application.medical_card_photo.url}
                        alt="Medical Card"
                        className="w-full h-48 object-contain rounded-md border"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = application.medical_card_photo!.url!;
                            link.download = `medical-card-photo-${application.id}.png`;
                            link.click();
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address History */}
      {application.addresses && application.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.addresses.map((address: Address, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Address
                      </label>
                      <p className="text-slate-900">{address.address}</p>
                      <p className="text-slate-600 text-sm">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Residence Period
                      </label>
                      <p className="text-slate-900">
                        {formatDateRange(
                          address.fromMonth,
                          address.fromYear,
                          address.toMonth,
                          address.toYear
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employment History */}
      {application.jobs && application.jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.jobs.map((job: Job, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Employer
                      </label>
                      <p className="text-slate-900">{job.employerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Position
                      </label>
                      <p className="text-slate-900">{job.positionHeld}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Employment Period
                      </label>
                      <p className="text-slate-900">
                        {formatDateRange(
                          job.fromMonth,
                          job.fromYear,
                          job.toMonth,
                          job.toYear
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Company Email
                      </label>
                      <p className="text-slate-900">
                        {job.companyEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Background Check Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Background Check Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  className={getBackgroundCheckStatusColor(
                    application.background_check_status || "pending"
                  )}
                >
                  {application.background_check_status || "Pending"}
                </Badge>
              </div>
            </div>
            {application.background_check_completed_at && (
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Completed At
                </label>
                <p className="text-slate-900">
                  {formatDate(application.background_check_completed_at)}
                </p>
              </div>
            )}
          </div>

          {application.background_check_results && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-slate-900 mb-2">
                Background Check Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Criminal History:</span>
                  <span
                    className={`ml-2 ${
                      application.background_check_results.criminalHistory
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {application.background_check_results.criminalHistory
                      ? "Found"
                      : "Clear"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Driving Record Score:</span>
                  <span className="ml-2 text-slate-900">
                    {application.background_check_results.drivingRecord
                      ?.overallScore || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Employment Verified:</span>
                  <span
                    className={`ml-2 ${
                      application.background_check_results
                        .employmentVerification?.verified
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {application.background_check_results.employmentVerification
                      ?.verified
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Drug Test Status:</span>
                  <span className="ml-2 text-slate-900">
                    {application.background_check_results.drugTest?.status ||
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Signatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overall signature timestamp */}
          {(() => {
            // Find the earliest signature timestamp
            const signatures = [
              application.fair_credit_reporting_act_consent_signature,
              application.fmcsa_clearinghouse_consent_signature,
              application.motor_vehicle_record_consent_signature,
              application.drug_test_consent_signature,
              application.general_consent_signature,
            ];

            const timestamps = signatures
              .map((sig) => sig?.timestamp)
              .filter(Boolean)
              .sort();

            const earliestTimestamp = timestamps[0];

            return earliestTimestamp ? (
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Application Signed At
                </label>
                <p className="text-slate-900">
                  {formatDate(earliestTimestamp)}
                </p>
              </div>
            ) : null;
          })()}

          {/* Consent Status */}
          <div className="mb-4">
            <h4 className="font-medium text-slate-900 mb-2">Consent Status</h4>
            <div className="space-y-2">
              {[
                {
                  type: "Fair Credit Reporting Act Consent",
                  consent: application.fair_credit_reporting_act_consent,
                  signature:
                    application.fair_credit_reporting_act_consent_signature,
                },
                {
                  type: "FMCSA Clearinghouse Consent",
                  consent: application.fmcsa_clearinghouse_consent,
                  signature: application.fmcsa_clearinghouse_consent_signature,
                },
                {
                  type: "Motor Vehicle Record Consent",
                  consent: application.motor_vehicle_record_consent,
                  signature: application.motor_vehicle_record_consent_signature,
                },
                {
                  type: "Drug/Alcohol Testing Consent",
                  consent: application.drug_test_consent,
                  signature: application.drug_test_consent_signature,
                },
                {
                  type: "General Application Consent",
                  consent: application.general_consent,
                  signature: application.general_consent_signature,
                },
              ].map((item, index) => {
                const hasConsent = item.consent === true;
                const hasSignature = item.signature && item.signature.uploaded;
                return (
                  <div key={index} className="flex items-center gap-3">
                    {hasConsent && hasSignature ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-slate-900">{item.type}</span>
                    {hasConsent && !hasSignature && (
                      <span className="text-xs text-yellow-600">
                        (Consent given, signature pending)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drug Test Question */}
          {application.drug_test_question && (
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700">
                Drug Test Question Response
              </label>
              <p className="text-slate-900 capitalize">
                {application.drug_test_question}
              </p>
            </div>
          )}

          {/* Device Type and IP Address */}
          {(application.device_info || application.ip_address) && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-slate-900 mb-4">
                Device Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.device_info && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Device Type
                    </label>
                    <div className="flex items-center gap-2">
                      {application.device_info.deviceType === "mobile" && (
                        <Smartphone className="h-4 w-4 text-slate-600" />
                      )}
                      {application.device_info.deviceType === "tablet" && (
                        <Tablet className="h-4 w-4 text-slate-600" />
                      )}
                      {application.device_info.deviceType === "desktop" && (
                        <Monitor className="h-4 w-4 text-slate-600" />
                      )}
                      <span className="text-slate-900 capitalize">
                        {application.device_info.deviceType}
                      </span>
                    </div>
                  </div>
                )}

                {application.ip_address && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      IP Address
                    </label>
                    <p className="text-slate-900 font-mono text-xs">
                      {application.ip_address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Logs */}
      {application.logs && application.logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
              <FileText className="h-4 w-4" />
              Application Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {application.logs
                .slice()
                .reverse()
                .map((log, index) => (
                  <div key={index} className="text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-wide font-medium">
                        {formatDate(log.created_at)}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="capitalize">{log.action}</span>
                      {log.user_email && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="font-medium text-slate-600">
                            by {log.user_email}
                          </span>
                        </>
                      )}
                      {!log.user_email && (
                        <span className="text-slate-400 text-xs">
                          (unknown user)
                        </span>
                      )}
                    </div>
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-1 ml-4 text-slate-400">
                        {formatLogChanges(log.changes)}
                      </div>
                    )}
                    {log.metadata && log.metadata.reason && (
                      <div className="mt-1 ml-4 text-slate-600 text-xs font-medium">
                        Notes: "{log.metadata.reason}"
                      </div>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-1 ml-4 text-slate-400 text-xs">
                        {formatLogMetadata(log.metadata)}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
