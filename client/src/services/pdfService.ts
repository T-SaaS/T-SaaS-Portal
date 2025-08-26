import ApplicationPDFTemplate from "@/components/pdf/ApplicationPDFTemplate";
import React from "react";

// Implementation of the PDF service
class ClientPdfService {
  async generateDriverApplicationPDF(
    application: any,
    company: any
  ): Promise<Blob> {
    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");

      // Create the PDF document using the ApplicationPDFTemplate
      const element = React.createElement(ApplicationPDFTemplate, {
        data: { application, company },
      });

      // Generate PDF blob using the pdf() function
      const blob = await pdf(element as any).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating driver application PDF:", error);
      throw new Error("Failed to generate driver application PDF");
    }
  }

  async downloadDriverApplicationPDF(
    application: any,
    company: any,
    filename: string = "driver_application.pdf"
  ): Promise<void> {
    try {
      // Generate PDF blob first
      const pdfBlob = await this.generateDriverApplicationPDF(
        application,
        company
      );

      // Download the blob
      this.downloadPdf(pdfBlob, filename);
    } catch (error) {
      console.error("Error downloading driver application PDF:", error);
      throw new Error("Failed to download driver application PDF");
    }
  }

  private downloadPdf(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Create and export the service instance
export const pdfService = new ClientPdfService();

export default pdfService;
