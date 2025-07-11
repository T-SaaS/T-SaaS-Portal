import { stepSchemas } from "@/schemas/driverFormSchemas";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const useDriverApplicationForm = (currentStep: number) => {
  const form = useForm<DriverFormValues>({
    resolver: (values) => {
      try {
        stepSchemas[currentStep].validateSync(values, { abortEarly: false });
        return {
          values,
          errors: {},
        };
      } catch (error: any) {
        if (error.inner) {
          const errors: any = {};
          error.inner.forEach((err: any) => {
            errors[err.path] = {
              type: err.type,
              message: err.message,
            };
          });
          return {
            values,
            errors,
          };
        }
        return {
          values,
          errors: {},
        };
      }
    },
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
      positionAppliedFor: "",
      addresses: [],
      jobs: [],
      socialSecurityNumber: "",
      consentToBackgroundCheck: 0,
    },
    mode: "onTouched",
  });

  // Clear errors when step changes
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);

  const validateCurrentStep = async () => {
    return await form.trigger();
  };

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
