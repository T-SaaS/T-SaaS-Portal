import type {
  DriverFormValues,
  FormStepConfig,
} from "@/types/driverApplicationForm";

// Helper function to get fields for each step
export const getStepFields = (step: number): (keyof DriverFormValues)[] => {
  switch (step) {
    case 0:
      return ["firstName", "lastName", "dob", "socialSecurityNumber"];
    case 1:
      return [
        "phone",
        "email",
        "currentAddress",
        "currentCity",
        "currentState",
        "currentZip",
        "currentAddressFromMonth",
        "currentAddressFromYear",
      ];
    case 2:
      return [
        "licenseNumber",
        "licenseState",
        "licenseExpirationDate",
        "medicalCardExpirationDate",
        "positionAppliedFor",
      ];
    case 3:
      return ["addresses"];
    case 4:
      return ["jobs"];
    case 5:
      return [
        "backgroundCheckConsentSignature",
        "employmentConsentSignature",
        "drugTestConsentSignature",
        "motorVehicleRecordConsentSignature",
        "generalConsentSignature",
      ];
    default:
      return [];
  }
};

export const stepConfigs: FormStepConfig[] = [
  {
    title: "Personal Information",
    label: "Personal Info",
    fields: getStepFields(0),
  },
  {
    title: "Contact & Address",
    label: "Contact & Address",
    fields: getStepFields(1),
  },
  {
    title: "License Information",
    label: "License Info",
    fields: getStepFields(2),
  },
  {
    title: "Address History",
    label: "Address History",
    fields: getStepFields(3),
  },
  {
    title: "Employment History",
    label: "Employment",
    fields: getStepFields(4),
  },
  {
    title: "Consents & Signatures",
    label: "Consents",
    fields: getStepFields(5),
  },
];

export const getStepConfig = (step: number): FormStepConfig => {
  return stepConfigs[step] || stepConfigs[0];
};

export const getStepTitle = (step: number): string => {
  return stepConfigs[step]?.title || "Unknown Step";
};

export const getStepLabel = (step: number): string => {
  return stepConfigs[step]?.label || "Unknown";
};

export const getTotalSteps = (): number => {
  return stepConfigs.length;
};
