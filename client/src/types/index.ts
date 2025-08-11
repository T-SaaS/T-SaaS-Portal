// Import shared types from the shared schema
import type {
  Address,
  BackgroundCheckResult,
  Job,
  Company as SharedCompany,
  Driver as SharedDriver,
} from "@shared/schema";

// Re-export shared types for convenience
export type { Address, BackgroundCheckResult, SharedDriver as Driver, Job };

// Client-specific DriverApplication type (with string ID for client usage)
export interface DriverApplication
  extends Omit<
    import("@shared/schema").DriverApplication,
    "id" | "company_id"
  > {
  id: string;
  company_id: string;
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
  fields: string[];
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

// Company Types - extending shared company type for client-specific needs
export interface Company extends Omit<SharedCompany, "id"> {
  id: string; // Override to be string instead of number for client usage
  settings: CompanySettings;
}

// Company Response Types
export interface CompanyResponse {
  data: Company;
  success: boolean;
  message: string;
}

// Company Settings Types
export interface CompanySettings {
  allowExternalApplications: boolean;
  requireBackgroundCheck: boolean;
  customFields: Record<string, any>;
  supportEmail?: string;
  welcomeMessage?: string;
}
