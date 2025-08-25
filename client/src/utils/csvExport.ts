import { Company, DriverApplication } from "@/types";
import { formatDate } from "./dateUtils";

/**
 * Converts driver applications data to CSV format and triggers download
 * @param applications - Array of driver applications to export
 * @param companies - Array of companies for company name lookup
 * @param filename - Optional filename for the CSV file
 */
export const exportApplicationsToCSV = (
  applications: DriverApplication[],
  companies: Company[],
  filename?: string
) => {
  if (applications.length === 0) {
    console.warn("No applications to export");
    return;
  }

  // Create company lookup map for better performance
  const companyMap = new Map(
    companies.map((company) => [company.id, company.name])
  );

  // Define CSV headers
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Company",
    "Status",
    "Submitted Date",
    "Date of Birth",
    "Position Applied For",
    "Background Check Status",
    "Current Address",
    "Current City",
    "Current State",
    "Current ZIP",
    "Current Address From (Month/Year)",
    "License Number",
    "License State",
    "License Expiration Date",
    "Medical Card Expiration Date",
    "Social Security Number",
    "Consent to Background Check",
    "Background Check Completed At",
    "Device Info",
    "IP Address",
  ];

  // Convert applications to CSV rows
  const csvRows = applications.map((app) => [
    app.id,
    app.first_name || "",
    app.last_name || "",
    app.email || "",
    app.phone || "",
    companyMap.get(app.company_id) || app.company_id || "",
    app.status || "",
    app.submitted_at ? formatDate(app.submitted_at) : "",
    app.dob || "",
    app.position_applied_for || "",
    app.background_check_status || "",
    app.current_address || "",
    app.current_city || "",
    app.current_state || "",
    app.current_zip || "",
    app.current_address_from_month && app.current_address_from_year
      ? `${app.current_address_from_month}/${app.current_address_from_year}`
      : "",
    app.license_number || "",
    app.license_state || "",
    app.license_expiration_date || "",
    app.medical_card_expiration_date || "",
    app.social_security_number || "",
    app.consent_to_background_check ? "Yes" : "No",
    app.background_check_completed_at
      ? formatDate(app.background_check_completed_at)
      : "",
    app.device_info || "",
    app.ip_address || "",
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...csvRows]
    .map((row) =>
      row
        .map((field) => {
          // Escape quotes and wrap in quotes if field contains comma, quote, or newline
          const escapedField = String(field).replace(/"/g, '""');
          if (
            escapedField.includes(",") ||
            escapedField.includes('"') ||
            escapedField.includes("\n")
          ) {
            return `"${escapedField}"`;
          }
          return escapedField;
        })
        .join(",")
    )
    .join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      filename ||
        `driver_applications_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Exports a single application to CSV
 * @param application - Single driver application to export
 * @param companies - Array of companies for company name lookup
 * @param filename - Optional filename for the CSV file
 */
export const exportSingleApplicationToCSV = (
  application: DriverApplication,
  companies: Company[],
  filename?: string
) => {
  exportApplicationsToCSV([application], companies, filename);
};
