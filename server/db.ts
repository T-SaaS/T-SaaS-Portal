import type {
  CreateDriver,
  DriverApplication,
  InsertDriverApplication,
  LogEntry,
  UpdateDriver,
} from "@shared/schema";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

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

// Create Supabase client for server-side operations (with service role key)
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

// Create a separate Supabase client for authentication (with anon key)
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_ANON_KEY must be set for authentication operations"
  );
}

export const supabaseAuth = createClient(
  process.env.VITE_SUPABASE_URL,
  supabaseAnonKey,
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

  // Driver operations
  async createDriver(data: CreateDriver) {
    const { data: driver, error } = await supabase
      .from("drivers")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating driver:", error);
      throw error;
    }
    return driver;
  },

  async getAllDrivers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from("drivers")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Get paginated data
    const { data: drivers, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: drivers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    };
  },

  async getDriver(id: string) {
    const { data: driver, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return driver;
  },

  async updateDriver(id: string, updates: UpdateDriver) {
    const { data: driver, error } = await supabase
      .from("drivers")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return driver;
  },

  async deleteDriver(id: string) {
    const { error } = await supabase.from("drivers").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  },

  async getDriversByCompany(
    companyId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from("drivers")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId);

    if (countError) throw countError;

    // Get paginated data
    const { data: drivers, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: drivers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    };
  },

  // Helper function to append a log entry to an entity's logs array
  async appendLogToEntity(
    tableName: "companies" | "driver_applications" | "drivers",
    entityId: string,
    logEntry: Omit<LogEntry, "id" | "created_at">
  ) {
    const newLogEntry: LogEntry = {
      ...logEntry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    console.log(`Attempting to append log to ${tableName}:${entityId}:`, {
      logEntry: newLogEntry,
      user_id: logEntry.user_id,
      user_email: logEntry.user_email,
    });

    // Get current logs array
    const { data: currentEntity, error: fetchError } = await supabase
      .from(tableName)
      .select("logs")
      .eq("id", entityId)
      .single();

    if (fetchError) {
      console.error(
        `Error fetching current logs from ${tableName}:`,
        fetchError
      );
      throw fetchError;
    }

    // Append new log entry to existing logs
    const currentLogs = (currentEntity?.logs as LogEntry[]) || [];
    const updatedLogs = [...currentLogs, newLogEntry];

    console.log(
      `Updating ${tableName}:${entityId} with ${updatedLogs.length} logs`
    );

    // Update the entity with new logs array
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ logs: updatedLogs })
      .eq("id", entityId);

    if (updateError) {
      console.error(`Error updating logs in ${tableName}:`, updateError);
      throw updateError;
    }

    console.log(`Successfully appended log to ${tableName}:${entityId}`);
    return newLogEntry;
  },

  // Helper function to get logs from an entity
  async getEntityLogs(
    tableName: "companies" | "driver_applications" | "drivers",
    entityId: string
  ) {
    const { data: entity, error } = await supabase
      .from(tableName)
      .select("logs")
      .eq("id", entityId)
      .single();

    if (error) throw error;

    return (entity?.logs as LogEntry[]) || [];
  },
};
