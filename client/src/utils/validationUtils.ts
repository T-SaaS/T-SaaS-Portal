import {
  completeFormSchema,
  draftValidationSchema,
  stepSchemas,
} from "@/schemas/driverFormSchemas";
import type { DriverFormValues } from "@/types/driverApplicationForm";

export type ValidationMode = "draft" | "step" | "complete" | "submission";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

/**
 * Validates form data based on the specified mode
 */
export const validateFormData = async (
  data: Partial<DriverFormValues>,
  mode: ValidationMode,
  currentStep?: number
): Promise<ValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  try {
    switch (mode) {
      case "draft":
        // Use relaxed validation for drafts
        await draftValidationSchema.validate(data, { abortEarly: false });
        break;

      case "step":
        // Validate current step only
        if (currentStep !== undefined && stepSchemas[currentStep]) {
          await stepSchemas[currentStep].validate(data, { abortEarly: false });
        }
        break;

      case "complete":
        // Validate entire form
        await completeFormSchema.validate(data, { abortEarly: false });
        break;

      case "submission":
        // Use strict validation for final submission
        await completeFormSchema.validate(data, { abortEarly: false });
        break;

      default:
        throw new Error(`Unknown validation mode: ${mode}`);
    }

    return { isValid: true, errors: {}, warnings: {} };
  } catch (validationError: any) {
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        const fieldPath = err.path || err.field;
        if (fieldPath) {
          if (mode === "draft") {
            // For drafts, treat most errors as warnings except critical ones
            if (err.type === "email" || err.type === "matches") {
              errors[fieldPath] = err.message;
            } else {
              warnings[fieldPath] = err.message;
            }
          } else {
            // For other modes, all errors are critical
            errors[fieldPath] = err.message;
          }
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
    };
  }
};

/**
 * Checks if the current step data is valid for proceeding to the next step
 */
export const validateStepForProgression = async (
  data: Partial<DriverFormValues>,
  currentStep: number
): Promise<ValidationResult> => {
  return validateFormData(data, "step", currentStep);
};

/**
 * Checks if the form data is valid for draft saving
 */
export const validateForDraftSaving = async (
  data: Partial<DriverFormValues>
): Promise<ValidationResult> => {
  return validateFormData(data, "draft");
};

/**
 * Checks if the form data is valid for final submission
 */
export const validateForSubmission = async (
  data: DriverFormValues
): Promise<ValidationResult> => {
  return validateFormData(data, "submission");
};

/**
 * Gets validation requirements for a specific step
 */
export const getStepValidationRequirements = (step: number): string[] => {
  if (step < 0 || step >= stepSchemas.length) {
    return [];
  }

  const schema = stepSchemas[step];
  const requirements: string[] = [];

  // Extract required fields from the schema
  Object.keys(schema.fields).forEach((fieldName) => {
    const field = schema.fields[fieldName];
    if (field && field.tests) {
      const requiredTest = field.tests.find(
        (test: any) => test.name === "required" || test.OPTIONS?.required
      );
      if (requiredTest) {
        requirements.push(fieldName);
      }
    }
  });

  return requirements;
};

/**
 * Checks if a field is required for the current step
 */
export const isFieldRequiredForStep = (
  fieldName: string,
  step: number
): boolean => {
  const requirements = getStepValidationRequirements(step);
  return requirements.includes(fieldName);
};

/**
 * Gets a user-friendly description of what's required for the current step
 */
export const getStepRequirementsDescription = (step: number): string => {
  const requirements = getStepValidationRequirements(step);

  if (requirements.length === 0) {
    return "No specific requirements for this step.";
  }

  const fieldDescriptions: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    dob: "Date of Birth",
    socialSecurityNumber: "Social Security Number",
    positionAppliedFor: "Position Applied For",
    phone: "Phone Number",
    email: "Email Address",
    currentAddress: "Current Address",
    currentCity: "Current City",
    currentState: "Current State",
    currentZip: "Current ZIP Code",
    currentAddressFromMonth: "Move-in Month",
    currentAddressFromYear: "Move-in Year",
    licenseNumber: "License Number",
    licenseState: "License State",
    licenseExpirationDate: "License Expiration Date",
    medicalCardExpirationDate: "Medical Card Expiration Date",
    addresses: "Address History",
    jobs: "Employment History",
    licensePhoto: "License Photo",
    medicalCardPhoto: "Medical Card Photo",
    // Add more field descriptions as needed
  };

  const descriptions = requirements.map(
    (field) => fieldDescriptions[field] || field
  );

  if (descriptions.length === 1) {
    return `${descriptions[0]} is required.`;
  } else if (descriptions.length === 2) {
    return `${descriptions[0]} and ${descriptions[1]} are required.`;
  } else {
    const last = descriptions.pop();
    return `${descriptions.join(", ")}, and ${last} are required.`;
  }
};





