import { z } from "zod";

// TypeScript interfaces for database types
export interface Company {
  id: string; // Changed from number to string (UUID)
  name: string;
  slug: string;
  domain?: string;
  settings: Record<string, any>;
  logs?: LogEntry[]; // JSONB column for storing logs
  created_at: string;
  updated_at: string;
}

// Device information structure
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  language: string;
  timezone: string;
  touchSupport: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
}

// Signature data structures (defined via Zod schemas below)
// - SignatureRequestData: includes data field for API calls
// - SignatureData: no data field for database storage

// Document photo data structure for database (no data field since stored in bucket)
// Interface is defined via Zod schema below

export interface DriverApplication {
  id: string; // Changed from number to string (UUID)
  company_id: string; // Changed from number to string (UUID)
  first_name: string;
  last_name: string;
  status:
    | "New"
    | "Reviewing Application"
    | "On Hold"
    | "Signed Consents"
    | "Run MVR"
    | "Drug Screening"
    | "Pre-Employment"
    | "Hire Driver"
    | "Approved"
    | "Rejected"
    | "Disqualified"
    | "Expired"
    | "Not Hired";
  dob: string;
  phone: string;
  email: string;
  current_address: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  current_address_from_month: number;
  current_address_from_year: number;
  license_number: string;
  license_state: string;
  license_expiration_date: string;
  medical_card_expiration_date: string;
  position_applied_for: string;
  addresses: Address[];
  jobs: Job[];
  // Background check fields
  social_security_number: string;
  consent_to_background_check: boolean;
  background_check_status?: string; // pending, in_progress, completed, failed
  background_check_results?: BackgroundCheckResult;
  background_check_completed_at?: string;
  // Consent fields
  fair_credit_reporting_act_consent?: boolean;
  fmcsa_clearinghouse_consent?: boolean;
  motor_vehicle_record_consent?: boolean;
  drug_test_consent?: boolean;
  drug_test_question?: string;
  general_consent?: boolean;
  // Signature fields (stored in database without data)
  fair_credit_reporting_act_consent_signature?: z.infer<
    typeof signatureDataSchema
  >;
  fmcsa_clearinghouse_consent_signature?: z.infer<typeof signatureDataSchema>;
  motor_vehicle_record_consent_signature?: z.infer<typeof signatureDataSchema>;
  drug_test_consent_signature?: z.infer<typeof signatureDataSchema>;
  general_consent_signature?: z.infer<typeof signatureDataSchema>;
  // Document photo fields (stored in separate bucket)
  license_photo?: z.infer<typeof documentPhotoDataSchema>;
  medical_card_photo?: z.infer<typeof documentPhotoDataSchema>;
  // Device and IP information (captured once per application)
  device_info?: DeviceInfo;
  ip_address?: string;
  logs?: LogEntry[]; // JSONB column for storing logs
  submitted_at: string;
}

// Driver interface for converted applications
export interface Driver {
  id: string; // UUID
  company_id: string; // UUID
  application_id: string; // Reference to the original application
  first_name: string;
  last_name: string;
  status: "active" | "out_of_duty" | "no_longer_employed";
  dob: string;
  phone: string;
  email: string;
  current_address: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  current_address_from_month: number;
  current_address_from_year: number;
  license_number: string;
  license_state: string;
  license_expiration_date: string;
  medical_card_expiration_date: string;
  position: string; // Converted from position_applied_for
  // Document photo fields (stored in separate bucket)
  license_photo?: z.infer<typeof documentPhotoDataSchema>;
  medical_card_photo?: z.infer<typeof documentPhotoDataSchema>;
  // Employment dates
  hire_date: string;
  termination_date?: string;
  // Additional driver-specific fields
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  notes?: string;
  logs?: LogEntry[]; // JSONB column for storing logs
  created_at: string;
  updated_at: string;
}

export const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  fromMonth: z.number().min(1).max(12),
  fromYear: z.number().min(1900),
  toMonth: z.number().min(1).max(12),
  toYear: z.number().min(1900),
});

export const jobSchema = z.object({
  employerName: z.string().min(1, "Employer Name is required"),
  positionHeld: z.string().min(1, "Position Held is required"),
  companyEmail: z.string().email().optional(),
  fromMonth: z.number().min(1).max(12),
  fromYear: z.number().min(1900),
  toMonth: z.number().min(1).max(12),
  toYear: z.number().min(1900),
});

