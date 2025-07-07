import { db } from "./db";
import { driverApplications } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { BackgroundCheckResult } from "@shared/schema";

export class BackgroundCheckService {
  // Simulate background check API integration
  async initiateBackgroundCheck(applicationId: number): Promise<void> {
    try {
      // Update status to in_progress
      await db
        .update(driverApplications)
        .set({ 
          backgroundCheckStatus: "in_progress" 
        })
        .where(eq(driverApplications.id, applicationId));

      // Simulate async background check process
      setTimeout(() => {
        this.completeBackgroundCheck(applicationId);
      }, 5000); // Complete after 5 seconds for demo
      
    } catch (error) {
      console.error("Failed to initiate background check:", error);
      await db
        .update(driverApplications)
        .set({ 
          backgroundCheckStatus: "failed" 
        })
        .where(eq(driverApplications.id, applicationId));
    }
  }

  private async completeBackgroundCheck(applicationId: number): Promise<void> {
    try {
      // Simulate background check results
      const mockResults: BackgroundCheckResult = {
        criminalHistory: false, // No criminal history
        drivingRecord: {
          violations: [
            {
              type: "Speeding",
              date: "2023-06-15",
              severity: "minor"
            }
          ],
          suspensions: [],
          overallScore: "good"
        },
        employmentVerification: {
          verified: true,
          discrepancies: []
        },
        drugTest: {
          status: "pending" // Will be scheduled separately
        }
      };

      await db
        .update(driverApplications)
        .set({ 
          backgroundCheckStatus: "completed",
          backgroundCheckResults: mockResults,
          backgroundCheckCompletedAt: new Date()
        })
        .where(eq(driverApplications.id, applicationId));
        
      console.log(`Background check completed for application ${applicationId}`);
    } catch (error) {
      console.error("Failed to complete background check:", error);
      await db
        .update(driverApplications)
        .set({ 
          backgroundCheckStatus: "failed" 
        })
        .where(eq(driverApplications.id, applicationId));
    }
  }

  async getBackgroundCheckStatus(applicationId: number): Promise<{
    status: string;
    results?: BackgroundCheckResult;
    completedAt?: Date;
  } | null> {
    try {
      const [application] = await db
        .select({
          backgroundCheckStatus: driverApplications.backgroundCheckStatus,
          backgroundCheckResults: driverApplications.backgroundCheckResults,
          backgroundCheckCompletedAt: driverApplications.backgroundCheckCompletedAt
        })
        .from(driverApplications)
        .where(eq(driverApplications.id, applicationId));

      if (!application) return null;

      return {
        status: application.backgroundCheckStatus || "pending",
        results: application.backgroundCheckResults as BackgroundCheckResult,
        completedAt: application.backgroundCheckCompletedAt || undefined
      };
    } catch (error) {
      console.error("Failed to get background check status:", error);
      return null;
    }
  }
}

export const backgroundCheckService = new BackgroundCheckService();