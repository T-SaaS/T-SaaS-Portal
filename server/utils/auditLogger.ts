import type { DeviceInfo } from "@shared/schema";

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  applicationId: string;
  signatureType: string;
  ipAddress: string;
  deviceInfo?: DeviceInfo;
  success: boolean;
  error?: string;
  companyName?: string;
}

export class AuditLogger {
  private static formatDeviceInfo(deviceInfo?: DeviceInfo): string {
    if (!deviceInfo) return "Unknown";

    return `${deviceInfo.deviceType} - ${deviceInfo.os} ${deviceInfo.osVersion} - ${deviceInfo.browser} ${deviceInfo.browserVersion}`;
  }

  static logSignatureUpload(entry: Omit<AuditLogEntry, "timestamp">): void {
    const timestamp = new Date().toISOString();
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp,
    };

    const deviceSummary = this.formatDeviceInfo(entry.deviceInfo);

    console.log(`[AUDIT] ${timestamp} - Signature Upload`, {
      action: entry.action,
      applicationId: entry.applicationId,
      signatureType: entry.signatureType,
      ipAddress: entry.ipAddress,
      deviceInfo: deviceSummary,
      success: entry.success,
      companyName: entry.companyName,
      error: entry.error,
    });

    // In a production environment, you might want to:
    // 1. Store this in a dedicated audit log table
    // 2. Send to a logging service like DataDog, LogRocket, etc.
    // 3. Store in a secure audit trail for compliance
  }

  static logApplicationSubmission(entry: {
    applicationId: string;
    companyId: number;
    ipAddress: string;
    deviceInfo?: DeviceInfo;
    success: boolean;
    error?: string;
  }): void {
    const timestamp = new Date().toISOString();
    const deviceSummary = this.formatDeviceInfo(entry.deviceInfo);

    console.log(`[AUDIT] ${timestamp} - Application Submission`, {
      applicationId: entry.applicationId,
      companyId: entry.companyId,
      ipAddress: entry.ipAddress,
      deviceInfo: deviceSummary,
      success: entry.success,
      error: entry.error,
    });
  }

  static logBackgroundCheckConsent(entry: {
    applicationId: string;
    consentGiven: boolean;
    ipAddress: string;
    deviceInfo?: DeviceInfo;
    success: boolean;
    error?: string;
  }): void {
    const timestamp = new Date().toISOString();
    const deviceSummary = this.formatDeviceInfo(entry.deviceInfo);

    console.log(`[AUDIT] ${timestamp} - Background Check Consent`, {
      applicationId: entry.applicationId,
      consentGiven: entry.consentGiven,
      ipAddress: entry.ipAddress,
      deviceInfo: deviceSummary,
      success: entry.success,
      error: entry.error,
    });
  }
}
