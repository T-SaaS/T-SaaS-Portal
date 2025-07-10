// Form Types
export interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}

export interface Job {
  employerName: string;
  positionHeld: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}

export interface DriverFormValues {
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
}

// Application Types
export interface DriverApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  company: string;
  // Add other fields as needed
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  title: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Step Types
export interface FormStep {
  title: string;
  label: string;
  fields: (keyof DriverFormValues)[];
}

// UI Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
}

// Theme Types
export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  companyId?: string;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  domain: string;
  settings: CompanySettings;
}

export interface CompanySettings {
  allowExternalApplications: boolean;
  requireBackgroundCheck: boolean;
  customFields: Record<string, any>;
}
