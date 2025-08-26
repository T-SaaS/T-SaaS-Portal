import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicationDetailsView } from "@/organisms/ApplicationDetailsView";
import { ApplicationNotFound } from "./ApplicationNotFound";
import { Company } from "@/types";
import { useDriverApplication } from "@/hooks/useDriverApplications";
import { useCompany } from "@/hooks/useCompany";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { pdfService } from "@/services/pdfService";
import { ApplicationPdfViewer } from "@/components/pdf/ApplicationPdfViewer";
import { exportSingleApplicationToCSV } from "@/utils/csvExport";

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // PDF state
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

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
  // if (applicationData && companyData) {
  //   setTimeout(() => {
  //     setIsPdfViewerOpen(true);
  //   }, 1000);
  // }

  const handleExport = (id: string) => {
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

  const handlePrint = async (id: string) => {
    if (!applicationData || !companyData) {
      toast({
        title: "Error",
        description: "Application or company data not available",
        variant: "destructive",
      });
      return;
    }

    // Check if status is draft
    if (applicationData.status === "draft") {
      toast({
        title: "Cannot Print Draft",
        description:
          "Draft applications cannot be printed. Please submit the application first.",
        variant: "destructive",
      });
      return;
    }

    // Open the PDF viewer modal directly
    setIsPdfViewerOpen(true);
    console.log("PDF Viewer Opened");
  };

  const handleDownload = async (id: string) => {
    if (!applicationData || !companyData) {
      toast({
        title: "Error",
        description: "Application or company data not available",
        variant: "destructive",
      });
      return;
    }

    // Check if status is draft
    if (applicationData.status === "draft") {
      toast({
        title: "Cannot Download Draft",
        description:
          "Draft applications cannot be downloaded. Please submit the application first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const filename = `driver_application_${applicationData.first_name}_${applicationData.last_name}.pdf`;
      await pdfService.downloadDriverApplicationPDF(
        applicationData,
        companyData,
        filename
      );

      toast({
        title: "PDF Downloaded",
        description: "PDF has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "PDF Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    navigate(`/applications/${id}/edit`);
  };

  const handleStatusChange = () => {
    // Refresh the application data when status changes
    refetchApplication();
  };

  const handleShowPdf = () => {
    setIsPdfViewerOpen(true);
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
    <>
      <ApplicationDetailsView
        application={applicationData}
        company={companyData as Company}
        formatDate={formatDate}
        isEditing={false} // No inline editing, always false
        onExport={() => handleExport(applicationData.id)}
        onPrint={() => handlePrint(applicationData.id)}
        onEdit={handleEdit}
        onSave={() => {}} // No save logic
        onCancel={() => {}} // No cancel logic
        onStatusChange={handleStatusChange}
      />

      {/* Additional PDF Actions */}
      <div className="mt-4 flex gap-2 justify-center">
        <button
          onClick={() => handleDownload(applicationData.id)}
          disabled={applicationData.status === "draft"}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Download PDF
        </button>
        <button
          onClick={handleShowPdf}
          disabled={applicationData.status === "draft"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          View PDF
        </button>
      </div>

      {/* PDF Viewer Modal */}
      <ApplicationPdfViewer
        application={applicationData}
        company={companyData as Company}
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        filename={`driver_application_${applicationData.first_name}_${applicationData.last_name}.pdf`}
      />
    </>
  );
}
