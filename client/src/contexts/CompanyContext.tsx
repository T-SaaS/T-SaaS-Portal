import { createContext, useContext, ReactNode } from "react";
import { useCompany } from "@/hooks/useCompany";
import { Company } from "@/types";

interface CompanyContextType {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  companySlug: string | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const companyData = useCompany();

  return (
    <CompanyContext.Provider value={companyData}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext(): CompanyContextType {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
}
