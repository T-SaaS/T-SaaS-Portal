import { ObjectSchema } from "yup";

export type ValidationSchema = ObjectSchema<any>;

export type ValidationError = {
  type: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, ValidationError>;
};

export type FieldValidation = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
};

export type FormValidationConfig = {
  [key: string]: FieldValidation;
};

export type StepValidationConfig = {
  step: number;
  fields: FormValidationConfig;
};
