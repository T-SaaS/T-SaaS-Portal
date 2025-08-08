import { useState, useMemo } from "react";
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

// Closed statuses that should be filtered out from the applications list
const CLOSED_STATUSES: DriverApplication["status"][] = [
  "Not Hired",
  "Disqualified",
  "Rejected",
  "Expired",
  "Approved",
];

export function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    status?: DriverApplication["status"];
    company_id?: string;
    dateFrom?: string;
    dateTo?: string;
    state?: string;
    position?: string;
    background_check_status?: string;
  }>({});

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
    // Consent fields
    fair_credit_reporting_act_consent: app.fair_credit_reporting_act_consent,
    fmcsa_clearinghouse_consent: app.fmcsa_clearinghouse_consent,
    motor_vehicle_record_consent: app.motor_vehicle_record_consent,
    drug_test_consent: app.drug_test_consent,
    drug_test_question: app.drug_test_question,
    general_consent: app.general_consent,
    // Signature fields
    fair_credit_reporting_act_consent_signature:
      app.fair_credit_reporting_act_consent_signature,
    fmcsa_clearinghouse_consent_signature:
      app.fmcsa_clearinghouse_consent_signature,
    motor_vehicle_record_consent_signature:
      app.motor_vehicle_record_consent_signature,
    drug_test_consent_signature: app.drug_test_consent_signature,
    general_consent_signature: app.general_consent_signature,
    // Document photo fields
    license_photo: app.license_photo,
    medical_card_photo: app.medical_card_photo,
    // Device and IP information
    device_info: app.device_info,
    ip_address: app.ip_address,
  });

  const applications: DriverApplication[] =
    applicationsData?.map(transformApplication) || [];

  // Extract available filter options from applications data
  const availableOptions = useMemo(() => {
    const statuses = new Set<DriverApplication["status"]>();
    const states = new Set<string>();
    const positions = new Set<string>();

    applications.forEach((app) => {
      if (app.status) statuses.add(app.status);
      if (app.current_state) states.add(app.current_state);
      if (app.position_applied_for) positions.add(app.position_applied_for);
    });

    // Include all statuses including closed ones for filtering
    const allStatuses = Array.from(statuses).sort();

    return {
      statuses: allStatuses,
      states: Array.from(states).sort(),
      positions: Array.from(positions).sort(),
    };
  }, [applications]);

  // Apply filters
  const filteredApplications = applications.filter((app) => {
    // Check if we should show closed statuses based on search/filter criteria
    const isSearchingForClosedStatus =
      searchTerm.toLowerCase().includes("rejected") ||
      searchTerm.toLowerCase().includes("disqualified") ||
      searchTerm.toLowerCase().includes("expired") ||
      searchTerm.toLowerCase().includes("not hired") ||
      searchTerm.toLowerCase().includes("approved") ||
      filters.status === "Rejected" ||
      filters.status === "Disqualified" ||
      filters.status === "Expired" ||
      filters.status === "Not Hired" ||
      filters.status === "Approved";

    // Filter out applications with closed statuses unless explicitly searching/filtering for them
    if (CLOSED_STATUSES.includes(app.status) && !isSearchingForClosedStatus) {
      return false;
    }

    // Apply search term filter
    const searchMatch =
      !searchTerm ||
      `${app.first_name} ${app.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companies
        ?.find((c) => c.id === app.company_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    if (!searchMatch) return false;

    // Apply status filter
    if (filters.status && app.status !== filters.status) {
      return false;
    }

    // Apply company filter
    if (filters.company_id && app.company_id !== filters.company_id) {
      return false;
    }

    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      const submittedDate = new Date(app.submitted_at);
      if (filters.dateFrom && submittedDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && submittedDate > new Date(filters.dateTo)) {
        return false;
      }
    }

    // Apply state filter
    if (filters.state && app.current_state !== filters.state) {
      return false;
    }

    // Apply position filter
    if (filters.position && app.position_applied_for !== filters.position) {
      return false;
    }

    // Apply background check status filter
    if (
      filters.background_check_status &&
      app.background_check_status !== filters.background_check_status
    ) {
      return false;
    }

    return true;
  });

  const handleExport = (id: string) => {
    console.log("Export application:", id);
    // Add your export logic here
  };

  const handleExportAll = () => {
    console.log("Export all applications");
    // Add your export all logic here
  };

  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
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
            filters={filters}
            onFiltersChange={setFilters}
            companies={companies || []}
            availableStatuses={availableOptions.statuses}
            availableStates={availableOptions.states}
            availablePositions={availableOptions.positions}
            searchPlaceholder="Search applications by name, email, phone, company, or status..."
          />
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {Object.keys(filters).length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center flex-wrap gap-2 text-sm text-slate-600">
              <span>Active filters:</span>
              {filters.status && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => removeFilter("status")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove status filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.company_id && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Company:{" "}
                  {companies?.find((c) => c.id === filters.company_id)?.name ||
                    filters.company_id}
                  <button
                    onClick={() => removeFilter("company_id")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove company filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.state && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  State: {filters.state}
                  <button
                    onClick={() => removeFilter("state")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove state filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.position && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Position: {filters.position}
                  <button
                    onClick={() => removeFilter("position")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove position filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.background_check_status && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Background Check: {filters.background_check_status}
                  <button
                    onClick={() => removeFilter("background_check_status")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove background check filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  Date: {filters.dateFrom || "Any"} - {filters.dateTo || "Any"}
                  <button
                    onClick={() => {
                      removeFilter("dateFrom");
                      removeFilter("dateTo");
                    }}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800"
                    title="Remove date filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <span className="text-slate-500">
                ({filteredApplications.length} of {applications.length}{" "}
                applications)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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
