import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ApplicationPDFTemplate from "./ApplicationPDFTemplate";
import { DriverApplication, Company } from "@/types";

interface PdfViewerProps {
  application: DriverApplication;
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  filename?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  application,
  company,
  isOpen,
  onClose,
  filename = "Driver Application",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{filename}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 p-4">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <ApplicationPDFTemplate data={{ application, company }} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};
