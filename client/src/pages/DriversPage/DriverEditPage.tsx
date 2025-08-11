import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/atoms/Button";
import { Input } from "@/atoms/Input";
import { Label } from "@/atoms/Label";
import { useDriver } from "@/hooks/useDrivers";
import { useToast } from "@/hooks/use-toast";
import { DriverNotFound } from "./DriverNotFound";
import { ArrowLeft, Save } from "lucide-react";
import { Driver } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export function DriverEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Driver>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    position: "",
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
    hire_date: "",
    termination_date: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    notes: "",
  });

  // Fetch the driver to edit
  const { driver: driverData, loading: driverLoading } = useDriver(id || "");

  // Load driver data into form when available
  useEffect(() => {
    if (driverData && !driverLoading) {
      setFormData({
        first_name: driverData.first_name || "",
        last_name: driverData.last_name || "",
        email: driverData.email || "",
        phone: driverData.phone || "",
        dob: driverData.dob || "",
        position: driverData.position || "",
        current_address: driverData.current_address || "",
        current_city: driverData.current_city || "",
        current_state: driverData.current_state || "",
        current_zip: driverData.current_zip || "",
        current_address_from_month: driverData.current_address_from_month || 1,
        current_address_from_year:
          driverData.current_address_from_year || new Date().getFullYear(),
        license_number: driverData.license_number || "",
        license_state: driverData.license_state || "",
        license_expiration_date: driverData.license_expiration_date || "",
        medical_card_expiration_date:
          driverData.medical_card_expiration_date || "",
        hire_date: driverData.hire_date || "",
        termination_date: driverData.termination_date || "",
        emergency_contact_name: driverData.emergency_contact_name || "",
        emergency_contact_phone: driverData.emergency_contact_phone || "",
        emergency_contact_relationship:
          driverData.emergency_contact_relationship || "",
        notes: driverData.notes || "",
      });
    }
  }, [driverData, driverLoading]);

  const handleInputChange = (field: keyof Driver, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest(
        "PUT",
        `/api/v1/drivers/${encodeURIComponent(id!)}`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          position: formData.position,
          current_address: formData.current_address,
          current_city: formData.current_city,
          current_state: formData.current_state,
          current_zip: formData.current_zip,
          current_address_from_month: formData.current_address_from_month,
          current_address_from_year: formData.current_address_from_year,
          license_number: formData.license_number,
          license_state: formData.license_state,
          license_expiration_date: formData.license_expiration_date,
          medical_card_expiration_date: formData.medical_card_expiration_date,
          hire_date: formData.hire_date,
          termination_date: formData.termination_date,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          emergency_contact_relationship:
            formData.emergency_contact_relationship,
          notes: formData.notes,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update driver");
      }

      toast({
        title: "Success",
        description: "Driver updated successfully",
      });

      // Navigate back to driver details
      navigate(`/drivers/${id}`);
    } catch (error) {
      console.error("Error updating driver:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update driver",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/drivers/${id}`);
  };

  // Handle loading state
  if (driverLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Loading Driver...</h2>
      </div>
    );
  }

  // Handle not found state
  if (!driverData) {
    return <DriverNotFound />;
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
            Back to Driver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Driver</h1>
            <p className="text-slate-600">
              Update driver information and details
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
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ""}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ""}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
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
            <div className="space-y-2">
              <Label htmlFor="current_address">Address *</Label>
              <Input
                id="current_address"
                value={formData.current_address || ""}
                onChange={(e) =>
                  handleInputChange("current_address", e.target.value)
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_city">City *</Label>
                <Input
                  id="current_city"
                  value={formData.current_city || ""}
                  onChange={(e) =>
                    handleInputChange("current_city", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_state">State *</Label>
                <Input
                  id="current_state"
                  value={formData.current_state || ""}
                  onChange={(e) =>
                    handleInputChange("current_state", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_zip">ZIP Code *</Label>
                <Input
                  id="current_zip"
                  value={formData.current_zip || ""}
                  onChange={(e) =>
                    handleInputChange("current_zip", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_address_from_month">From Month *</Label>
                <Input
                  id="current_address_from_month"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.current_address_from_month || 1}
                  onChange={(e) =>
                    handleInputChange(
                      "current_address_from_month",
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_address_from_year">From Year *</Label>
                <Input
                  id="current_address_from_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={
                    formData.current_address_from_year ||
                    new Date().getFullYear()
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "current_address_from_year",
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
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
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  value={formData.license_number || ""}
                  onChange={(e) =>
                    handleInputChange("license_number", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_state">License State *</Label>
                <Input
                  id="license_state"
                  value={formData.license_state || ""}
                  onChange={(e) =>
                    handleInputChange("license_state", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_expiration_date">
                  License Expiration Date *
                </Label>
                <Input
                  id="license_expiration_date"
                  type="date"
                  value={formData.license_expiration_date || ""}
                  onChange={(e) =>
                    handleInputChange("license_expiration_date", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical_card_expiration_date">
                  Medical Card Expiration Date *
                </Label>
                <Input
                  id="medical_card_expiration_date"
                  type="date"
                  value={formData.medical_card_expiration_date || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "medical_card_expiration_date",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date *</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date || ""}
                  onChange={(e) =>
                    handleInputChange("hire_date", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termination_date">Termination Date</Label>
                <Input
                  id="termination_date"
                  type="date"
                  value={formData.termination_date || ""}
                  onChange={(e) =>
                    handleInputChange("termination_date", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name || ""}
                  onChange={(e) =>
                    handleInputChange("emergency_contact_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone || ""}
                  onChange={(e) =>
                    handleInputChange("emergency_contact_phone", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relationship">
                  Relationship
                </Label>
                <Input
                  id="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "emergency_contact_relationship",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full min-h-[100px] p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about the driver..."
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
