import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/atoms/PageHeader";
import { ActionButton } from "@/atoms/ActionButton";
import { SearchFilterBar } from "@/molecules/SearchFilterBar";
import { ApplicationsTable } from "@/organisms/ApplicationsTable";
import { Download } from "lucide-react";
import { DriverApplication } from "@/types";
import { useDriverApplications } from "@/hooks/useDriverApplications";
import { formatDate } from "@/utils/dateUtils";
import { useCompanies } from "@/hooks/useCompany";

export function ApplicationsPage() {
  
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch applications using REST API
  const {
    applications: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
  } = useDriverApplications();
  // Fetch companies using REST API
  const {
    companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompanies();
  // Transform API data to match our DriverApplication type
  const transformApplication = (app: any): DriverApplication => ({
    id: app.id,
    first_name: app.first_name,
    last_name: app.last_name,
    email: app.email,
    phone: app.phone,
    company_id: app.company_id,
    status: app.status || "pending",
    submitted_at: app.submitted_at,
    dob: app.dob,
    position_applied_for: app.position_applied_for,
    background_check_status: app.background_check_status,
    current_address: app.current_address,
    current_city: app.current_city,
    current_state: app.current_state,
    current_zip: app.current_zip,
    current_address_from_month: app.current_address_from_month,
    current_address_from_year: app.current_address_from_year,
    license_number: app.license_number,
    license_state: app.license_state,
    license_expiration_date: app.license_expiration_date,
    medical_card_expiration_date: app.medical_card_expiration_date,
    addresses: app.addresses || [],
    jobs: app.jobs || [],
    social_security_number: app.social_security_number,
    consent_to_background_check: app.consent_to_background_check,
    background_check_results: app.background_check_results,
    background_check_completed_at: app.background_check_completed_at,
  });

  const applications: DriverApplication[] =
    applicationsData?.map(transformApplication) || [];

  const filteredApplications = applications.filter(
    (app) =>
      `${app.first_name} ${app.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (id: string) => {
    console.log("Export application:", id);
    // Add your export logic here
  };

  const handleExportAll = () => {
    console.log("Export all applications");
    // Add your export all logic here
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
    // Add your filter logic here
  };

  // Handle loading and error states
  if (applicationsError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Error Loading Applications
        </h2>
        <p className="text-slate-600 mt-2">
          {applicationsError || "Failed to load applications"}
        </p>
      </div>
    );
  }

  // Applications list view
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Driver Applications"
        description="View and manage driver applications"
      >
        <ActionButton icon={Download} onClick={handleExportAll}>
          Export All
        </ActionButton>
      </PageHeader>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onFilterClick={handleFilterClick}
          />
        </CardContent>
      </Card>

      {/* Applications Table */}
      <ApplicationsTable
        applications={filteredApplications}
        companies={companies}
        isLoading={applicationsLoading}
        formatDate={formatDate}
        onExport={handleExport}
      />
    </div>
  );
}
