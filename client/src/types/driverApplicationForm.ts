export type Address = {
  address: string;
  city: string;
  state: string;
  zip: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
};

export type Job = {
  employerName: string;
  positionHeld: string;
  businessName: string;
  companyEmail: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
};

export type GapPeriod = {
  from: string; // dayjs.Dayjs formatted string
  to: string; // dayjs.Dayjs formatted string
  type?: "gap" | "overlap"; // Optional type to distinguish between gaps and overlaps
};

export type DriverFormValues = {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  dob: string;

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
  positionAppliedFor: string;

  // Step 4: Address History
  addresses: Address[];

  // Step 5: Employment History
  jobs: Job[];

  // Step 6: Background Check
  socialSecurityNumber: string;
  consentToBackgroundCheck: number; // 1 for checked, 0 for not checked
};

export type FormStep = 0 | 1 | 2 | 3 | 4 | 5;

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
