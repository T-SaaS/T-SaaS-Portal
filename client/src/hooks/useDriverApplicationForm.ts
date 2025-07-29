import { stepSchemas } from "@/schemas/driverFormSchemas";
import type { DriverFormValues } from "@/types/driverApplicationForm";
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
      stepSchemas[currentStep].validateSync(values, { abortEarly: false });

      // Clear any existing errors for this step
      const stepFields = stepSchemas[currentStep].fields;
      Object.keys(stepFields).forEach((field) => {
        form.clearErrors(field as keyof DriverFormValues);
      });

      return true;
    } catch (error: any) {
      if (error.inner) {
        const errors: any = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = {
            type: err.type,
            message: err.message,
          };
        });

        // Set errors for the current step fields only
        Object.keys(errors).forEach((field) => {
          form.setError(field as keyof DriverFormValues, {
            type: errors[field].type,
            message: errors[field].message,
          });
        });
      }
      return false;
    }
  }, [currentStep, form]);

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
    getFormValues,
    setFormValues,
    resetForm,
  };
};
