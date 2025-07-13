import { z } from "zod";

// TypeScript interfaces for database types
export interface Company {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DriverApplication {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  status: string;
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
  position_applied_for: string;
  addresses: Address[];
  jobs: Job[];
  // Background check fields
  social_security_number: string;
  consent_to_background_check: number; // 1 for true, 0 for false
  background_check_status?: string; // pending, in_progress, completed, failed
  background_check_results?: BackgroundCheckResult;
  background_check_completed_at?: string;
  submitted_at: string;
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
  businessName: z.string().optional(),
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

// Zod schema for inserting new driver applications
export const insertDriverApplicationSchema = z.object({
  company_id: z.number().min(1, "Company ID is required"),
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
  position_applied_for: z.string().min(1, "Position applied for is required"),
  addresses: z.array(addressSchema),
  jobs: z.array(jobSchema).min(1, "At least one job is required"),
  social_security_number: z.string().default("000-00-0000"),
  consent_to_background_check: z
    .number()
    .min(1, "Background check consent is required"),
});

export type InsertDriverApplication = z.infer<
  typeof insertDriverApplicationSchema
>;
export type Address = z.infer<typeof addressSchema>;
export type Job = z.infer<typeof jobSchema>;
export type BackgroundCheckResult = z.infer<typeof backgroundCheckResultSchema>;
