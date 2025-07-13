import { apiRequest } from "@/lib/queryClient";
import { Company } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface UseCompanyOptions {
  companySlug?: string;
  companyId?: string | number;
}

interface UseCompanyReturn {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  companySlug: string | null;
}

interface UseCompaniesReturn {
  companies: Company[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCompany(options: UseCompanyOptions = {}): UseCompanyReturn {
  const { companySlug: paramSlug } = useParams<{ companySlug: string }>();
  const { companySlug = paramSlug, companyId } = options;
  const [error, setError] = useState<Error | null>(null);

  // Determine the query key and function based on the options
  const getQueryKey = () => {
    if (companyId) return ["company", "id", companyId];
    if (companySlug) return ["company", "slug", companySlug];
    return ["company", "none"];
  };

  const getQueryFn = async () => {
    if (companyId) {
      const response = await apiRequest(
        "GET",
        `/api/v1/companies/${encodeURIComponent(companyId.toString())}`
      );
      if (!response.ok) {
        throw new Error(`Company not found: ${companyId}`);
      }
      return response.json();
    }

    if (companySlug) {
      const response = await apiRequest(
        "GET",
        `/api/v1/companies/slug/${encodeURIComponent(companySlug)}`
      );
      if (!response.ok) {
        throw new Error(`Company not found: ${companySlug}`);
      }
      return response.json();
    }

    throw new Error("No company identifier provided");
  };

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: getQueryKey(),
    queryFn: getQueryFn,
    enabled: !!companyId || !!companySlug,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
    }
  }, [queryError]);

  return {
    company: data?.data || null,
    isLoading,
    error,
    companySlug: companySlug || null,
  };
}

export function useCompanies(): UseCompaniesReturn {
  const [error, setError] = useState<Error | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/v1/companies");
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
    }
  }, [queryError]);

  return {
    companies: data?.data || null,
    isLoading,
    error,
  };
}

// Convenience hooks for specific use cases
export function useCompanyBySlug(companySlug?: string) {
  return useCompany({ companySlug });
}

export function useCompanyById(companyId: string | number) {
  return useCompany({ companyId });
}