export const backgroundCheckResultSchema = z.object({
  criminalHistory: z.boolean(),
  drivingRecord: z.object({
    violations: z.array(
      z.object({
        type: z.string(),
        date: z.string(),
        severity: z.enum(["minor", "major", "serious"]),
      })
    ),
    suspensions: z.array(
      z.object({
        reason: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    ),
    overallScore: z.enum(["excellent", "good", "fair", "poor"]),
  }),
  employmentVerification: z.object({
    verified: z.boolean(),
    discrepancies: z.array(z.string()),
  }),
  drugTest: z.object({
    status: z.enum(["passed", "failed", "pending"]),
    completedAt: z.string().optional(),
  }),
});

// Document photo data schema (no data field since stored in bucket)
export const documentPhotoDataSchema = z.object({
  uploaded: z.boolean(),
  url: z.string().optional(),
  signedUrl: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
  filename: z.string().optional(),
  contentType: z.string().optional(),
  size: z.number().optional(),
});

// Signature data schema for database storage (no data field)
export const signatureDataSchema = z.object({
  uploaded: z.boolean(),
  url: z.string().optional(),
  signedUrl: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
});

// Signature request schema for API calls (includes data field)
export const signatureRequestDataSchema = z.object({
  data: z.string().nullable(),
  uploaded: z.boolean(),
  url: z.string().optional(),
  signedUrl: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
});

// Zod schema for inserting new driver applications
export const insertDriverApplicationSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"), // Changed from z.number() to z.string()
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  current_address: z.string().min(1, "Current address is required"),
  current_city: z.string().min(1, "Current city is required"),
  current_state: z.string().min(1, "Current state is required"),
  current_zip: z.string().min(1, "Current ZIP code is required"),
  current_address_from_month: z.number().min(1).max(12),
  current_address_from_year: z.number().min(1900),
  license_number: z.string().min(1, "License number is required"),
  license_state: z.string().min(1, "License state is required"),
  license_expiration_date: z.string().optional(),
  medical_card_expiration_date: z.string().optional(),
  position_applied_for: z.string().min(1, "Position applied for is required"),
  addresses: z.array(addressSchema),
  jobs: z.array(jobSchema).min(1, "At least one job is required"),
  social_security_number: z.string().default("000-00-0000"),
  // Consent fields
  fair_credit_reporting_act_consent: z.boolean().optional(),
  fmcsa_clearinghouse_consent: z.boolean().optional(),
  motor_vehicle_record_consent: z.boolean().optional(),
  drug_test_consent: z.boolean().optional(),
  drug_test_question: z.string().optional(),
  general_consent: z.boolean().optional(),
  // Device and IP information (captured once per application)
  device_info: z.any().optional(),
  ip_address: z.string().optional(),
  // Signature fields (no data field - stored in bucket)
  fair_credit_reporting_act_consent_signature: signatureDataSchema.optional(),
  fmcsa_clearinghouse_consent_signature: signatureDataSchema.optional(),
  motor_vehicle_record_consent_signature: signatureDataSchema.optional(),
  drug_test_consent_signature: signatureDataSchema.optional(),
  general_consent_signature: signatureDataSchema.optional(),
  // Document photo fields (no data field - stored in bucket)
  license_photo: documentPhotoDataSchema.optional(),
  medical_card_photo: documentPhotoDataSchema.optional(),
});

// Zod schema for creating a new driver from an application
export const createDriverSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  application_id: z.string().min(1, "Application ID is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  status: z
    .enum(["active", "out_of_duty", "no_longer_employed"])
    .default("active"),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  current_address: z.string().min(1, "Current address is required"),
  current_city: z.string().min(1, "Current city is required"),
  current_state: z.string().min(1, "Current state is required"),
  current_zip: z.string().min(1, "Current ZIP code is required"),
  current_address_from_month: z.number().min(1).max(12),
  current_address_from_year: z.number().min(1900),
  license_number: z.string().min(1, "License number is required"),
  license_state: z.string().min(1, "License state is required"),
  license_expiration_date: z.string().optional(),
  medical_card_expiration_date: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  license_photo: documentPhotoDataSchema.optional(),
  medical_card_photo: documentPhotoDataSchema.optional(),
  hire_date: z.string().min(1, "Hire date is required"),
  termination_date: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  notes: z.string().optional(),
});

// Zod schema for updating a driver
export const updateDriverSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  status: z.enum(["active", "out_of_duty", "no_longer_employed"]).optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  current_address: z.string().min(1, "Current address is required").optional(),
  current_city: z.string().min(1, "Current city is required").optional(),
  current_state: z.string().min(1, "Current state is required").optional(),
  current_zip: z.string().min(1, "Current ZIP code is required").optional(),
  current_address_from_month: z.number().min(1).max(12).optional(),
  current_address_from_year: z.number().min(1900).optional(),
  license_number: z.string().min(1, "License number is required").optional(),
  license_state: z.string().min(1, "License state is required").optional(),
  license_expiration_date: z.string().optional(),
  medical_card_expiration_date: z.string().optional(),
  position: z.string().min(1, "Position is required").optional(),
  license_photo: documentPhotoDataSchema.optional(),
  medical_card_photo: documentPhotoDataSchema.optional(),
  termination_date: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertDriverApplication = z.infer<
  typeof insertDriverApplicationSchema
>;
export type Address = z.infer<typeof addressSchema>;
export type Job = z.infer<typeof jobSchema>;
export type BackgroundCheckResult = z.infer<typeof backgroundCheckResultSchema>;
export type DocumentPhotoData = z.infer<typeof documentPhotoDataSchema>;
export type SignatureData = z.infer<typeof signatureDataSchema>;
export type SignatureRequestData = z.infer<typeof signatureRequestDataSchema>;
export type CreateDriver = z.infer<typeof createDriverSchema>;
export type UpdateDriver = z.infer<typeof updateDriverSchema>;

// Simple log entry interface for JSONB storage
export interface LogEntry {
  id: string; // UUID
  action: string; // The action performed
  user_id?: string; // UUID of the user performing the action
  user_email?: string; // Email of the user performing the action
  changes?: Record<string, any>; // What changed (before/after for updates)
  metadata?: Record<string, any>; // Additional context
  success: boolean;
  error_message?: string;
  created_at: string;
}
