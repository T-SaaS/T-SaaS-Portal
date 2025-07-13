import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { StatusBadge } from "@/molecules/StatusBadge";
import {
  CheckCircle,
  Download,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
  Shield,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
} from "lucide-react";
import { DriverApplication, Address } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";

interface ApplicationDetailsProps {
  application: DriverApplication;
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Application Details
          </h1>
          <p className="text-slate-600 mt-2">
            View and manage driver application
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {application.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <p className="text-slate-900 font-medium">
                {application.first_name} {application.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Date of Birth
              </label>
              <p className="text-slate-900">{formatDate(application.dob)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Position Applied For
              </label>
              <p className="text-slate-900">
                {application.position_applied_for}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Application ID
              </label>
              <p className="text-slate-900 font-mono text-sm">
                {application.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <p className="text-slate-900">{application.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <p className="text-slate-900">{application.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Company ID
              </label>
              <p className="text-slate-900">{application.company_id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <div className="mt-1">
                <StatusBadge status={application.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Submitted
              </label>
              <p className="text-slate-900">
                {formatDate(application.submitted_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Background Check
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
          </CardContent>
        </Card>
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
              {application.jobs.map((job, index) => (
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
                Consent Given
              </label>
              <p className="text-slate-900">
                {application.consent_to_background_check === 1 ? "Yes" : "No"}
              </p>
            </div>
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
    </div>
  );
}
