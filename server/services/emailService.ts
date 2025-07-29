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
  private zeptoMail: SendMailClient;
  private defaultFrom: string;
  private companyName: string;

  constructor() {
    // Initialize ZeptoMail with environment variables
    this.zeptoMail = new SendMailClient({
      apiKey: process.env.ZEPTOMAIL_API_TOKEN || "",
      apiUrl: process.env.ZEPTOMAIL_API_URL || "api.zeptomail.com/",
    });

    this.defaultFrom = process.env.DEFAULT_FROM_EMAIL || "noreply@trucking.mba";
    this.companyName = process.env.COMPANY_NAME || "TruckingMBA";
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
      const response = await this.zeptoMail.sendMail({
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
        textbody: emailData.text,
      });

      console.log("Email sent successfully:", response);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
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
