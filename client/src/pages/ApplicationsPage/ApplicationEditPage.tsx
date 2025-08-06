import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { Input } from "@/atoms/Input";
import { Label } from "@/atoms/Label";
import { useDriverApplication } from "@/hooks/useDriverApplications";
import { useToast } from "@/hooks/use-toast";
import { ApplicationNotFound } from "./ApplicationNotFound";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { DriverApplication } from "@/types";
import { Address, Job } from "@shared/schema";

export function ApplicationEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<DriverApplication>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    position_applied_for: "",
    current_address: "",
    current_city: "",
    current_state: "",
    current_zip: "",
    current_address_from_month: 1,
    current_address_from_year: new Date().getFullYear(),
    license_number: "",
    license_state: "",
    license_expiration_date: "",
    medical_card_expiration_date: "",
    social_security_number: "",
    background_check_completed_at: "",
    addresses: [],
    jobs: [],
    company_id: "",
    status: "",
    submitted_at: "",
    background_check_status: "",
    background_check_results: undefined,
    fair_credit_reporting_act_consent: false,
    fmcsa_clearinghouse_consent: false,
    motor_vehicle_record_consent: false,
    drug_test_consent: false,
    drug_test_question: "",
    general_consent: false,
    fair_credit_reporting_act_consent_signature: undefined,
    fmcsa_clearinghouse_consent_signature: undefined,
    motor_vehicle_record_consent_signature: undefined,
    drug_test_consent_signature: undefined,
    general_consent_signature: undefined,
    license_photo: undefined,
    medical_card_photo: undefined,
    device_info: undefined,
    ip_address: "",
  });

  // Fetch the application to edit
  const { application: applicationData, loading: applicationLoading } =
    useDriverApplication(id || "");

  // Load application data into form when available
  useEffect(() => {
    if (applicationData && !applicationLoading) {
      setFormData({
        first_name: applicationData.first_name || "",
        last_name: applicationData.last_name || "",
        email: applicationData.email || "",
        phone: applicationData.phone || "",
        dob: applicationData.dob || "",
        position_applied_for: applicationData.position_applied_for || "",
        current_address: applicationData.current_address || "",
        current_city: applicationData.current_city || "",
        current_state: applicationData.current_state || "",
        current_zip: applicationData.current_zip || "",
        current_address_from_month:
          applicationData.current_address_from_month || 1,
        current_address_from_year:
          applicationData.current_address_from_year || new Date().getFullYear(),
        license_number: applicationData.license_number || "",
        license_state: applicationData.license_state || "",
        license_expiration_date: applicationData.license_expiration_date || "",
        medical_card_expiration_date:
          applicationData.medical_card_expiration_date || "",
        social_security_number: applicationData.social_security_number || "",
        consent_to_background_check:
          applicationData.consent_to_background_check,
        // Load employment and address history
        jobs: applicationData.jobs || [],
        addresses: applicationData.addresses || [],
        // Load missing fields
        company_id: applicationData.company_id?.toString() || "",
        status: applicationData.status || "",
        submitted_at: applicationData.submitted_at || "",
        background_check_completed_at:
          applicationData.background_check_completed_at || "",
        // Load new consent fields
        fair_credit_reporting_act_consent:
          applicationData.fair_credit_reporting_act_consent || false,
        fmcsa_clearinghouse_consent:
          applicationData.fmcsa_clearinghouse_consent || false,
        motor_vehicle_record_consent:
          applicationData.motor_vehicle_record_consent || false,
        drug_test_consent: applicationData.drug_test_consent || false,
        drug_test_question: applicationData.drug_test_question || "",
        general_consent: applicationData.general_consent || false,
        // Load new signature fields
        fair_credit_reporting_act_consent_signature:
          applicationData.fair_credit_reporting_act_consent_signature,
        fmcsa_clearinghouse_consent_signature:
          applicationData.fmcsa_clearinghouse_consent_signature,
        motor_vehicle_record_consent_signature:
          applicationData.motor_vehicle_record_consent_signature,
        drug_test_consent_signature:
          applicationData.drug_test_consent_signature,
        general_consent_signature: applicationData.general_consent_signature,
        // Load document photo fields
        license_photo: applicationData.license_photo,
        medical_card_photo: applicationData.medical_card_photo,
        // Load device info fields
        device_info: applicationData.device_info,
        ip_address: applicationData.ip_address || "",
      });
    }
  }, [applicationData, applicationLoading]);

  const handleInputChange = (
    field: keyof DriverApplication,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Job management functions
  const addJob = () => {
    const newJob: Job = {
      employerName: "",
      positionHeld: "",
      fromMonth: 1,
      fromYear: new Date().getFullYear(),
      toMonth: 12,
      toYear: new Date().getFullYear(),
      companyEmail: "",
    };
    setFormData((prev) => ({
      ...prev,
      jobs: [...(prev.jobs || []), newJob],
    }));
  };

  const removeJob = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      jobs: prev.jobs?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateJob = (
    index: number,
    field: keyof Job,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      jobs:
        prev.jobs?.map((job, i) =>
          i === index ? { ...job, [field]: value } : job
        ) || [],
    }));
  };

  // Address management functions
  const addAddress = () => {
    const newAddress: Address = {
      address: "",
      city: "",
      state: "",
      zip: "",
      fromMonth: 1,
      fromYear: new Date().getFullYear(),
      toMonth: new Date().getMonth() + 1,
      toYear: new Date().getFullYear(),
    };
    setFormData((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), newAddress],
    }));
  };

  const removeAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateAddress = (
    index: number,
    field: keyof Address,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      addresses:
        prev.addresses?.map((address, i) =>
          i === index ? { ...address, [field]: value } : address
        ) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // The server expects ALL fields from insertDriverApplicationSchema
      // We need to send a complete object with the current application data
      const serverData = {
        // Required fields from insertDriverApplicationSchema
        company_id: applicationData?.company_id?.toString() || "",
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        dob: formData.dob || "",
        phone: formData.phone || "",
        email: formData.email || "",
        current_address: formData.current_address || "",
        current_city: formData.current_city || "",
        current_state: formData.current_state || "",
        current_zip: formData.current_zip || "",
        current_address_from_month: formData.current_address_from_month || 1,
        current_address_from_year:
          formData.current_address_from_year || new Date().getFullYear(),
        license_number: formData.license_number || "",
        license_state: formData.license_state || "",
        license_expiration_date: formData.license_expiration_date || "",
        medical_card_expiration_date:
          formData.medical_card_expiration_date || "",
        position_applied_for: formData.position_applied_for || "",
        addresses: formData.addresses || [],
        jobs: formData.jobs || [],
        social_security_number:
          formData.social_security_number || "000-00-0000",
        consent_to_background_check:
          formData.consent_to_background_check || false,
        // New consent fields
        fair_credit_reporting_act_consent:
          formData.fair_credit_reporting_act_consent || false,
        fmcsa_clearinghouse_consent:
          formData.fmcsa_clearinghouse_consent || false,
        motor_vehicle_record_consent:
          formData.motor_vehicle_record_consent || false,
        drug_test_consent: formData.drug_test_consent || false,
        drug_test_question: formData.drug_test_question || "",
        general_consent: formData.general_consent || false,
        // Status fields
        status: formData.status || "",
        background_check_status: formData.background_check_status || "",
        background_check_completed_at:
          formData.background_check_completed_at || "",
      };

      console.log("Sending update data:", serverData);

      const response = await fetch(`/api/v1/driver-applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      toast({
        title: "Success",
        description: "Application updated successfully",
      });

      navigate(`/applications/${id}`);
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/applications/${id}`);
  };

  // Handle loading state
  if (applicationLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Loading Application...
        </h2>
      </div>
    );
  }

  // Handle not found state
  if (!applicationData) {
    return <ApplicationNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Edit Application
            </h1>
            <p className="text-slate-600 mt-2">
              Update driver application information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position_applied_for">
                  Position Applied For *
                </Label>
                <Input
                  id="position_applied_for"
                  value={formData.position_applied_for}
                  onChange={(e) =>
                    handleInputChange("position_applied_for", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Address */}
        <Card>
          <CardHeader>
            <CardTitle>Current Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_address">Address *</Label>
              <Input
                id="current_address"
                value={formData.current_address}
                onChange={(e) =>
                  handleInputChange("current_address", e.target.value)
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="current_city">City *</Label>
                <Input
                  id="current_city"
                  value={formData.current_city}
                  onChange={(e) =>
                    handleInputChange("current_city", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="current_state">State *</Label>
                <Input
                  id="current_state"
                  value={formData.current_state}
                  onChange={(e) =>
                    handleInputChange("current_state", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="current_zip">ZIP Code *</Label>
                <Input
                  id="current_zip"
                  value={formData.current_zip}
                  onChange={(e) =>
                    handleInputChange("current_zip", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_address_from_month">
                  Month Moved In *
                </Label>
                <select
                  id="current_address_from_month"
                  value={formData.current_address_from_month}
                  onChange={(e) =>
                    handleInputChange(
                      "current_address_from_month",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="current_address_from_year">
                  Year Moved In *
                </Label>
                <select
                  id="current_address_from_year"
                  value={formData.current_address_from_year}
                  onChange={(e) =>
                    handleInputChange(
                      "current_address_from_year",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                  required
                >
                  {Array.from(
                    { length: 30 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Information */}
        <Card>
          <CardHeader>
            <CardTitle>License Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) =>
                    handleInputChange("license_number", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="license_state">License State *</Label>
                <Input
                  id="license_state"
                  value={formData.license_state}
                  onChange={(e) =>
                    handleInputChange("license_state", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="license_expiration_date">
                  License Expiration Date
                </Label>
                <Input
                  id="license_expiration_date"
                  type="date"
                  value={formData.license_expiration_date}
                  onChange={(e) =>
                    handleInputChange("license_expiration_date", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="medical_card_expiration_date">
                  Medical Card Expiration Date
                </Label>
                <Input
                  id="medical_card_expiration_date"
                  type="date"
                  value={formData.medical_card_expiration_date}
                  onChange={(e) =>
                    handleInputChange(
                      "medical_card_expiration_date",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <div>
                <Label htmlFor="submitted_at">Submitted At</Label>
                <Input
                  id="submitted_at"
                  type="datetime-local"
                  value={formData.submitted_at || ""}
                  onChange={(e) =>
                    handleInputChange("submitted_at", e.target.value)
                  }
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Check */}
        <Card>
          <CardHeader>
            <CardTitle>Background Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_security_number">
                Social Security Number
              </Label>
              <Input
                id="social_security_number"
                value={formData.social_security_number}
                onChange={(e) =>
                  handleInputChange("social_security_number", e.target.value)
                }
                placeholder="000-00-0000"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="consent_to_background_check"
                type="checkbox"
                checked={formData.consent_to_background_check || false}
                onChange={(e) =>
                  handleInputChange(
                    "consent_to_background_check",
                    e.target.checked ? 1 : 0
                  )
                }
                className="rounded border-slate-300"
              />
              <Label htmlFor="consent_to_background_check">
                I consent to a background check
              </Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="background_check_status">
                  Background Check Status
                </Label>
                <select
                  id="background_check_status"
                  value={formData.background_check_status || ""}
                  onChange={(e) =>
                    handleInputChange("background_check_status", e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="background_check_completed_at">
                  Background Check Completed At
                </Label>
                <Input
                  id="background_check_completed_at"
                  type="datetime-local"
                  value={formData.background_check_completed_at || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "background_check_completed_at",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <CardTitle>Consent Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="fair_credit_reporting_act_consent"
                  type="checkbox"
                  checked={formData.fair_credit_reporting_act_consent || false}
                  onChange={(e) =>
                    handleInputChange(
                      "fair_credit_reporting_act_consent",
                      e.target.checked
                    )
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="fair_credit_reporting_act_consent">
                  Fair Credit Reporting Act Consent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="fmcsa_clearinghouse_consent"
                  type="checkbox"
                  checked={formData.fmcsa_clearinghouse_consent || false}
                  onChange={(e) =>
                    handleInputChange(
                      "fmcsa_clearinghouse_consent",
                      e.target.checked
                    )
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="fmcsa_clearinghouse_consent">
                  FMCSA Clearinghouse Consent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="motor_vehicle_record_consent"
                  type="checkbox"
                  checked={formData.motor_vehicle_record_consent || false}
                  onChange={(e) =>
                    handleInputChange(
                      "motor_vehicle_record_consent",
                      e.target.checked
                    )
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="motor_vehicle_record_consent">
                  Motor Vehicle Record Consent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="drug_test_consent"
                  type="checkbox"
                  checked={formData.drug_test_consent || false}
                  onChange={(e) =>
                    handleInputChange("drug_test_consent", e.target.checked)
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="drug_test_consent">
                  Drug/Alcohol Testing Consent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="general_consent"
                  type="checkbox"
                  checked={formData.general_consent || false}
                  onChange={(e) =>
                    handleInputChange("general_consent", e.target.checked)
                  }
                  className="rounded border-slate-300"
                />
                <Label htmlFor="general_consent">
                  General Application Consent
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="drug_test_question">
                Drug Test Question Response
              </Label>
              <select
                id="drug_test_question"
                value={formData.drug_test_question || ""}
                onChange={(e) =>
                  handleInputChange("drug_test_question", e.target.value)
                }
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              >
                <option value="">Select response</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Employment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employment History</CardTitle>
              <Button
                type="button"
                onClick={addJob}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.jobs && formData.jobs.length > 0 ? (
              formData.jobs.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">
                      Job {index + 1}
                    </h4>
                    {formData.jobs && formData.jobs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeJob(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Employer Name *</Label>
                      <Input
                        value={job.employerName}
                        onChange={(e) =>
                          updateJob(index, "employerName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Position Held *</Label>
                      <Input
                        value={job.positionHeld}
                        onChange={(e) =>
                          updateJob(index, "positionHeld", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Company Email</Label>
                      <Input
                        type="email"
                        value={job.companyEmail || ""}
                        onChange={(e) =>
                          updateJob(index, "companyEmail", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>From Month *</Label>
                      <select
                        value={job.fromMonth}
                        onChange={(e) =>
                          updateJob(
                            index,
                            "fromMonth",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {new Date(2000, month - 1).toLocaleDateString(
                                "en-US",
                                { month: "long" }
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <Label>From Year *</Label>
                      <select
                        value={job.fromYear}
                        onChange={(e) =>
                          updateJob(index, "fromYear", parseInt(e.target.value))
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from(
                          { length: 30 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>To Month *</Label>
                      <select
                        value={job.toMonth}
                        onChange={(e) =>
                          updateJob(index, "toMonth", parseInt(e.target.value))
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {new Date(2000, month - 1).toLocaleDateString(
                                "en-US",
                                { month: "long" }
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <Label>To Year *</Label>
                      <select
                        value={job.toYear}
                        onChange={(e) =>
                          updateJob(index, "toYear", parseInt(e.target.value))
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from(
                          { length: 30 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">
                No jobs added yet. Click "Add Job" to get started.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Address History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Address History</CardTitle>
              <Button
                type="button"
                onClick={addAddress}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.addresses && formData.addresses.length > 0 ? (
              formData.addresses.map((address, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">
                      Address {index + 1}
                    </h4>
                    {formData.addresses && formData.addresses.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddress(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Address *</Label>
                      <Input
                        value={address.address}
                        onChange={(e) =>
                          updateAddress(index, "address", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={address.city}
                        onChange={(e) =>
                          updateAddress(index, "city", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>State *</Label>
                      <Input
                        value={address.state}
                        onChange={(e) =>
                          updateAddress(index, "state", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>ZIP Code *</Label>
                      <Input
                        value={address.zip}
                        onChange={(e) =>
                          updateAddress(index, "zip", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>From Month *</Label>
                      <select
                        value={address.fromMonth}
                        onChange={(e) =>
                          updateAddress(
                            index,
                            "fromMonth",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {new Date(2000, month - 1).toLocaleDateString(
                                "en-US",
                                { month: "long" }
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <Label>From Year *</Label>
                      <select
                        value={address.fromYear}
                        onChange={(e) =>
                          updateAddress(
                            index,
                            "fromYear",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from(
                          { length: 30 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>To Month *</Label>
                      <select
                        value={address.toMonth}
                        onChange={(e) =>
                          updateAddress(
                            index,
                            "toMonth",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {new Date(2000, month - 1).toLocaleDateString(
                                "en-US",
                                { month: "long" }
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <Label>To Year *</Label>
                      <select
                        value={address.toYear}
                        onChange={(e) =>
                          updateAddress(
                            index,
                            "toYear",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2"
                        required
                      >
                        {Array.from(
                          { length: 30 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">
                No addresses added yet. Click "Add Address" to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
