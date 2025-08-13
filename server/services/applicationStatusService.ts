import { DriverApplication } from "@shared/schema";
import { db } from "../db";
import { LoggingService } from "./loggingService";

export type ApplicationStatus = DriverApplication["status"];

export interface StatusTransitionContext {
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  device_info?: any;
  notes?: string;
}

export class ApplicationStatusService {
  private defaultContext: StatusTransitionContext;

  constructor(context: StatusTransitionContext = {}) {
    this.defaultContext = context;
  }

  /**
   * Check if an application submission is valid
   */
  private isSubmissionValid(application: DriverApplication): boolean {
    // Check required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "dob",
      "current_address",
      "current_city",
      "current_state",
      "current_zip",
      "license_number",
      "license_state",
      "position_applied_for",
    ];

    for (const field of requiredFields) {
      if (!(application as any)[field]) {
        return false;
      }
    }

    // Check if at least one address is provided
    if (!application.addresses || application.addresses.length === 0) {
      return false;
    }

    // Check if at least one job is provided
    if (!application.jobs || application.jobs.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Check if all required consents are signed
   */
  private areConsentsSigned(application: DriverApplication): boolean {
    const requiredConsents = [
      "fair_credit_reporting_act_consent",
      "fmcsa_clearinghouse_consent",
      "motor_vehicle_record_consent",
      "drug_test_consent",
      "general_consent",
    ];

    // Check if all consents are given
    for (const consent of requiredConsents) {
      if (!(application as any)[consent]) {
        return false;
      }
    }

    // Check if all signatures are uploaded
    const requiredSignatures = [
      "fair_credit_reporting_act_consent_signature",
      "fmcsa_clearinghouse_consent_signature",
      "motor_vehicle_record_consent_signature",
      "drug_test_consent_signature",
      "general_consent_signature",
    ];

    for (const signature of requiredSignatures) {
      const sig = (application as any)[signature];
      if (!sig || !sig.uploaded) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if PSP review is required for this application
   * This can be based on company settings, position requirements, or other criteria
   */
  private isPSPReviewRequired(application: DriverApplication): boolean {
    // For now, we'll make PSP review optional
    // This can be enhanced based on company settings or position requirements
    return false; // Default to not required
  }

  /**
   * Process status transitions based on current status and application data
   */
  async processStatusTransition(
    applicationId: string,
    targetStatus?: ApplicationStatus
  ): Promise<{
    success: boolean;
    newStatus: ApplicationStatus;
    message: string;
  }> {
    try {
      const application = await db.getDriverApplication(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }

      let newStatus: ApplicationStatus = targetStatus || application.status;
      let message = "";

      // If no target status specified, determine next status based on current status
      if (!targetStatus) {
        switch (application.status) {
          case "New":
            if (this.isSubmissionValid(application)) {
              newStatus = "Under Review";
              message = "Application validated, moved to review";
            } else {
              newStatus = "On Hold";
              message = "Application incomplete, placed on hold";
            }
            break;

          case "Under Review":
            if (this.areConsentsSigned(application)) {
              newStatus = "MVR Check";
              message =
                "All consents signed, proceeding to Motor Vehicle Record check";
            } else {
              newStatus = "On Hold";
              message = "Consents pending, placed on hold";
            }
            break;

          case "MVR Check":
            newStatus = "Drug Screening";
            message = "MVR check completed, proceeding to drug screening";
            break;

          case "Drug Screening":
            if (this.isPSPReviewRequired(application)) {
              newStatus = "PSP Review";
              message = "Drug screening completed, proceeding to PSP review";
            } else {
              newStatus = "Background Complete";
              message =
                "Drug screening completed, background check process finished";
            }
            break;

          case "PSP Review":
            newStatus = "Background Complete";
            message = "PSP review completed, background check process finished";
            break;

          case "Background Complete":
            newStatus = "Approved";
            message = "All background checks completed, application approved";
            break;

          case "Drug Screening":
            // This would typically be set by external drug screening results
            // For now, we'll keep it in this status until manually updated
            message = "Drug screening in progress";
            break;

          case "Pre-Employment":
            // This would typically be set by pre-employment check results
            // For now, we'll keep it in this status until manually updated
            message = "Pre-employment checks in progress";
            break;

          case "Hire Driver":
            newStatus = "Approved";
            message = "Driver approved for hiring";
            break;

          default:
            // For other statuses, no automatic transition
            message = "No automatic transition available for current status";
            return { success: false, newStatus: application.status, message };
        }
      }

      // Update the application status
      if (newStatus !== application.status) {
        await db.updateDriverApplication(applicationId, { status: newStatus });

        // Log the status change
        const loggingService = new LoggingService(this.defaultContext);
        await loggingService.log(
          "driver_applications",
          applicationId,
          "status_changed",
          {
            changes: { status: { from: application.status, to: newStatus } },
            metadata: { reason: message },
          }
        );
      }

      return { success: true, newStatus, message };
    } catch (error) {
      console.error("Error processing status transition:", error);
      return {
        success: false,
        newStatus: "On Hold" as ApplicationStatus,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Manually set application status
   */
  async setStatus(
    applicationId: string,
    status: ApplicationStatus,
    context: StatusTransitionContext = {}
  ): Promise<{ success: boolean; message: string }> {
    console.log("ApplicationStatusService.setStatus called with context:", {
      user_id: context.user_id,
      user_email: context.user_email,
      notes: context.notes,
      hasNotes: !!context.notes,
      notesLength: context.notes?.length,
    });
    try {
      const application = await db.getDriverApplication(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }

      const oldStatus = application.status;
      await db.updateDriverApplication(applicationId, { status });

      // Log the status change
      const loggingService = new LoggingService(context);
      await loggingService.log(
        "driver_applications",
        applicationId,
        "status_changed",
        {
          changes: { status: { from: oldStatus, to: status } },
          metadata: {
            reason:
              context.notes && context.notes.trim()
                ? context.notes.trim()
                : "Manual status change",
          },
        }
      );

      return {
        success: true,
        message: `Status changed from ${oldStatus} to ${status}`,
      };
    } catch (error) {
      console.error("Error setting application status:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Hire a driver from an application
   */
  async hireDriver(
    applicationId: string,
    context: StatusTransitionContext = {}
  ): Promise<{ success: boolean; driverId?: string; message: string }> {
    console.log("ApplicationStatusService.hireDriver called with context:", {
      user_id: context.user_id,
      user_email: context.user_email,
      notes: context.notes,
      hasNotes: !!context.notes,
      notesLength: context.notes?.length,
    });
    try {
      const application = await db.getDriverApplication(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }

      if (application.status !== "Approved") {
        throw new Error("Application must be approved before hiring");
      }

      // Create driver record from application
      const driverData = {
        company_id: application.company_id,
        application_id: application.id,
        first_name: application.first_name,
        last_name: application.last_name,
        status: "active" as const,
        dob: application.dob,
        phone: application.phone,
        email: application.email,
        current_address: application.current_address,
        current_city: application.current_city,
        current_state: application.current_state,
        current_zip: application.current_zip,
        current_address_from_month: application.current_address_from_month,
        current_address_from_year: application.current_address_from_year,
        license_number: application.license_number,
        license_state: application.license_state,
        license_expiration_date: application.license_expiration_date,
        medical_card_expiration_date: application.medical_card_expiration_date,
        position: application.position_applied_for,
        license_photo: application.license_photo,
        medical_card_photo: application.medical_card_photo,
        hire_date: new Date().toISOString(),
      };

      const driver = await db.createDriver(driverData);

      // Update application status to indicate it's been converted
      await db.updateDriverApplication(applicationId, { status: "Hired" });

      // Log the hiring process
      const loggingService = new LoggingService(context);
      await loggingService.log("driver_applications", applicationId, "hired", {
        metadata: {
          driver_id: driver.id,
          company_id: application.company_id,
          reason:
            context.notes && context.notes.trim()
              ? context.notes.trim()
              : "Driver hired from application",
        },
      });

      await loggingService.log("drivers", driver.id, "created", {
        metadata: {
          application_id: applicationId,
          company_id: application.company_id,
          reason: "Created from approved application",
        },
      });

      return {
        success: true,
        driverId: driver.id,
        message: `Driver hired successfully. Driver ID: ${driver.id}`,
      };
    } catch (error) {
      console.error("Error hiring driver:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get available status transitions for an application
   */
  getAvailableTransitions(
    currentStatus: ApplicationStatus
  ): ApplicationStatus[] {
    const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      New: ["Under Review", "On Hold", "Rejected"],
      "Under Review": ["MVR Check", "On Hold", "Rejected"],
      "On Hold": ["Under Review", "MVR Check", "Rejected"],
      "MVR Check": ["Drug Screening", "On Hold", "Rejected"],
      "Drug Screening": [
        "PSP Review",
        "Background Complete",
        "On Hold",
        "Rejected",
      ],
      "PSP Review": ["Background Complete", "On Hold", "Rejected"],
      "Background Complete": ["Approved", "On Hold", "Rejected"],
      Approved: ["Hired", "Rejected"], // Can hire or reject even after approval
      Hired: [], // Final state when driver is successfully hired
      Rejected: [],
      Disqualified: ["Rejected"],
      Expired: [],
    };

    return transitions[currentStatus] || [];
  }
}
