import type { Company, DriverApplication } from "@shared/schema";
import { SendMailClient } from "zeptomail";
import { EmailTemplateManager } from "./emailTemplates";

// Email template types
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailContext {
  driver: DriverApplication;
  company: Company;
  [key: string]: any;
}

// Email template categories
export enum EmailTemplateType {
  // Application related emails
  APPLICATION_SUBMITTED = "application_submitted",
  APPLICATION_APPROVED = "application_approved",
  APPLICATION_REJECTED = "application_rejected",
  APPLICATION_INCOMPLETE = "application_incomplete",

  // Background check emails
  BACKGROUND_CHECK_INITIATED = "background_check_initiated",
  BACKGROUND_CHECK_COMPLETED = "background_check_completed",
  BACKGROUND_CHECK_FAILED = "background_check_failed",

  // Document related emails
  DOCUMENT_REQUESTED = "document_requested",
  DOCUMENT_RECEIVED = "document_received",
  DOCUMENT_REJECTED = "document_rejected",

  // Notification emails
  WELCOME_EMAIL = "welcome_email",
  REMINDER_EMAIL = "reminder_email",
  EXPIRATION_WARNING = "expiration_warning",

  // System emails
  SYSTEM_NOTIFICATION = "system_notification",
  ERROR_NOTIFICATION = "error_notification",
}

export class EmailService {
  private zeptoMail: SendMailClient | null;
  private defaultFrom: string;
  private companyName: string;

  constructor() {
    // Initialize ZeptoMail with environment variables
    const token = process.env.VITE_ZEPTOMAIL_API_KEY || "";
    const url = process.env.VITE_ZEPTOMAIL_API_URL || "api.zeptomail.com/";

    console.log("EmailService initialization:");

    // Only initialize ZeptoMail if we have the required token
    if (token) {
      try {
       
        this.zeptoMail = new SendMailClient({ url,token });
        console.log("ZeptoMail client initialized successfully");
      } catch (error) {
        console.error("Failed to initialize ZeptoMail client:", error);
        console.error("Initialization error details:", {
          name: error instanceof Error ? error.name : "Unknown",
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        this.zeptoMail = null;
      }
    } else {
      console.warn(
        "VITE_ZEPTOMAIL_API_KEY not set - email functionality will be disabled"
      );
      this.zeptoMail = null;
    }

    this.defaultFrom = process.env.DEFAULT_FROM_EMAIL || "noreply@trucking.mba";
    this.companyName = process.env.COMPANY_NAME || "TruckingMBA";

    console.log("Default from email:", this.defaultFrom);
    console.log("Company name:", this.companyName);
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(
    templateType: EmailTemplateType,
    context: EmailContext,
    options?: {
      to?: string;
      from?: string;
      customSubject?: string;
    }
  ): Promise<boolean> {
    try {
      const template = this.getTemplate(templateType, context);
      const emailData: EmailData = {
        to: options?.to || context.driver.email,
        from: options?.from || this.defaultFrom,
        subject: options?.customSubject || template.subject,
        html: template.html,
        text: template.text,
      };
      
      return await this.sendEmail(emailData);
    } catch (error) {
      console.error(`Failed to send ${templateType} email:`, error);
      return false;
    }
  }

  /**
   * Send a custom email
   */
  async sendCustomEmail(emailData: EmailData): Promise<boolean> {
    return await this.sendEmail(emailData);
  }

  /**
   * Send email using ZeptoMail API
   */
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log("Attempting to send email to:", emailData.to);
      console.log("From:", emailData.from);
      console.log("Subject:", emailData.subject);

      // Check if ZeptoMail client is properly initialized
      if (!this.zeptoMail) {
        console.error("ZeptoMail client not initialized");
        return false;
      }

      // Wrap the ZeptoMail call in a try-catch to handle any response parsing issues
      let response;
      try {
        console.log("Sending email to:", emailData.to);

        // Use Promise.resolve to ensure we're handling the promise correctly
        response = await Promise.resolve(
          this.zeptoMail.sendMail({
            from: {
              address: emailData.from,
              name: this.companyName,
            },
            to: [
              {
                email_address: {
                  address: emailData.to,
                },
              },
            ],
            subject: emailData.subject,
            htmlbody: emailData.html,
          })
        );

        console.log("Email sent successfully:", response);
        return true;
      } catch (zeptoError) {
        console.error("ZeptoMail API error:", zeptoError);

        // Check if the error has a response property that might be causing the .json() issue
        if (
          zeptoError &&
          typeof zeptoError === "object" &&
          "response" in zeptoError
        ) {
          const responseError = (zeptoError as any).response;
          console.error("Response error object:", responseError);

          // Don't try to call .json() on the response, just log the error
          if (responseError && typeof responseError === "object") {
            console.error("Response error details:", {
              status: responseError.status,
              statusText: responseError.statusText,
              url: responseError.url,
              type: responseError.type,
            });
          }
        }

        // Return false instead of throwing to prevent unhandled rejections
        return false;
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      });

      // Log additional error information
      if (error && typeof error === "object") {
        console.error("Full error object:", JSON.stringify(error, null, 2));
      }

      return false;
    }
  }

  /**
   * Get email template based on type and context
   */
  private getTemplate(
    templateType: EmailTemplateType,
    context: EmailContext
  ): EmailTemplate {
    const { driver, company } = context;
    const fullName = `${driver.first_name} ${driver.last_name}`;

    switch (templateType) {
      case EmailTemplateType.APPLICATION_SUBMITTED:
        return {
          subject: `Application Submitted - ${fullName}`,
          html: EmailTemplateManager.getApplicationSubmittedTemplate(context),
        };

      case EmailTemplateType.APPLICATION_APPROVED:
        return {
          subject: `Application Approved - ${fullName}`,
          html: EmailTemplateManager.getApplicationApprovedTemplate(context),
        };

      case EmailTemplateType.APPLICATION_REJECTED:
        return {
          subject: `Application Status Update - ${fullName}`,
          html: EmailTemplateManager.getApplicationRejectedTemplate(context),
        };

      case EmailTemplateType.BACKGROUND_CHECK_INITIATED:
        return {
          subject: `Background Check Initiated - ${fullName}`,
          html: EmailTemplateManager.getBackgroundCheckInitiatedTemplate(
            context
          ),
        };

      case EmailTemplateType.BACKGROUND_CHECK_COMPLETED:
        return {
          subject: `Background Check Completed - ${fullName}`,
          html: EmailTemplateManager.getBackgroundCheckCompletedTemplate(
            context
          ),
        };

      case EmailTemplateType.DOCUMENT_REQUESTED:
        return {
          subject: `Additional Documents Required - ${fullName}`,
          html: EmailTemplateManager.getDocumentRequestedTemplate(context),
        };

      case EmailTemplateType.WELCOME_EMAIL:
        return {
          subject: `Welcome to ${company.name}`,
          html: EmailTemplateManager.getWelcomeEmailTemplate(context),
        };

      case EmailTemplateType.REMINDER_EMAIL:
        return {
          subject: `Application Reminder - ${fullName}`,
          html: EmailTemplateManager.getReminderEmailTemplate(context),
        };

      case EmailTemplateType.EXPIRATION_WARNING:
        return {
          subject: `Document Expiration Warning - ${fullName}`,
          html: EmailTemplateManager.getExpirationWarningTemplate(context),
        };

      default:
        throw new Error(`Unknown email template type: ${templateType}`);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
