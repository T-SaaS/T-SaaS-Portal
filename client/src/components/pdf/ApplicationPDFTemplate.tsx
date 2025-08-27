import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { DriverApplication, Company } from "@/types";
import { CONSENT_TEXTS } from "@/utils/consentTexts";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginTop: 5,
    borderBottom: "1 solid #ccc",
    paddingBottom: 15,
    marginBottom: 25,
  },
  subheader: {
    paddingBottom: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2f6fb6",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  headerLabel: {
    fontWeight: "bold",
    width: "30%",
  },
  headerValue: {
    width: "70%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f6fb6",
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  headerRow: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f6fb6",
    backgroundColor: "#f5f5f5",
    padding: 8,
    flexDirection: "row",
    borderBottom: "1 solid #eee",
    paddingBottom: 4,
    paddingLeft: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    borderBottom: "1 solid #eee",
    paddingBottom: 4,
    paddingLeft: 5,
    maxHeight: 100,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    width: "60%",
    color: "#666",
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1 solid #ddd",
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  consentSection: {
    marginBottom: 25,
    border: "1 solid #ddd",
    borderRadius: 4,
    padding: 12,
  },
  consentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottom: "1 solid #eee",
    paddingBottom: 8,
  },
  consentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2f6fb6",
    flex: 1,
  },
  consentCheckbox: {
    fontSize: 12,
    color: "#333",
    marginLeft: 10,
  },
  consentText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: "#333",
    marginBottom: 12,
    textAlign: "justify",
  },
  signatureSection: {
    marginTop: 10,
    borderTop: "1 solid #eee",
    paddingTop: 10,
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  signatureImage: {
    width: "100%",
    maxWidth: 200,
    height: "auto",
    border: "1 solid #ccc",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  signatureLeftColumn: {
    flex: 1,
    marginRight: 15,
  },
  signatureRightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  signedDateLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  signedDateValue: {
    fontSize: 11,
    color: "#666",
    marginBottom: 15,
  },
  fullNameLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  fullNameValue: {
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
  },
  certificatePage: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  certificateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2f6fb6",
    marginBottom: 30,
    textDecoration: "underline",
  },
  certificateSection: {
    marginBottom: 25,
    border: "2 solid #2f6fb6",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  certificateInfoRow: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottom: "1 solid #e0e0e0",
    paddingBottom: 8,
  },
  certificateLabel: {
    width: "35%",
    fontSize: 12,
    fontWeight: "bold",
    color: "#2f6fb6",
  },
  certificateValue: {
    width: "65%",
    fontSize: 12,
    color: "#333",
  },
  certificateSignatureSection: {
    marginTop: 30,
    borderTop: "2 solid #2f6fb6",
    paddingTop: 20,
  },
  certificateSignatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 15,
  },
  certificateSignatureLeft: {
    flex: 1,
    marginRight: 20,
  },
  certificateSignatureRight: {
    flex: 1,
    alignItems: "center",
  },
  certificateSignatureImage: {
    width: "100%",
    maxWidth: 250,
    height: "auto",
    border: "2 solid #2f6fb6",
    borderRadius: 4,
  },
});

interface ApplicationPDFTemplateProps {
  data: {
    application: DriverApplication;
    company: Company;
  };
}

