import { useCompanyContext } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { validateForSubmission } from "@/utils/validationUtils";
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
  ) => {
    if (!signatureData) {
      throw new Error("No signature data provided");
    }

    const response = await apiRequest("POST", "/api/v1/signatures/upload", {
      signatureData,
      applicationId,
      companyName: company?.name || "Unknown Company",
      signatureType,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload signature");
    }

    return response.json();
  };

  const updateApplicationWithSignatures = async (
    applicationId: string,
    signatureUpdates: any
  ) => {
    const response = await apiRequest(
      "PUT",
      `/api/v1/driver-applications/${applicationId}`,
      signatureUpdates
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update application");
    }

    return response.json();
  };

  const formatFormData = (data: DriverFormValues): InsertDriverApplication => {
    return {
      company_id: company?.id || "",
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob,
      social_security_number: data.socialSecurityNumber,
      position_applied_for: data.positionAppliedFor,
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
      license_expiration_date: data.licenseExpirationDate,
      medical_card_expiration_date: data.medicalCardExpirationDate,
      license_photo: data.licensePhoto,
      medical_card_photo: data.medicalCardPhoto,
      addresses:
        data.addresses?.map((addr) => ({
          address: addr.address,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          fromMonth: Number(addr.fromMonth),
          fromYear: Number(addr.fromYear),
          toMonth: Number(addr.toMonth),
          toYear: Number(addr.toYear),
        })) || [],
      jobs:
        data.jobs?.map((job) => ({
          employerName: job.employerName,
          positionHeld: job.positionHeld,
          businessName: job.businessName,
          companyEmail: job.companyEmail,
          companyPhone: job.companyPhone,
          reasonForLeaving: job.reasonForLeaving,
          fromMonth: Number(job.fromMonth),
          fromYear: Number(job.fromYear),
          toMonth: Number(job.toMonth),
          toYear: Number(job.toYear),
        })) || [],
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
      // Validate the form data for final submission
      const validationResult = await validateForSubmission(data);

      if (!validationResult.isValid) {
        const errorMessages = Object.values(validationResult.errors).join(", ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }

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
        signatureUploads.push(
          uploadSignature(
            data.fairCreditReportingActConsentSignature.data,
            applicationId,
            "fair_credit_reporting_act_consent"
          ).then((result) => {
            signatureUpdates.fair_credit_reporting_act_consent_signature = {
              uploaded: true,
              url: result.data.url,
              signedUrl: result.data.signedUrl,
              path: result.data.path,
              timestamp: result.data.timestamp,
            };
          })
        );
      }

      // FMCSA Clearinghouse consent signature
      if (
        data.fmcsaClearinghouseConsentSignature?.data &&
        !data.fmcsaClearinghouseConsentSignature.uploaded
      ) {
        signatureUploads.push(
          uploadSignature(
            data.fmcsaClearinghouseConsentSignature.data,
            applicationId,
            "fmcsa_clearinghouse_consent"
          ).then((result) => {
            signatureUpdates.fmcsa_clearinghouse_consent_signature = {
              uploaded: true,
              url: result.data.url,
              signedUrl: result.data.signedUrl,
              path: result.data.path,
              timestamp: result.data.timestamp,
            };
          })
        );
      }

      // Motor Vehicle Record consent signature
      if (
        data.motorVehicleRecordConsentSignature?.data &&
        !data.motorVehicleRecordConsentSignature.uploaded
      ) {
        signatureUploads.push(
          uploadSignature(
            data.motorVehicleRecordConsentSignature.data,
            applicationId,
            "motor_vehicle_record_consent"
          ).then((result) => {
            signatureUpdates.motor_vehicle_record_consent_signature = {
              uploaded: true,
              url: result.data.url,
              signedUrl: result.data.signedUrl,
              path: result.data.path,
              timestamp: result.data.timestamp,
            };
          })
        );
      }

      // Drug test consent signature
      if (
        data.drugTestConsentSignature?.data &&
        !data.drugTestConsentSignature.uploaded
      ) {
        signatureUploads.push(
          uploadSignature(
            data.drugTestConsentSignature.data,
            applicationId,
            "drug_test_consent"
          ).then((result) => {
            signatureUpdates.drug_test_consent_signature = {
              uploaded: true,
              url: result.data.url,
              signedUrl: result.data.signedUrl,
              path: result.data.path,
              timestamp: result.data.timestamp,
            };
          })
        );
      }

      // General consent signature
      if (
        data.generalConsentSignature?.data &&
        !data.generalConsentSignature.uploaded
      ) {
        signatureUploads.push(
          uploadSignature(
            data.generalConsentSignature.data,
            applicationId,
            "general_consent"
          ).then((result) => {
            signatureUpdates.general_consent_signature = {
              uploaded: true,
              url: result.data.url,
              signedUrl: result.data.signedUrl,
              path: result.data.path,
              timestamp: result.data.timestamp,
            };
          })
        );
      }

      // Wait for all signature uploads to complete
      if (signatureUploads.length > 0) {
        await Promise.all(signatureUploads);
      }

      // Step 3: Update the application with signature data
      if (Object.keys(signatureUpdates).length > 0) {
        await updateApplicationWithSignatures(applicationId, signatureUpdates);
      }

      // Step 4: Trigger the mutation success handler
      submitMutation.mutate(formattedData);
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };

  return {
    submitForm,
    isSubmitting: submitMutation.isPending,
  };
};
