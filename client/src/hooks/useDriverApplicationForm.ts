import { stepSchemas } from "@/schemas/driverFormSchemas";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import {
  validateForDraftSaving,
  validateForSubmission,
  validateStepForProgression,
} from "@/utils/validationUtils";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export const useDriverApplicationForm = (currentStep: number) => {
  const form = useForm<DriverFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      email: "",
      currentAddress: "",
      currentCity: "",
      currentState: "",
      currentZip: "",
      currentAddressFromMonth: new Date().getMonth() + 1,
      currentAddressFromYear: new Date().getFullYear(),
      licenseNumber: "",
      licenseState: "",
      licenseExpirationDate: "",
      medicalCardExpirationDate: "",
      positionAppliedFor: "",
      licensePhoto: null,
      medicalCardPhoto: null,
      addresses: [],
      jobs: [],
      socialSecurityNumber: "",
      // Signature fields for the new form structure
      fairCreditReportingActConsentSignature: { data: null, uploaded: false },
      fairCreditReportingActConsentSignatureConsent: false,
      fmcsaClearinghouseConsentSignature: { data: null, uploaded: false },
      fmcsaClearinghouseConsentSignatureConsent: false,
      motorVehicleRecordConsentSignature: { data: null, uploaded: false },
      motorVehicleRecordConsentSignatureConsent: false,
      drugTestConsentSignature: { data: null, uploaded: false },
      drugTestConsentSignatureConsent: false,
      drugTestQuestion: "",
      generalConsentSignature: { data: null, uploaded: false },
      generalConsentSignatureConsent: false,
    },
    mode: "onTouched",
  });

  // Clear errors when step changes
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  const validateCurrentStep = useCallback(async () => {
    try {
      const values = form.getValues();
      const result = await validateStepForProgression(values, currentStep);

      // Clear any existing errors for this step
      const stepFields = stepSchemas[currentStep]?.fields || {};
      Object.keys(stepFields).forEach((field) => {
        form.clearErrors(field as keyof DriverFormValues);
      });

      // Set errors if validation failed
      if (!result.isValid) {
        Object.entries(result.errors).forEach(([field, message]) => {
          form.setError(field as keyof DriverFormValues, {
            type: "validation",
            message,
          });
        });
      }

      return result.isValid;
    } catch (error) {
      console.error("Step validation error:", error);
      return false;
    }
  }, [currentStep, form]);

  const validateForDraft = useCallback(async () => {
    try {
      const values = form.getValues();
      const result = await validateForDraftSaving(values);

      // For drafts, we only show critical errors (like invalid email format)
      // Warnings are logged but don't prevent saving
      if (!result.isValid) {
        Object.entries(result.errors).forEach(([field, message]) => {
          form.setError(field as keyof DriverFormValues, {
            type: "validation",
            message,
          });
        });
      }

      // Log warnings for debugging
      if (result.warnings) {
        console.warn("Draft validation warnings:", result.warnings);
      }

      return result.isValid;
    } catch (error) {
      console.error("Draft validation error:", error);
      return false;
    }
  }, [form]);

  const validateForFinalSubmission = useCallback(async () => {
    try {
      const values = form.getValues();
      const result = await validateForSubmission(values);

      if (!result.isValid) {
        Object.entries(result.errors).forEach(([field, message]) => {
          form.setError(field as keyof DriverFormValues, {
            type: "validation",
            message,
          });
        });
      }

      return result.isValid;
    } catch (error) {
      console.error("Submission validation error:", error);
      return false;
    }
  }, [form]);

  const getFormValues = () => {
    return form.getValues();
  };

  const setFormValues = (values: Partial<DriverFormValues>) => {
    form.reset({ ...form.getValues(), ...values });
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    validateCurrentStep,
    validateForDraft,
    validateForFinalSubmission,
    getFormValues,
    setFormValues,
    resetForm,
  };
};
