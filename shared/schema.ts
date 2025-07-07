import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const driverApplications = pgTable("driver_applications", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: text("dob").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  currentAddress: text("current_address").notNull(),
  currentCity: text("current_city").notNull(),
  currentState: text("current_state").notNull(),
  currentZip: text("current_zip").notNull(),
  currentAddressFromMonth: integer("current_address_from_month").notNull(),
  currentAddressFromYear: integer("current_address_from_year").notNull(),
  licenseNumber: text("license_number").notNull(),
  licenseState: text("license_state").notNull(),
  positionAppliedFor: text("position_applied_for").notNull(),
  addresses: jsonb("addresses").notNull(),
  jobs: jsonb("jobs").notNull(),
  // Background check fields
  socialSecurityNumber: text("social_security_number").default("000-00-0000").notNull(),
  consentToBackgroundCheck: integer("consent_to_background_check").default(0).notNull(), // 1 for true, 0 for false
  backgroundCheckStatus: text("background_check_status").default("pending"), // pending, in_progress, completed, failed
  backgroundCheckResults: jsonb("background_check_results"),
  backgroundCheckCompletedAt: timestamp("background_check_completed_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

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
  fromMonth: z.number().min(1).max(12),
  fromYear: z.number().min(1900),
  toMonth: z.number().min(1).max(12),
  toYear: z.number().min(1900),
});

export const backgroundCheckResultSchema = z.object({
  criminalHistory: z.boolean(),
  drivingRecord: z.object({
    violations: z.array(z.object({
      type: z.string(),
      date: z.string(),
      severity: z.enum(["minor", "major", "serious"]),
    })),
    suspensions: z.array(z.object({
      reason: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })),
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

export const insertDriverApplicationSchema = createInsertSchema(driverApplications).omit({
  id: true,
  submittedAt: true,
  backgroundCheckStatus: true,
  backgroundCheckResults: true,
  backgroundCheckCompletedAt: true,
}).extend({
  addresses: z.array(addressSchema),
  jobs: z.array(jobSchema).min(1, "At least one job is required"),
  consentToBackgroundCheck: z.number().min(1, "Background check consent is required"),
});

export type InsertDriverApplication = z.infer<typeof insertDriverApplicationSchema>;
export type DriverApplication = typeof driverApplications.$inferSelect;
export type Address = z.infer<typeof addressSchema>;
export type Job = z.infer<typeof jobSchema>;
export type BackgroundCheckResult = z.infer<typeof backgroundCheckResultSchema>;
