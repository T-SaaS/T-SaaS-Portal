import { useParams } from "react-router-dom";
import { ApplicationDetailsView } from "@/organisms/ApplicationDetailsView";
import { ApplicationNotFound } from "./ApplicationNotFound";
import { Company, DriverApplication } from "@/types";
import { useDriverApplication } from "@/hooks/useDriverApplications";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch single application
  const { application: applicationData, loading: applicationLoading } =
    useDriverApplication(id || "");

  // Fetch company data for the application
  const { company: companyData } = useCompany({
    companyId: applicationData?.company_id,
  });

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
    addresses: app.addresses || [],
    jobs: app.jobs || [],
    social_security_number: app.social_security_number,
    consent_to_background_check: app.consent_to_background_check,
    background_check_results: app.background_check_results,
    background_check_completed_at: app.background_check_completed_at,
  });

  const application = applicationData
    ? transformApplication(applicationData)
    : null;

  const handleApprove = (id: string) => {
    console.log("Approve application:", id);
    // Add your approval logic here
  };

  const handleReject = (id: string) => {
    console.log("Reject application:", id);
    // Add your rejection logic here
  };

  const handleExport = (id: string) => {
    console.log("Export application:", id);
    // Add your export logic here
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
  console.log(application);
  // Handle not found state
  if (!application) {
    return <ApplicationNotFound />;
  }

  return (
    <ApplicationDetailsView
      application={application}
      company={companyData as Company}
      formatDate={formatDate}
      onExport={() => handleExport(application.id)}
      onApprove={() => handleApprove(application.id)}
      onReject={() => handleReject(application.id)}
    />
  );
}
