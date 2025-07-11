export const STEP_TITLES = [
  "Personal Information",
  "Contact & Address",
  "License Information",
  "Address History",
  "Employment History",
  "Background Check",
] as const;

export const STEP_LABELS = [
  "Personal Info",
  "Contact & Address",
  "License Info",
  "Address History",
  "Employment",
  "Background Check",
] as const;

export type StepTitle = (typeof STEP_TITLES)[number];
export type StepLabel = (typeof STEP_LABELS)[number];

export type StepConfig = {
  id: number;
  title: StepTitle;
  label: StepLabel;
  isRequired: boolean;
  canSkip?: boolean;
  skipCondition?: () => boolean;
};

export type StepNavigation = {
  canGoNext: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
};

export type StepValidation = {
  isValid: boolean;
  errors: Record<string, string>;
};
