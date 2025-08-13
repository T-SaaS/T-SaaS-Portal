import { useParams, useNavigate } from "react-router-dom";
import { ApplicationDetailsView } from "@/organisms/ApplicationDetailsView";
import { ApplicationNotFound } from "./ApplicationNotFound";
import { Company } from "@/types";
import { useDriverApplication } from "@/hooks/useDriverApplications";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch single application
  const {
    application: applicationData,
    loading: applicationLoading,
    refetch: refetchApplication,
  } = useDriverApplication(id || "");

  // Fetch company data for the application
  const { company: companyData } = useCompany({
    companyId: applicationData?.company_id,
  });

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

  const handleEdit = () => {
    navigate(`/applications/${id}/edit`);
  };

  const handleStatusChange = () => {
    // Refresh the application data when status changes
    refetchApplication();
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
    <ApplicationDetailsView
      application={applicationData}
      company={companyData as Company}
      formatDate={formatDate}
      isEditing={false} // No inline editing, always false
      onExport={() => handleExport(applicationData.id)}
      onApprove={() => handleApprove(applicationData.id)}
      onReject={() => handleReject(applicationData.id)}
      onEdit={handleEdit}
      onSave={() => {}} // No save logic
      onCancel={() => {}} // No cancel logic
      onStatusChange={handleStatusChange}
    />
  );
}
