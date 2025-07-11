import { apiRequest } from "@/lib/queryClient";
import { Company, CompanyResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface UseCompanyReturn {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  companySlug: string | null;
}

export function useCompany(): UseCompanyReturn {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [error, setError] = useState<Error | null>(null);

  const {
    data:company,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["company", companySlug],
    queryFn: async (): Promise<CompanyResponse> => {
      if (!companySlug) {
        throw new Error("No company name provided");
      }

      const response = await apiRequest(
        "GET",
        `/api/companies/slug/${encodeURIComponent(companySlug)}`
      );

      if (!response.ok) {
        throw new Error(`Company not found: ${companySlug}`);
      }

      return response.json();
    },
    enabled: !!companySlug,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
    }
  }, [queryError]);
 
  return {
    company: company?.data || null,
    isLoading,
    error,
    companySlug: companySlug || null,
  };
}
