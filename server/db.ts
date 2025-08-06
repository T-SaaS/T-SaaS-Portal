import type {
  DriverApplication,
  InsertDriverApplication,
} from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error(
    "VITE_SUPABASE_URL must be set. Did you forget to set up your Supabase project?"
  );
}

// Use service role key for server-side operations (higher permissions)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY must be set. This is needed for server-side operations."
  );
}

// Create Supabase client for server-side operations
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  supabaseKey,
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
    const companyId = data.company_id;

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

  async getDriverApplication(id: string) {
    const { data: application, error } = await supabase
      .from("driver_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return application;
  },

  async updateDriverApplication(
    id: string,
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

  async getCompanyBySlug(slug: string) {
    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }
    return company;
  },

  async getCompanyById(id: string) {
    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }
    return company;
  },

  async getAllCompanies() {
    const { data: companies, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return companies;
  },
};
