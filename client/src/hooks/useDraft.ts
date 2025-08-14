import { useCompanyContext } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import { getDeviceInfo } from "@/utils/deviceInfo";
import type { DriverApplication } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useDraft = () => {
  const { toast } = useToast();
  const { company } = useCompanyContext();
  const [searchParams] = useSearchParams();

  // Check if there's a resume token in the URL
  const resumeToken = searchParams.get("resume");

  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<DriverFormValues>) => {
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
          companyEmail: job.companyEmail,
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
        // Device info
        device_info: deviceInfo,
      };

      const response = await apiRequest(
        "POST",
        "/api/v1/driver-applications/draft",
        draftData
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save draft");
      }

      return responseData;
    },
    onSuccess: () => {
      toast({
        title: "Draft Saved",
        description:
          "Your progress has been saved. Check your email for the resume link.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resumeDraftMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest(
        "POST",
        "/api/v1/driver-applications/draft/resume",
        { token }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to resume draft");
      }

      return responseData;
    },
    onSuccess: (data) => {
      // Toast is handled in the component to avoid duplicates
    },
    onError: (error: Error) => {
      toast({
        title: "Load Failed",
        description:
          error.message || "Failed to load draft. The link may have expired.",
        variant: "destructive",
      });
    },
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
            companyEmail: job.companyEmail,
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

  return {
    saveDraft: saveDraftMutation.mutate,
    resumeDraft: resumeDraftMutation.mutate,
    isSavingDraft: saveDraftMutation.isPending,
    isResumingDraft: resumeDraftMutation.isPending,
    resumeToken,
    convertDraftToFormValues,
    draftData: resumeDraftMutation.data?.data,
  };
};
