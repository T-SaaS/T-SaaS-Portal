import { PageHeader } from "@/atoms/PageHeader";
import { ActionButton } from "@/atoms/ActionButton";
import { InfoCard } from "@/molecules/InfoCard";
import { Company, DriverApplication, Address, Job } from "@/types";
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
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            {application.status === "pending" && (
              <>
                <ActionButton
                  icon={XCircle}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={onReject}
                >
                  Reject
                </ActionButton>
                <ActionButton icon={CheckCircle} onClick={onApprove}>
                  Approve
                </ActionButton>
              </>
            )}
            <ActionButton icon={Pencil} onClick={onEdit}>
              Edit
            </ActionButton>
          </>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        <InfoCard
          title="Application Status"
          icon={FileText}
          fields={statusInfoFields}
        />
      </div>

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
    </div>
  );
}