const ApplicationPDFTemplate: React.FC<ApplicationPDFTemplateProps> = ({
  data,
}) => {
  const { application, company } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{company.name}</Text>
          <Text style={styles.subtitle}>Driver Application</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>Status:</Text>
            <Text style={styles.headerValue}>{application.status}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>Submitted:</Text>
            <Text style={styles.headerValue}>
              {formatDate(application.submitted_at)}
            </Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>
              {application.first_name} {application.last_name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Social Security Number:</Text>
            <Text style={styles.value}>
              {application.social_security_number}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{formatDate(application.dob)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{application.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{application.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Position Applied For:</Text>
            <Text style={styles.value}>{application.position_applied_for}</Text>
          </View>
        </View>

        {/* Current Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Address</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{application.current_address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>City, State, ZIP:</Text>
            <Text style={styles.value}>
              {application.current_city}, {application.current_state}{" "}
              {application.current_zip}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Resident Since:</Text>
            <Text style={styles.value}>
              {application.current_address_from_month}/
              {application.current_address_from_year}
            </Text>
          </View>
        </View>

        {/* License Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's License Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>License Number:</Text>
            <Text style={styles.value}>{application.license_number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>License State:</Text>
            <Text style={styles.value}>{application.license_state}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>License Expiration:</Text>
            <Text style={styles.value}>
              {formatDate(application.license_expiration_date)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Driver's License Photo:</Text>
            <Image style={styles.value} src={application.license_photo?.url} />
          </View>
        </View>
        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        {/* Medical Card Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Medical Certificate Information
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Medical Card Expiration Date:</Text>
            <Text style={styles.value}>
              {formatDate(application.medical_card_expiration_date)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Medical Card Photo:</Text>
            <Image
              style={styles.value}
              src={application.medical_card_photo?.url}
            />
          </View>
        </View>
        {/* Residency Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Residence History</Text>
          {application.addresses.length > 0 && (
            <View style={styles.headerRow}>
              <Text style={styles.label}>Street Name</Text>
              <Text style={styles.label}>City, State, Zip</Text>
              <Text style={styles.label}>From - To (Month/Year)</Text>
            </View>
          )}
          {application.addresses.length > 0 &&
            application.addresses.map((address) => (
              <View style={styles.row}>
                <Text style={styles.value}>{address.address}</Text>
                <Text style={styles.value}>
                  {address.city}, {address.state} {address.zip}
                </Text>
                <Text
                  style={styles.value}
                >{`${address.fromMonth}/${address.fromYear} - ${address.toMonth}/${address.toYear}`}</Text>
              </View>
            ))}
        </View>
        {/* Employment History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment History</Text>
          {application.jobs.length > 0 && (
            <View style={styles.headerRow}>
              <Text style={styles.label}>Employer</Text>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.label}>Company Email</Text>
              <Text style={styles.label}>From - To (Month/Year)</Text>
            </View>
          )}
          {application.jobs.length > 0 &&
            application.jobs.map((employment) => (
              <View style={styles.row}>
                <Text style={styles.value}>{employment.employerName}</Text>
                <Text style={styles.value}>{employment.positionHeld}</Text>
                <Text style={styles.value}>{employment.companyEmail}</Text>
                <Text
                  style={styles.value}
                >{`${employment.fromMonth}/${employment.fromYear} - ${employment.toMonth}/${employment.toYear}`}</Text>
              </View>
            ))}
        </View>
        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        {/* Consents & Authorizations Section */}
        {/* this page is for the consents and authorizations and the signature pages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consents & Authorizations</Text>
          {/* Fair Credit Reporting Act */}
          <View style={styles.consentSection}>
            <View style={styles.consentHeader}>
              <Text style={styles.consentTitle}>Fair Credit Reporting Act</Text>
            </View>
            <Text style={styles.consentText}>
              {CONSENT_TEXTS.fairCreditReportingAct(company.name)}
            </Text>
            {application.fair_credit_reporting_act_consent_signature?.url && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureLeftColumn}>
                    <Text style={styles.signedDateLabel}>Signed Date:</Text>
                    <Text style={styles.signedDateValue}>
                      {application.fair_credit_reporting_act_consent_signature
                        .timestamp &&
                        formatDate(
                          application
                            .fair_credit_reporting_act_consent_signature
                            .timestamp
                        )}
                    </Text>
                    <Text style={styles.fullNameLabel}>Full Name:</Text>
                    <Text style={styles.fullNameValue}>
                      {application.first_name} {application.last_name}
                    </Text>
                  </View>
                  <View style={styles.signatureRightColumn}>
                    <Image
                      style={styles.signatureImage}
                      src={
                        application.fair_credit_reporting_act_consent_signature
                          .url
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* FMCSA Clearinghouse */}
          <View style={styles.consentSection}>
            <View style={styles.consentHeader}>
              <Text style={styles.consentTitle}>FMCSA Clearinghouse</Text>
            </View>
            <Text style={styles.consentText}>
              {CONSENT_TEXTS.fmcsaClearinghouse(
                company.name,
                `${application.first_name} ${application.last_name}`
              )}
            </Text>
            {application.fmcsa_clearinghouse_consent_signature?.url && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureLeftColumn}>
                    <Text style={styles.signedDateLabel}>Signed Date:</Text>
                    <Text style={styles.signedDateValue}>
                      {application.fmcsa_clearinghouse_consent_signature
                        .timestamp &&
                        formatDate(
                          application.fmcsa_clearinghouse_consent_signature
                            .timestamp
                        )}
                    </Text>
                    <Text style={styles.fullNameLabel}>Full Name:</Text>
                    <Text style={styles.fullNameValue}>
                      {application.first_name} {application.last_name}
                    </Text>
                  </View>
                  <View style={styles.signatureRightColumn}>
                    <Image
                      style={styles.signatureImage}
                      src={
                        application.fmcsa_clearinghouse_consent_signature.url
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        {/* Motor Vehicle Record */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consents & Authorizations</Text>
          <View style={styles.consentSection}>
            <View style={styles.consentHeader}>
              <Text style={styles.consentTitle}>Motor Vehicle Record</Text>
            </View>
            <Text style={styles.consentText}>
              {CONSENT_TEXTS.motorVehicleRecord(company.name)}
            </Text>
            {application.motor_vehicle_record_consent_signature?.url && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureLeftColumn}>
                    <Text style={styles.signedDateLabel}>Signed Date:</Text>
                    <Text style={styles.signedDateValue}>
                      {application.motor_vehicle_record_consent_signature
                        .timestamp &&
                        formatDate(
                          application.motor_vehicle_record_consent_signature
                            .timestamp
                        )}
                    </Text>
                    <Text style={styles.fullNameLabel}>Full Name:</Text>
                    <Text style={styles.fullNameValue}>
                      {application.first_name} {application.last_name}
                    </Text>
                  </View>
                  <View style={styles.signatureRightColumn}>
                    <Image
                      style={styles.signatureImage}
                      src={
                        application.motor_vehicle_record_consent_signature.url
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Drug & Alcohol Testing */}
          <View style={styles.consentSection}>
            <View style={styles.consentHeader}>
              <Text style={styles.consentTitle}>Drug & Alcohol Testing</Text>
            </View>
            <Text style={styles.consentText}>
              {CONSENT_TEXTS.drugAlcoholTesting(
                `${application.first_name} ${application.last_name}`
              )}
            </Text>
            {application.drug_test_consent_signature?.url && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureLeftColumn}>
                    <Text style={styles.signedDateLabel}>Signed Date:</Text>
                    <Text style={styles.signedDateValue}>
                      {application.drug_test_consent_signature.timestamp &&
                        formatDate(
                          application.drug_test_consent_signature.timestamp
                        )}
                    </Text>
                    <Text style={styles.fullNameLabel}>Full Name:</Text>
                    <Text style={styles.fullNameValue}>
                      {application.first_name} {application.last_name}
                    </Text>
                  </View>
                  <View style={styles.signatureRightColumn}>
                    <Image
                      style={styles.signatureImage}
                      src={application.drug_test_consent_signature.url}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consents & Authorizations</Text>
          {/* General Application Consent */}
          <View style={styles.consentSection}>
            <View style={styles.consentHeader}>
              <Text style={styles.consentTitle}>
                General Application Consent
              </Text>
            </View>
            <Text style={styles.consentText}>
              {CONSENT_TEXTS.generalApplication(
                `${application.first_name} ${application.last_name}`,
                company.name
              )}
            </Text>
            {application.general_consent_signature?.url && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureLeftColumn}>
                    <Text style={styles.signedDateLabel}>Signed Date:</Text>
                    <Text style={styles.signedDateValue}>
                      {application.general_consent_signature.timestamp &&
                        formatDate(
                          application.general_consent_signature.timestamp
                        )}
                    </Text>
                    <Text style={styles.fullNameLabel}>Full Name:</Text>
                    <Text style={styles.fullNameValue}>
                      {application.first_name} {application.last_name}
                    </Text>
                  </View>
                  <View style={styles.signatureRightColumn}>
                    <Image
                      style={styles.signatureImage}
                      src={application.general_consent_signature.url}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </Text>
          <Text style={styles.footerText}>
            Driver Application - {company.name}
          </Text>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
      <Page size="A4" style={styles.certificatePage}>
        <Text style={styles.certificateTitle}>Certificate of Completion</Text>
        <View style={styles.certificateSection}>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Document ID:</Text>
            <Text style={styles.certificateValue}>
              {application.id || "N/A"}
            </Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Document Name:</Text>
            <Text style={styles.certificateValue}>Driver Application Form</Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Organization Name:</Text>
            <Text style={styles.certificateValue}>{company.name}</Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Completed On:</Text>
            <Text style={styles.certificateValue}>
              {formatDate(application.submitted_at)}
            </Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Signer Name:</Text>
            <Text style={styles.certificateValue}>
              {application.first_name} {application.last_name}
            </Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Signer Email:</Text>
            <Text style={styles.certificateValue}>{application.email}</Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Accessed From IP:</Text>
            <Text style={styles.certificateValue}>
              {application.ip_address || "N/A"}
            </Text>
          </View>
          <View style={styles.certificateInfoRow}>
            <Text style={styles.certificateLabel}>Device Used:</Text>
            <Text style={styles.certificateValue}>
              {`${application.device_info?.os} | ${application.device_info?.browser} | ${application.device_info?.deviceType} | ${application.device_info?.timezone}`}
            </Text>
          </View>
        </View>
        <View style={styles.certificateSignatureSection}>
          <Text style={styles.signatureLabel}>Signature:</Text>
          <View style={styles.certificateSignatureRow}>
            <View style={styles.certificateSignatureLeft}>
              <Text style={styles.signedDateLabel}>Signed On Date:</Text>
              <Text style={styles.signedDateValue}>
                {application.general_consent_signature?.timestamp &&
                  formatDate(application.general_consent_signature.timestamp)}
              </Text>
              <Text style={styles.fullNameLabel}>Full Name:</Text>
              <Text style={styles.fullNameValue}>
                {application.first_name} {application.last_name}
              </Text>
            </View>
            <View style={styles.certificateSignatureRight}>
              {application.general_consent_signature?.url && (
                <Image
                  style={styles.certificateSignatureImage}
                  src={application.general_consent_signature.url}
                />
              )}
            </View>
          </View>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default ApplicationPDFTemplate;
