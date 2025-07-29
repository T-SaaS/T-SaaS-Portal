// Import shared types
import type { Address, Job } from "@shared/schema";

export type GapPeriod = {
  from: string; // dayjs.Dayjs formatted string
  to: string; // dayjs.Dayjs formatted string
  type?: "gap" | "overlap"; // Optional type to distinguish between gaps and overlaps
};

// Signature data structure
export interface SignatureData {
  data: string | null; // Base64 signature data
  uploaded: boolean; // Whether it's been uploaded
  url?: string; // Public URL after upload
  signedUrl?: string; // Signed URL after upload
  path?: string; // File path in storage
  timestamp?: string; // When it was created
}

// Client-specific form values type (camelCase for form usage)
export type DriverFormValues = {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  socialSecurityNumber: string;

  // Step 2: Contact & Address
  phone: string;
  email: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
  currentAddressFromMonth: number;
  currentAddressFromYear: number;

  // Step 3: License Information
  licenseNumber: string;
  licenseState: string;
  licenseExpirationDate: string;
  medicalCardExpirationDate: string;
  positionAppliedFor: string;
  licensePhoto: string | null; // Base64 image data
  medicalCardPhoto: string | null; // Base64 image data

  // Step 4: Address History
  addresses: Address[];

  // Step 5: Employment History
  jobs: Job[];

  // Step 5: Background Check Consents
  fairCreditReportingActConsentSignature: SignatureData;
  fairCreditReportingActConsentSignatureConsent: boolean;
  fmcsaClearinghouseConsentSignature: SignatureData;
  fmcsaClearinghouseConsentSignatureConsent: boolean;
  motorVehicleRecordConsentSignature: SignatureData;
  motorVehicleRecordConsentSignatureConsent: boolean;

  // Step 6: Drug & Alcohol Testing Consent
  drugTestConsentSignature: SignatureData;
  drugTestConsentSignatureConsent: boolean;
  drugTestQuestion: string;

  // Step 7: General Application Consent
  generalConsentSignature: SignatureData;
  generalConsentSignatureConsent: boolean;
};

export type FormStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type FormStepConfig = {
  title: string;
  label: string;
  fields: (keyof DriverFormValues)[];
};

export type GapDetectionResult = {
  gapDetected: boolean;
  periods: GapPeriod[];
  totalMonths?: number;
};
