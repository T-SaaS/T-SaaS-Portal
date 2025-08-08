import type { LogEntry } from "@shared/schema";
import { db, supabaseAuth } from "../db";

export interface LoggingContext {
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  device_info?: any;
  user_agent?: string;
  referer?: string;
}

export type EntityType = "companies" | "driver_applications" | "drivers";

export class LoggingService {
  private context: LoggingContext;

  constructor(context: LoggingContext = {}) {
    this.context = context;
  }

  // Helper method to extract context from an Express request
  static async extractContextFromRequest(req: any): Promise<LoggingContext> {
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.headers["x-real-ip"]?.toString() ||
      "unknown";

    let user_id: string | null = null;
    let user_email: string | null = null;

    // Try to get user info from Authorization header
    const authHeader = req.headers["authorization"];
    console.log(
      "Auth header found:",
      !!authHeader,
      "Starts with Bearer:",
      authHeader?.startsWith("Bearer ")
    );

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      console.log(
        "Token length:",
        token.length,
        "Token starts with:",
        token.substring(0, 20) + "..."
      );

      try {
        const {
          data: { user },
          error,
        } = await supabaseAuth.auth.getUser(token);

        console.log("Supabase auth response:", {
          user: !!user,
          error: !!error,
          errorDetails: error,
        });

        if (!error && user) {
          user_id = user.id || null;
          user_email = user.email || null;
          console.log("User extracted from token:", { user_id, user_email });
        } else {
          console.log("Failed to extract user from token:", { error });
        }
      } catch (error) {
        console.error("Error extracting user from token:", error);
      }
    } else {
      console.log("No Authorization header found");
    }

    return {
      ip_address: ipAddress,
      user_agent: req.headers["user-agent"] || "unknown",
      referer: req.headers["referer"] || "unknown",
      device_info: req.body?.device_info || null,
      user_id: user_id || undefined,
      user_email: user_email || undefined,
    };
  }

  // Generic logging method that can handle any entity type and action
  async log(
    entityType: EntityType,
    entityId: string,
    action: string,
    options?: {
      changes?: Record<string, any>;
      metadata?: Record<string, any>;
      success?: boolean;
      error_message?: string;
    }
  ) {
    const { changes, metadata, success = true, error_message } = options || {};

    const logEntry: Omit<LogEntry, "id" | "created_at"> = {
      action,
      user_id: this.context.user_id,
      user_email: this.context.user_email,
      changes,
      metadata: {
        ...metadata,
        ip_address: this.context.ip_address,
        user_agent: this.context.user_agent,
        referer: this.context.referer,
        device_info: this.context.device_info,
      },
      success,
      error_message,
    };

    console.log("LoggingService.log called with:", {
      entityType,
      entityId,
      action,
      context: this.context,
      logEntry,
    });

    return db.appendLogToEntity(entityType, entityId, logEntry);
  }
}
