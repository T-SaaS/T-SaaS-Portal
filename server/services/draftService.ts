import type { Company, DriverApplication } from "@shared/schema";
import crypto from "crypto";
import { db } from "../db";
import { emailService } from "./emailService";

export interface DraftTokenData {
  applicationId: string;
  email: string;
  companyId: string;
  expiresAt: Date;
}

export class DraftService {
  private static readonly TOKEN_EXPIRY_DAYS = 7;
  private static readonly TOKEN_LENGTH = 64;

  /**
   * Generate a secure random token for draft access
   */
  private static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString("hex");
  }

  /**
   * Hash a token for secure storage
   */
  private static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Verify a token against its hash
   */
  private static verifyToken(token: string, hash: string): boolean {
    const tokenHash = this.hashToken(token);
    return crypto.timingSafeEqual(
      Buffer.from(tokenHash, "hex"),
      Buffer.from(hash, "hex")
    );
  }

  /**
   * Save or update a draft application
   */
  static async saveDraft(
    data: Partial<DriverApplication>,
    companyData: Company,
    ipAddress: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const { email, company_id } = data;

      if (!email || !company_id) {
        console.log(
          "Missing required fields - email:",
          email,
          "company_id:",
          company_id
        );
        return {
          success: false,
          error: "Email and company_id are required",
        };
      }

      console.log("Checking for existing draft with email:", email);
      // Check if a draft already exists for this email
      const existingDraft = await this.findDraftByEmail(email);
      console.log("Existing draft found:", existingDraft ? "Yes" : "No");

      let applicationId: string;
      let token: string;

      if (existingDraft) {
        console.log("Updating existing draft with ID:", existingDraft.id);
        // Update existing draft
        applicationId = existingDraft.id;

        // Generate new token and expiry
        token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);

        console.log("Generated new token for existing draft:", {
          tokenPrefix: token.substring(0, 8) + "...",
          expiresAt: expiresAt.toISOString(),
          tokenHash: this.hashToken(token).substring(0, 8) + "...",
        });

        const updateData = {
          ...data,
          status: "draft" as const,
          draft_token_hash: this.hashToken(token),
          draft_token_expires_at: expiresAt.toISOString(),
          draft_saved_at: new Date().toISOString(),
          ip_address: ipAddress,
        };

        // Update the draft
        await db.updateDriverApplication(applicationId, updateData);

        console.log(`Updated existing draft for email: ${email}`);
      } else {
        console.log("Creating new draft");
        // Create new draft
        token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);

        console.log("Generated new token for new draft:", {
          tokenPrefix: token.substring(0, 8) + "...",
          expiresAt: expiresAt.toISOString(),
          tokenHash: this.hashToken(token).substring(0, 8) + "...",
        });

        const createData = {
          ...data,
          status: "draft" as const,
          draft_token_hash: this.hashToken(token),
          draft_token_expires_at: expiresAt.toISOString(),
          draft_saved_at: new Date().toISOString(),
          ip_address: ipAddress,
          submitted_at: new Date().toISOString(), // Required field
        } as any;

        const newDraft = await db.createDriverApplication(createData);

        applicationId = newDraft.id;
        console.log(
          `Created new draft for email: ${email} with ID: ${applicationId}`
        );
      }

      // Send magic link email
      const emailSent = await this.sendDraftEmail(
        email,
        token,
        data.first_name || "Driver",
        companyData.name || "TruckingMBA",
        companyData.slug || "default"
      );

      if (!emailSent) {
        console.warn(`Failed to send draft email to: ${email}`);
        // Still return success since draft was saved
      }

      return {
        success: true,
        token,
      };
    } catch (error) {
      console.error("Error saving draft:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Resume a draft using a token
   */
  static async resumeDraft(token: string): Promise<{
    success: boolean;
    data?: DriverApplication;
    error?: string;
  }> {
    try {
      console.log(
        "Attempting to resume draft with token:",
        token.substring(0, 8) + "..."
      );

      // Find application with matching token hash
      const applications = await db.getAllDriverApplications();
      console.log("Total applications found:", applications.length);

      const draft = applications.find((app) => {
        console.log("Checking application:", {
          id: app.id,
          status: app.status,
          hasTokenHash: !!app.draft_token_hash,
          hasExpiry: !!app.draft_token_expires_at,
          expiryDate: app.draft_token_expires_at,
        });

        if (!app.draft_token_hash || !app.draft_token_expires_at) {
          console.log("Application missing token hash or expiry");
          return false;
        }

        // Check if token is valid
        const tokenValid = this.verifyToken(token, app.draft_token_hash);
        console.log("Token verification result:", tokenValid);

        if (!tokenValid) {
          console.log("Token verification failed");
          return false;
        }

        // Check if token has expired
        const expiresAt = new Date(app.draft_token_expires_at);
        const now = new Date();
        const isExpired = expiresAt < now;

        console.log("Token expiry check:", {
          expiresAt: expiresAt.toISOString(),
          now: now.toISOString(),
          isExpired,
          timeDifference: expiresAt.getTime() - now.getTime(),
        });

        if (isExpired) {
          console.log("Token has expired");
          return false;
        }

        const isDraft = app.status === "draft";
        console.log("Application is draft:", isDraft);

        return isDraft;
      });

      if (!draft) {
        console.log("No valid draft found for token");
        return {
          success: false,
          error: "Invalid or expired draft token",
        };
      }

      console.log("Draft found successfully:", draft.id);
      return {
        success: true,
        data: draft,
      };
    } catch (error) {
      console.error("Error resuming draft:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Find a draft by email address
   */
  private static async findDraftByEmail(
    email: string
  ): Promise<DriverApplication | null> {
    try {
      console.log("Finding draft by email:", email);
      const applications = await db.getAllDriverApplications();
      console.log("Total applications found:", applications.length);

      const draft = applications.find(
        (app) => app.email === email && app.status === "draft"
      );

      console.log("Draft found:", draft ? "Yes" : "No");
      if (draft) {
        console.log("Draft ID:", draft.id);
      }

      return draft || null;
    } catch (error) {
      console.error("Error finding draft by email:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      });
      return null;
    }
  }

  /**
   * Send draft magic link email
   */
  private static async sendDraftEmail(
    email: string,
    token: string,
    firstName: string,
    companyName: string,
    companySlug: string
  ): Promise<boolean> {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.BASE_URL
          : "http://localhost:5000";
      const magicLink = `${baseUrl}/ex/${companySlug}/apply?resume=${token}`;

      const emailData = {
        to: email,
        from: process.env.DEFAULT_FROM_EMAIL || "noreply@trucking.mba",
        subject: `Resume Your Driver Application for ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Resume Your Driver Application</h2>
            <p>Hello ${firstName},</p> 
            <p>You saved a draft of your driver application for <strong>${companyName}</strong>. Click the link below to continue where you left off:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Resume Application
              </a>
            </div>
            <p><strong>Important:</strong> This link will expire in 7 days for security reasons.</p>
            <p>If you didn't request this link or have any questions, please contact ${companyName}.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from ${companyName}. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      return await emailService.sendCustomEmail(emailData);
    } catch (error) {
      console.error("Error sending draft email:", error);
      return false;
    }
  }

  /**
   * Clean up expired draft tokens
   */
  static async cleanupExpiredDrafts(): Promise<void> {
    try {
      const applications = await db.getAllDriverApplications();
      const now = new Date();

      for (const app of applications) {
        if (
          app.status === "draft" &&
          app.draft_token_expires_at &&
          new Date(app.draft_token_expires_at) < now
        ) {
          // Optionally delete expired drafts or just clear the token
          await db.updateDriverApplication(app.id, {
            draft_token_hash: undefined,
            draft_token_expires_at: undefined,
          });
          console.log(`Cleaned up expired draft for: ${app.email}`);
        }
      }
    } catch (error) {
      console.error("Error cleaning up expired drafts:", error);
    }
  }
}
