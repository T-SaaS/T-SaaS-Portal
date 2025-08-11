import { useParams, useNavigate } from "react-router-dom";
import { CompanyDetailsView } from "@/organisms/CompanyDetailsView";
import { CompanyNotFound } from "./CompanyNotFound";
import { Company } from "@/types";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";

export function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch single company
  const { company: companyData, isLoading: companyLoading } = useCompany({
    companyId: id || "",
  });

  const handleExport = (id: string) => {
    console.log("Export company:", id);
    // Add your export logic here
  };

  const handleEdit = () => {
    navigate(`/companies/${id}/edit`);
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
    <CompanyDetailsView
      company={companyData as Company}
      formatDate={formatDate}
      isEditing={false} // No inline editing, always false
      onExport={() => handleExport(companyData.id)}
      onEdit={handleEdit}
      onSave={() => {}} // No save logic
      onCancel={() => {}} // No cancel logic
    />
  );
}
