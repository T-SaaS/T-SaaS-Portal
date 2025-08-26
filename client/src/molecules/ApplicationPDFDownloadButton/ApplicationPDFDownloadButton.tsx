import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ApplicationPDFTemplate from "@/components/pdf/ApplicationPDFTemplate";
import { DriverApplication, Company } from "@/types";

export interface ApplicationPDFDownloadButtonProps {
  application: DriverApplication;
  company: Company;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ApplicationPDFDownloadButton: React.FC<ApplicationPDFDownloadButtonProps> = ({
  application,
  company,
  disabled = false,
  className = "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
  children,
}) => {
  const filename = `driver_application_${application.first_name}_${application.last_name}.pdf`;

  if (disabled) {
    return (
      <button
        disabled
        className={className}
        title="PDF download is not available"
      >
        {children || "Download PDF"}
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ApplicationPDFTemplate data={{ application, company }} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={className}
          title={loading ? "Generating PDF..." : "Download PDF"}
        >
          {loading ? "Generating PDF..." : children || "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};
