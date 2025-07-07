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

export const insertDriverApplicationSchema = createInsertSchema(driverApplications).omit({
  id: true,
  submittedAt: true,
}).extend({
  addresses: z.array(addressSchema),
  jobs: z.array(jobSchema).min(1, "At least one job is required"),
});

export type InsertDriverApplication = z.infer<typeof insertDriverApplicationSchema>;
export type DriverApplication = typeof driverApplications.$inferSelect;
export type Address = z.infer<typeof addressSchema>;
export type Job = z.infer<typeof jobSchema>;
