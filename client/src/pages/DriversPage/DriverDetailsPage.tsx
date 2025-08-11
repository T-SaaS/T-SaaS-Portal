import { useParams, useNavigate } from "react-router-dom";
import { DriverDetailsView } from "@/organisms/DriverDetailsView";
import { DriverNotFound } from "./DriverNotFound";
import { Company } from "@/types";
import { useDriver } from "@/hooks/useDrivers";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";

export function DriverDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch single driver
  const { driver: driverData, loading: driverLoading } = useDriver(id || "");

  // Fetch company data for the driver
  const { company: companyData } = useCompany({
    companyId: driverData?.company_id,
  });

  const handleTerminate = (id: string) => {
    console.log("Terminate driver:", id);
    // Add your termination logic here
  };

  const handleReactivate = (id: string) => {
    console.log("Reactivate driver:", id);
    // Add your reactivation logic here
  };

  const handleExport = (id: string) => {
    console.log("Export driver:", id);
    // Add your export logic here
  };

  const handleEdit = () => {
    navigate(`/drivers/${id}/edit`);
  };

  const handleStatusChange = () => {
    // Refresh the driver data when status changes
    window.location.reload();
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
    <DriverDetailsView
      driver={driverData}
      company={companyData as Company}
      formatDate={formatDate}
      isEditing={false} // No inline editing, always false
      onExport={() => handleExport(driverData.id)}
      onTerminate={() => handleTerminate(driverData.id)}
      onReactivate={() => handleReactivate(driverData.id)}
      onEdit={handleEdit}
      onSave={() => {}} // No save logic
      onCancel={() => {}} // No cancel logic
      onStatusChange={handleStatusChange}
    />
  );
}
