import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { InfoField } from "@/atoms/InfoField";
import { Badge } from "@/atoms/Badge";
import { Company } from "@/types";
import { Edit, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface CompanyDetailsViewProps {
  company: Company;
  formatDate: (dateString: string) => string;
  isEditing?: boolean;
  onExport?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function CompanyDetailsView({
  company,
  formatDate,
  isEditing = false,
  onExport,
  onEdit,
  onSave,
  onCancel,
}: CompanyDetailsViewProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/companies");
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
            Back to Companies
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {company.name}
            </h1>
            <p className="text-slate-600">Company Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
          {!isEditing && onEdit && (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Company
            </Button>
          )}
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onSave}>Save Changes</Button>
            </div>
          )}
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Company Name" value={company.name} />
            <InfoField label="Slug" value={company.slug} />
            <InfoField
              label="Domain"
              value={company.domain || "No domain configured"}
            />
            <InfoField label="Created" value={formatDate(company.created_at)} />
            <InfoField
              label="Last Updated"
              value={formatDate(company.updated_at)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">External Applications</span>
              <Badge
                variant={
                  company.settings?.allowExternalApplications
                    ? "default"
                    : "secondary"
                }
              >
                {company.settings?.allowExternalApplications
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Background Check Required
              </span>
              <Badge
                variant={
                  company.settings?.requireBackgroundCheck
                    ? "default"
                    : "secondary"
                }
              >
                {company.settings?.requireBackgroundCheck
                  ? "Required"
                  : "Optional"}
              </Badge>
            </div>
            {company.settings?.supportEmail && (
              <InfoField
                label="Support Email"
                value={company.settings.supportEmail}
              />
            )}
          </div>

          {company.settings?.welcomeMessage && (
            <div className="mt-4">
              <InfoField
                label="Welcome Message"
                value={company.settings.welcomeMessage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Fields */}
      {company.settings?.customFields &&
        Object.keys(company.settings.customFields).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(company.settings.customFields).map(
                  ([key, value]) => (
                    <InfoField key={key} label={key} value={String(value)} />
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
