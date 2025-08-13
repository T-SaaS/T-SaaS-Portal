import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { StatusBadge } from "@/molecules/StatusBadge";
import { InfoField } from "@/atoms/InfoField";
import { Driver, Company } from "@/types";
import { ArrowLeft, Edit, Download, UserX, UserCheck } from "lucide-react";

export interface DriverDetailsViewProps {
  driver: Driver;
  company?: Company;
  formatDate: (dateString: string) => string;
  isEditing?: boolean;
  onExport?: () => void;
  onTerminate?: () => void;
  onReactivate?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onStatusChange?: () => void;
}

export function DriverDetailsView({
  driver,
  company,
  formatDate,
  isEditing = false,
  onExport,
  onTerminate,
  onReactivate,
  onEdit,
  onSave,
  onCancel,
}: DriverDetailsViewProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/drivers");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Drivers
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {driver.first_name} {driver.last_name}
            </h1>
            <p className="text-slate-600">{driver.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          {driver.status === "active" && onTerminate && (
            <Button variant="destructive" onClick={onTerminate}>
              <UserX className="w-4 h-4 mr-2" />
              Terminate
            </Button>
          )}
          {driver.status !== "active" && onReactivate && (
            <Button variant="default" onClick={onReactivate}>
              <UserCheck className="w-4 h-4 mr-2" />
              Reactivate
            </Button>
          )}
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Driver
            </Button>
          )}
        </div>
      </div>

      {/* Driver Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label="Full Name"
              value={`${driver.first_name} ${driver.last_name}`}
            />
            <InfoField label="Email" value={driver.email} />
            <InfoField label="Phone" value={driver.phone} />
            <InfoField label="Date of Birth" value={formatDate(driver.dob)} />
            <InfoField label="Position" value={driver.position} />
            <InfoField
              label="Status"
              value={<StatusBadge status={driver.status} />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Address Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Address" value={driver.current_address} />
            <InfoField label="City" value={driver.current_city} />
            <InfoField label="State" value={driver.current_state} />
            <InfoField label="ZIP Code" value={driver.current_zip} />
            <InfoField
              label="From Month"
              value={driver.current_address_from_month.toString()}
            />
            <InfoField
              label="From Year"
              value={driver.current_address_from_year.toString()}
            />
          </div>
        </CardContent>
      </Card>

      {/* License Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>License Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="License Number" value={driver.license_number} />
            <InfoField label="License State" value={driver.license_state} />
            <InfoField
              label="License Expiration"
              value={
                driver.license_expiration_date
                  ? formatDate(driver.license_expiration_date)
                  : "N/A"
              }
            />
            <InfoField
              label="Medical Card Expiration"
              value={
                driver.medical_card_expiration_date
                  ? formatDate(driver.medical_card_expiration_date)
                  : "N/A"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Hire Date" value={formatDate(driver.hire_date)} />
            <InfoField
              label="Termination Date"
              value={
                driver.termination_date
                  ? formatDate(driver.termination_date)
                  : "N/A"
              }
            />
            {company && <InfoField label="Company" value={company.name} />}
            <InfoField label="Application ID" value={driver.application_id} />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Card */}
      {(driver.emergency_contact_name || driver.emergency_contact_phone) && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Contact Name"
                value={driver.emergency_contact_name || "N/A"}
              />
              <InfoField
                label="Contact Phone"
                value={driver.emergency_contact_phone || "N/A"}
              />
              <InfoField
                label="Relationship"
                value={driver.emergency_contact_relationship || "N/A"}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Card */}
      {driver.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{driver.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Created" value={formatDate(driver.created_at)} />
            <InfoField
              label="Last Updated"
              value={formatDate(driver.updated_at)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
