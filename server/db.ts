import type {
  DriverApplication,
  InsertDriverApplication,
} from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

if (!process.env.REACT_APP_SUPABASE_URL) {
  throw new Error(
    "REACT_APP_SUPABASE_URL must be set. Did you forget to set up your Supabase project?"
  );
}

if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
  throw new Error(
    "REACT_APP_SUPABASE_ANON_KEY must be set. This is needed for server-side operations."
  );
}

// Create Supabase client for server-side operations
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database operations using Supabase
export const db = {
  async createDriverApplication(data: InsertDriverApplication) {
    // Ensure company_id exists, default to 1 if not provided
    const companyId = data.company_id || 1;

    const { data: application, error } = await supabase
      .from("driver_applications")
      .insert({
        ...data,
        company_id: companyId,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating driver application:", error);
      throw error;
    }
    return application;
  },

  async getAllDriverApplications() {
    const { data: applications, error } = await supabase
      .from("driver_applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return applications;
  },

  async getDriverApplication(id: number) {
    const { data: application, error } = await supabase
      .from("driver_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return application;
  },

  async updateDriverApplication(
    id: number,
    updates: Partial<DriverApplication>
  ) {
    const { data: application, error } = await supabase
      .from("driver_applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return application;
  },
};
