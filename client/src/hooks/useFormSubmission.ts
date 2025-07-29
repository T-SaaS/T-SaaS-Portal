import { useCompanyContext } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import { getDeviceInfo } from "@/utils/deviceInfo";
import type { InsertDriverApplication } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";

export const useFormSubmission = () => {
  const { toast } = useToast();
  const { company } = useCompanyContext();

  const submitMutation = useMutation({
    mutationFn: async (data: InsertDriverApplication) => {
      // Get device information for the application
      const deviceInfo = getDeviceInfo();

      // Include device information in the application submission
      const applicationDataWithDeviceInfo = {
        ...data,
        deviceInfo,
      };

      const response = await apiRequest(
        "POST",
        "/api/v1/driver-applications",
        applicationDataWithDeviceInfo
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully",
        description:
          "Your driver qualification application has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadSignature = async (
    signatureData: string | null,
    applicationId: string,
    signatureType: string
  ): Promise<any> => {
    if (!signatureData || !company?.name) {
      throw new Error("Missing signature data or company name");
    }

    const response = await apiRequest("POST", "/api/v1/signatures/upload", {
      signatureData,
      applicationId,
      companyName: company.name,
      signatureType,
    });

    if (!response.ok) {
      throw new Error("Failed to upload signature");
    }

    return response.json();
  };

  const updateApplicationWithSignatures = async (
    applicationId: string,
    signatureData: any
  ): Promise<any> => {
    const response = await apiRequest(
      "PUT",
      `/api/v1/driver-applications/${applicationId}`,
      signatureData
    );

    if (!response.ok) {
      throw new Error("Failed to update application with signatures");
    }

    return response.json();
  };

  const formatFormData = (data: DriverFormValues): InsertDriverApplication => {
    return {
      company_id: 1, // TODO: Get from context/params
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob,
      phone: data.phone,
      email: data.email,
      current_address: data.currentAddress,
      current_city: data.currentCity,
      current_state: data.currentState,
      current_zip: data.currentZip,
      current_address_from_month: Number(data.currentAddressFromMonth),
      current_address_from_year: Number(data.currentAddressFromYear),
      license_number: data.licenseNumber,
      license_state: data.licenseState,
      license_expiration_date: data.licenseExpirationDate || "",
      medical_card_expiration_date: data.medicalCardExpirationDate || "",
      position_applied_for: data.positionAppliedFor,
      addresses: data.addresses.map((addr) => ({
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        fromMonth: Number(addr.fromMonth),
        fromYear: Number(addr.fromYear),
        toMonth: Number(addr.toMonth),
        toYear: Number(addr.toYear),
      })),
      jobs: data.jobs.map((job) => ({
        employerName: job.employerName,
        positionHeld: job.positionHeld,
        companyEmail: job.companyEmail || undefined,
        fromMonth: Number(job.fromMonth),
        fromYear: Number(job.fromYear),
        toMonth: Number(job.toMonth),
        toYear: Number(job.toYear),
      })),
      social_security_number: data.socialSecurityNumber,
      // Include consent flags in initial submission
      fair_credit_reporting_act_consent:
        data.fairCreditReportingActConsentSignatureConsent || false,
      fmcsa_clearinghouse_consent:
        data.fmcsaClearinghouseConsentSignatureConsent || false,
      motor_vehicle_record_consent:
        data.motorVehicleRecordConsentSignatureConsent || false,
      drug_test_consent: data.drugTestConsentSignatureConsent || false,
      drug_test_question: data.drugTestQuestion || "",
      general_consent: data.generalConsentSignatureConsent || false,
      // Don't include signature data in initial submission - we'll add it after uploads
    };
  };

  const submitForm = async (data: DriverFormValues): Promise<void> => {
    try {
      // Step 1: Submit the form data to create the application
      const formattedData = formatFormData(data);

      // Get device information for the application
      const deviceInfo = getDeviceInfo();

      // Include device information in the application submission
      const applicationDataWithDeviceInfo = {
        ...formattedData,
        device_info: deviceInfo,
      };

      console.log("Submitting formatted data:", applicationDataWithDeviceInfo);

      const submitResponse = await apiRequest(
        "POST",
        "/api/v1/driver-applications",
        applicationDataWithDeviceInfo
      );

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to create application");
      }

      const submitResult = await submitResponse.json();

      if (!submitResult.success || !submitResult.data?.id) {
        throw new Error("Invalid response from server");
      }

      const applicationId = submitResult.data.id.toString();

      toast({
        title: "Application Created",
        description:
          "Your application has been created. Uploading signatures...",
      });

      // Step 2: Upload any signatures that haven't been uploaded yet
      const signatureUploads = [];
      const signatureUpdates: any = {};

      // Fair Credit Reporting Act consent signature
      if (
        data.fairCreditReportingActConsentSignature?.data &&
        !data.fairCreditReportingActConsentSignature.uploaded
      ) {
        const uploadResult = await uploadSignature(
          data.fairCreditReportingActConsentSignature.data,
          applicationId,
          "fair-credit-reporting-act-consent"
        );
        signatureUpdates.fair_credit_reporting_act_consent_signature = {
          ...data.fairCreditReportingActConsentSignature,
          uploaded: true,
          url: uploadResult.data.url,
          signedUrl: uploadResult.data.signedUrl,
          path: uploadResult.data.path,
        };
      }

      // FMCSA Clearinghouse consent signature
      if (
        data.fmcsaClearinghouseConsentSignature?.data &&
        !data.fmcsaClearinghouseConsentSignature.uploaded
      ) {
        const uploadResult = await uploadSignature(
          data.fmcsaClearinghouseConsentSignature.data,
          applicationId,
          "fmcsa-clearinghouse-consent"
        );
        signatureUpdates.fmcsa_clearinghouse_consent_signature = {
          ...data.fmcsaClearinghouseConsentSignature,
          uploaded: true,
          url: uploadResult.data.url,
          signedUrl: uploadResult.data.signedUrl,
          path: uploadResult.data.path,
        };
      }

      // Drug test consent signature
      if (
        data.drugTestConsentSignature?.data &&
        !data.drugTestConsentSignature.uploaded
      ) {
        const uploadResult = await uploadSignature(
          data.drugTestConsentSignature.data,
          applicationId,
          "drug-test-consent"
        );
        signatureUpdates.drug_test_consent_signature = {
          ...data.drugTestConsentSignature,
          uploaded: true,
          url: uploadResult.data.url,
          signedUrl: uploadResult.data.signedUrl,
          path: uploadResult.data.path,
        };
      }

      // Motor vehicle record consent signature
      if (
        data.motorVehicleRecordConsentSignature?.data &&
        !data.motorVehicleRecordConsentSignature.uploaded
      ) {
        const uploadResult = await uploadSignature(
          data.motorVehicleRecordConsentSignature.data,
          applicationId,
          "motor-vehicle-record-consent"
        );
        signatureUpdates.motor_vehicle_record_consent_signature = {
          ...data.motorVehicleRecordConsentSignature,
          uploaded: true,
          url: uploadResult.data.url,
          signedUrl: uploadResult.data.signedUrl,
          path: uploadResult.data.path,
        };
      }

      // General consent signature
      if (
        data.generalConsentSignature?.data &&
        !data.generalConsentSignature.uploaded
      ) {
        const uploadResult = await uploadSignature(
          data.generalConsentSignature.data,
          applicationId,
          "general-consent"
        );
        signatureUpdates.general_consent_signature = {
          ...data.generalConsentSignature,
          uploaded: true,
          url: uploadResult.data.url,
          signedUrl: uploadResult.data.signedUrl,
          path: uploadResult.data.path,
        };
      }

      // Step 3: Update the application with signature data if any signatures were uploaded
      if (Object.keys(signatureUpdates).length > 0) {
        await updateApplicationWithSignatures(applicationId, signatureUpdates);

        toast({
          title: "Signatures Uploaded",
          description:
            "All signatures have been uploaded and attached to your application.",
        });
      }

      // Step 4: Show final success message
      toast({
        title: "Application Submitted Successfully",
        description:
          "Your driver qualification application has been submitted for review.",
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    submitForm,
    submitMutation,
    isSubmitting: submitMutation.isPending,
  };
};
