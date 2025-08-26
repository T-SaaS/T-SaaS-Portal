import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicationDetailsView } from "@/organisms/ApplicationDetailsView";
import { ApplicationNotFound } from "./ApplicationNotFound";
import { Company } from "@/types";
import { useDriverApplication } from "@/hooks/useDriverApplications";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { ApplicationPdfViewer } from "@/components/pdf/ApplicationPdfViewer";
import { exportSingleApplicationToCSV } from "@/utils/csvExport";
import { ApplicationPDFDownloadButton } from "@/molecules";

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  // Fetch application and company data
  const {
    application: applicationData,
    loading: applicationLoading,
    refetch: refetchApplication,
  } = useDriverApplication(id || "");

  const { company: companyData } = useCompany({
    companyId: applicationData?.company_id,
  });

  // Handler functions
  const handleExport = () => {
    if (!applicationData || !companyData) {
      toast({
        title: "Error",
        description: "Application or company data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const filename = `driver_application_${applicationData.first_name}_${applicationData.last_name}.csv`;
      exportSingleApplicationToCSV(applicationData, [companyData], filename);

      toast({
        title: "Export Successful",
        description: "Application data has been exported to CSV",
      });
    } catch (error) {
      console.error("Error exporting application:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export application data",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (!applicationData || !companyData) {
      toast({
        title: "Error",
        description: "Application or company data not available",
        variant: "destructive",
      });
      return;
    }

    if (applicationData.status === "draft") {
      toast({
        title: "Cannot Print Draft",
        description:
          "Draft applications cannot be printed. Please submit the application first.",
        variant: "destructive",
      });
      return;
    }

    setIsPdfViewerOpen(true);
  };

  const handleEdit = () => {
    navigate(`/applications/${id}/edit`);
  };

  const handleStatusChange = () => {
    refetchApplication();
  };

  const handleShowPdf = () => {
    setIsPdfViewerOpen(true);
  };

  const handleClosePdf = () => {
    setIsPdfViewerOpen(false);
  };

  // Loading state
  if (applicationLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Loading Application...
        </h2>
      </div>
    );
  }

  // Not found state
  if (!applicationData) {
    return <ApplicationNotFound />;
  }

  const isDraft = applicationData.status === "draft";
  const canGeneratePdf = !isDraft && companyData;

  return (
    <>
      <ApplicationDetailsView
        application={applicationData}
        company={companyData as Company}
        formatDate={formatDate}
        isEditing={false}
        onExport={handleExport}
        onPrint={handlePrint}
        onEdit={handleEdit}
        onSave={() => {}} // No save logic needed
        onCancel={() => {}} // No cancel logic needed
        onStatusChange={handleStatusChange}
      />

      {/* PDF Actions */}
      <div className="mt-4 flex gap-2 justify-center">
        <ApplicationPDFDownloadButton
          application={applicationData}
          company={companyData as Company}
          disabled={!canGeneratePdf}
          className={
            canGeneratePdf
              ? "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              : "px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          }
        >
          {isDraft ? "Download PDF (Draft)" : "Download PDF"}
        </ApplicationPDFDownloadButton>

        <button
          onClick={handleShowPdf}
          disabled={isDraft}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          title={
            isDraft
              ? "Draft applications cannot be viewed"
              : "View PDF in browser"
          }
        >
          View PDF
        </button>
      </div>

      {/* PDF Viewer Modal */}
      <ApplicationPdfViewer
        application={applicationData}
        company={companyData as Company}
        isOpen={isPdfViewerOpen}
        onClose={handleClosePdf}
        filename={`driver_application_${applicationData.first_name}_${applicationData.last_name}.pdf`}
      />
    </>
  );
}
