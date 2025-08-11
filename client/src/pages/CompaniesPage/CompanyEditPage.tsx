import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { Input } from "@/atoms/Input";
import { Label } from "@/atoms/Label";
import { useCompany } from "@/hooks/useCompany";
import { useToast } from "@/hooks/use-toast";
import { CompanyNotFound } from "./CompanyNotFound";
import { ArrowLeft, Save } from "lucide-react";
import { Company } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export function CompanyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    slug: "",
    domain: "",
    settings: {
      allowExternalApplications: false,
      requireBackgroundCheck: false,
      customFields: {},
      supportEmail: "",
      welcomeMessage: "",
    },
  });

  // Fetch the company to edit
  const { company: companyData, isLoading: companyLoading } = useCompany({
    companyId: id || "",
  });

  // Load company data into form when available
  useEffect(() => {
    if (companyData && !companyLoading) {
      setFormData({
        name: companyData.name || "",
        slug: companyData.slug || "",
        domain: companyData.domain || "",
        settings: {
          allowExternalApplications:
            companyData.settings?.allowExternalApplications || false,
          requireBackgroundCheck:
            companyData.settings?.requireBackgroundCheck || false,
          customFields: companyData.settings?.customFields || {},
          supportEmail: companyData.settings?.supportEmail || "",
          welcomeMessage: companyData.settings?.welcomeMessage || "",
        },
      });
    }
  }, [companyData, companyLoading]);

  const handleInputChange = (field: keyof Company, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsChange = (
    field: keyof Company["settings"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        allowExternalApplications:
          prev.settings?.allowExternalApplications || false,
        requireBackgroundCheck: prev.settings?.requireBackgroundCheck || false,
        customFields: prev.settings?.customFields || {},
        supportEmail: prev.settings?.supportEmail || "",
        welcomeMessage: prev.settings?.welcomeMessage || "",
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest(
        "PUT",
        `/api/v1/companies/${encodeURIComponent(id!)}`,
        {
          name: formData.name,
          slug: formData.slug,
          domain: formData.domain,
          settings: formData.settings,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update company");
      }

      toast({
        title: "Success",
        description: "Company updated successfully",
      });

      // Navigate back to company details
      navigate(`/companies/${id}`);
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update company",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/companies/${id}`);
  };

  // Handle loading state
  if (companyLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Loading Company...
        </h2>
      </div>
    );
  }

  // Handle not found state
  if (!companyData) {
    return <CompanyNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Company
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Company</h1>
            <p className="text-slate-600">
              Update company information and settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit({} as React.FormEvent)}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain || ""}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  placeholder="example.com"
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.settings?.supportEmail || ""}
                  onChange={(e) =>
                    handleSettingsChange("supportEmail", e.target.value)
                  }
                  placeholder="support@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <textarea
                id="welcomeMessage"
                value={formData.settings?.welcomeMessage || ""}
                onChange={(e) =>
                  handleSettingsChange("welcomeMessage", e.target.value)
                }
                className="w-full min-h-[100px] p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Welcome message for new applicants..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowExternalApplications"
                  checked={
                    formData.settings?.allowExternalApplications || false
                  }
                  onChange={(e) =>
                    handleSettingsChange(
                      "allowExternalApplications",
                      e.target.checked
                    )
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="allowExternalApplications">
                  Allow External Applications
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireBackgroundCheck"
                  checked={formData.settings?.requireBackgroundCheck || false}
                  onChange={(e) =>
                    handleSettingsChange(
                      "requireBackgroundCheck",
                      e.target.checked
                    )
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="requireBackgroundCheck">
                  Require Background Check
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
