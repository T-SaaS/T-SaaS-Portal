import { useCompanyContext } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { draftValidationSchema } from "@/schemas/driverFormSchemas";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import { getDeviceInfo } from "@/utils/deviceInfo";
import type { DriverApplication } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const useDraft = () => {
  const { toast } = useToast();
  const { company } = useCompanyContext();
  const [searchParams] = useSearchParams();

  // Track retry attempts to prevent infinite loops
  const retryCountRef = useRef(0);
  const maxRetries = 2; // Limit retries to prevent infinite loops

  // Check if there's a resume token in the URL
  const resumeToken = searchParams.get("resume");

  // Function to clean up URL by removing resume token
  const cleanupUrl = useCallback(() => {
    if (resumeToken) {
      const url = new URL(window.location.href);
      url.searchParams.delete("resume");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<DriverFormValues>) => {
      // Validate draft data using the relaxed validation schema
      try {
        await draftValidationSchema.validate(data, { abortEarly: false });
      } catch (validationError: any) {
        // For drafts, we'll log validation errors but still allow saving
        // Only throw if there are critical errors (like invalid email format)
        const criticalErrors = validationError.inner?.filter(
          (err: any) => err.type === "email" || err.type === "matches"
        );

        if (criticalErrors && criticalErrors.length > 0) {
          throw new Error(
            `Validation errors: ${criticalErrors
              .map((err: any) => err.message)
              .join(", ")}`
          );
        }

        // Log non-critical validation warnings
        console.warn("Draft validation warnings:", validationError.inner);
      }

      // Get device information
      const deviceInfo = getDeviceInfo();

      // Format the data for the API
      const draftData = {
        company_id: company?.id,
        first_name: data.firstName,
        last_name: data.lastName,
        dob: data.dob,
        phone: data.phone,
        email: data.email,
        current_address: data.currentAddress,
        current_city: data.currentCity,
        current_state: data.currentState,
        current_zip: data.currentZip,
        current_address_from_month: data.currentAddressFromMonth
          ? Number(data.currentAddressFromMonth)
          : undefined,
        current_address_from_year: data.currentAddressFromYear
          ? Number(data.currentAddressFromYear)
          : undefined,
        license_number: data.licenseNumber,
        license_state: data.licenseState,
        license_expiration_date: data.licenseExpirationDate,
        medical_card_expiration_date: data.medicalCardExpirationDate,
        position_applied_for: data.positionAppliedFor,
        addresses: data.addresses?.map((addr) => ({
          address: addr.address,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          fromMonth: Number(addr.fromMonth),
          fromYear: Number(addr.fromYear),
          toMonth: Number(addr.toMonth),
          toYear: Number(addr.toYear),
        })),
        jobs: data.jobs?.map((job) => ({
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
        })),
        social_security_number: data.socialSecurityNumber,
        // Consent fields
        fair_credit_reporting_act_consent:
          data.fairCreditReportingActConsentSignatureConsent,
        fmcsa_clearinghouse_consent:
          data.fmcsaClearinghouseConsentSignatureConsent,
        motor_vehicle_record_consent:
          data.motorVehicleRecordConsentSignatureConsent,
        drug_test_consent: data.drugTestConsentSignatureConsent,
        drug_test_question: data.drugTestQuestion,
        general_consent: data.generalConsentSignatureConsent,
        // Device and IP information
        device_info: deviceInfo,
      };

      const response = await apiRequest(
        "POST",
        "/api/v1/driver-applications/draft",
        draftData
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Draft Saved Successfully",
        description:
          "Your progress has been saved. Check your email for the resume link.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Save Draft",
        description:
          error.message ||
          "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resumeDraftMutation = useMutation({
    mutationFn: async (token: string) => {
      // Check retry count before attempting
      if (retryCountRef.current >= maxRetries) {
        throw new Error(
          "Maximum retry attempts reached. Please start a new application."
        );
      }

      const response = await apiRequest(
        "POST",
        "/api/v1/driver-applications/draft/resume",
        { token }
      );

      const responseData = await response.json();

      if (!response.ok) {
        // Increment retry count on error
        retryCountRef.current += 1;

        // Check if it's a token-related error
        if (responseData.message?.includes("Invalid or expired draft token")) {
          throw new Error(
            "This draft link has expired or is invalid. Please start a new application."
          );
        }

        throw new Error(responseData.message || "Failed to resume draft");
      }

      // Reset retry count on success
      retryCountRef.current = 0;
      return responseData;
    },
    onSuccess: (data) => {
      // Toast is handled in the component to avoid duplicates
    },
    onError: (error: Error) => {
      // Don't show toast for retry limit errors - let the component handle it
      if (!error.message.includes("Maximum retry attempts reached")) {
        toast({
          title: "Load Failed",
          description:
            error.message || "Failed to load draft. The link may have expired.",
          variant: "destructive",
        });
      }
    },
    // Disable automatic retries to prevent infinite loops
    retry: false,
  });

  // Convert DriverApplication to DriverFormValues
  const convertDraftToFormValues = useCallback(
    (draft: DriverApplication): Partial<DriverFormValues> => {
      return {
        firstName: draft.first_name,
        lastName: draft.last_name,
        dob: draft.dob,
        phone: draft.phone,
        email: draft.email,
        currentAddress: draft.current_address,
        currentCity: draft.current_city,
        currentState: draft.current_state,
        currentZip: draft.current_zip,
        currentAddressFromMonth: draft.current_address_from_month,
        currentAddressFromYear: draft.current_address_from_year,
        licenseNumber: draft.license_number,
        licenseState: draft.license_state,
        licenseExpirationDate: draft.license_expiration_date,
        medicalCardExpirationDate: draft.medical_card_expiration_date,
        positionAppliedFor: draft.position_applied_for,
        addresses:
          draft.addresses?.map((addr) => ({
            address: addr.address,
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            fromMonth: addr.fromMonth,
            fromYear: addr.fromYear,
            toMonth: addr.toMonth,
            toYear: addr.toYear,
          })) || [],
        jobs:
          draft.jobs?.map((job) => ({
            employerName: job.employerName,
            positionHeld: job.positionHeld,
            businessName: job.businessName,
            companyEmail: job.companyEmail,
            companyPhone: job.companyPhone,
            reasonForLeaving: job.reasonForLeaving,
            fromMonth: job.fromMonth,
            fromYear: job.fromYear,
            toMonth: job.toMonth,
            toYear: job.toYear,
          })) || [],
        socialSecurityNumber: draft.social_security_number,
        // Consent fields
        fairCreditReportingActConsentSignatureConsent:
          draft.fair_credit_reporting_act_consent,
        fmcsaClearinghouseConsentSignatureConsent:
          draft.fmcsa_clearinghouse_consent,
        motorVehicleRecordConsentSignatureConsent:
          draft.motor_vehicle_record_consent,
        drugTestConsentSignatureConsent: draft.drug_test_consent,
        drugTestQuestion: draft.drug_test_question,
        generalConsentSignatureConsent: draft.general_consent,
      };
    },
    []
  );

  // Reset retry count when token changes
  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  return {
    saveDraft: saveDraftMutation.mutate,
    resumeDraft: resumeDraftMutation.mutate,
    isSavingDraft: saveDraftMutation.isPending,
    isResumingDraft: resumeDraftMutation.isPending,
    resumeToken,
    convertDraftToFormValues,
    draftData: resumeDraftMutation.data?.data,
    resetRetryCount,
    retryCount: retryCountRef.current,
    maxRetries,
    cleanupUrl,
  };
};
