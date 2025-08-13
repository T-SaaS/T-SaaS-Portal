import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/atoms/PageHeader";
import { ActionButton } from "@/atoms/ActionButton";
import { CompanySearchFilterBar } from "@/molecules/CompanySearchFilterBar";
import { DriversTable } from "@/organisms/DriversTable";
import { Download } from "lucide-react";
import { Driver } from "@/types";
import { useDrivers } from "@/hooks/useDrivers";
import { formatDate } from "@/utils/dateUtils";
import { useCompanies } from "@/hooks/useCompany";

// Statuses that should be filtered out from the drivers list
const INACTIVE_STATUSES: Driver["status"][] = [
  "out_of_duty",
  "no_longer_employed",
];

export function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    domain?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  // Fetch drivers using REST API
  const {
    drivers: driversData,
    loading: driversLoading,
    error: driversError,
  } = useDrivers();

  // Fetch companies using REST API
  const {
    companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompanies();

  // Transform API data to match our Driver type
  const transformDriver = (driver: any): Driver => ({
    id: driver.id,
    company_id: driver.company_id,
    application_id: driver.application_id,
    first_name: driver.first_name,
    last_name: driver.last_name,
    status: driver.status || "active",
    dob: driver.dob,
    phone: driver.phone,
    email: driver.email,
    current_address: driver.current_address,
    current_city: driver.current_city,
    current_state: driver.current_state,
    current_zip: driver.current_zip,
    current_address_from_month: driver.current_address_from_month,
    current_address_from_year: driver.current_address_from_year,
    license_number: driver.license_number,
    license_state: driver.license_state,
    license_expiration_date: driver.license_expiration_date,
    medical_card_expiration_date: driver.medical_card_expiration_date,
    position: driver.position,
    license_photo: driver.license_photo,
    medical_card_photo: driver.medical_card_photo,
    hire_date: driver.hire_date,
    termination_date: driver.termination_date,
    emergency_contact_name: driver.emergency_contact_name,
    emergency_contact_phone: driver.emergency_contact_phone,
    emergency_contact_relationship: driver.emergency_contact_relationship,
    notes: driver.notes,
    logs: driver.logs,
    created_at: driver.created_at,
    updated_at: driver.updated_at,
  });

  const drivers: Driver[] = driversData?.map(transformDriver) || [];

  // Filter drivers based on search term
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      // Filter out inactive statuses by default
      if (INACTIVE_STATUSES.includes(driver.status)) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          driver.first_name.toLowerCase().includes(searchLower) ||
          driver.last_name.toLowerCase().includes(searchLower) ||
          driver.email.toLowerCase().includes(searchLower) ||
          driver.phone.includes(searchTerm) ||
          driver.license_number.toLowerCase().includes(searchLower) ||
          driver.position.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [drivers, searchTerm]);

  // Get unique values for filter options
  const availableStatuses = useMemo(() => {
    const statuses = Array.from(
      new Set(drivers.map((driver) => driver.status))
    );
    return statuses.filter((status) => !INACTIVE_STATUSES.includes(status));
  }, [drivers]);

  const availableStates = useMemo(() => {
    return Array.from(
      new Set(drivers.map((driver) => driver.current_state))
    ).filter(Boolean);
  }, [drivers]);

  const availablePositions = useMemo(() => {
    return Array.from(new Set(drivers.map((driver) => driver.position))).filter(
      Boolean
    );
  }, [drivers]);

  const availableCompanies = useMemo(() => {
    return companies || [];
  }, [companies]);

  const handleExport = (id: string) => {
    console.log("Export driver:", id);
    // Add your export logic here
  };

  const handleExportAll = () => {
    console.log("Export all drivers");
    // Add your export all logic here
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Handle loading state
  if (driversLoading || companiesLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Loading Drivers...
        </h2>
      </div>
    );
  }

  // Handle error state
  if (driversError || companiesError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Error Loading Drivers
        </h2>
        <p className="text-slate-600 mt-2">
          {driversError ||
            companiesError?.message ||
            "Failed to load drivers"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Drivers"
        description="Manage and view all active drivers"
      >
        <ActionButton onClick={handleExportAll} icon={Download}>
          Export All
        </ActionButton>
      </PageHeader>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <CompanySearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filters={filters}
            onFiltersChange={setFilters}
            availableDomains={Array.from(
              new Set(companies?.map((c) => c.domain).filter(Boolean) as string[])
            )}
            searchPlaceholder="Search drivers by name, email, phone, license..."
          />
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <DriversTable
        drivers={filteredDrivers}
        isLoading={driversLoading}
        formatDate={formatDate}
        onExport={handleExport}
      />
    </div>
  );
}
