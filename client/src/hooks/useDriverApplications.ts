import { apiRequest } from "@/lib/queryClient";
import { DriverApplication } from "@/types";
import { useEffect, useState } from "react";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export const useDriverApplications = () => {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("GET", "/api/v1/driver-applications");
      const result: ApiResponse<DriverApplication[]> = await response.json();

      if (result.success) {
        // Transform the data to match our DriverApplication type
        const transformedApplications = result.data.map((app: DriverApplication) => ({
          id: app.id.toString(),
          first_name: app.first_name,
          last_name: app.last_name,
          email: app.email,
          phone: app.phone,
          company_id: app.company_id?.toString(),
          status: app.status || "pending",
          submitted_at: app.submitted_at,
          company: "", // This might need to be fetched separately
          dob: app.dob,
          position_applied_for: app.position_applied_for,
          background_check_status: app.background_check_status,
          current_address: app.current_address,
          current_city: app.current_city,
          current_state: app.current_state,
          current_zip: app.current_zip,
          current_address_from_month: app.current_address_from_month,
          current_address_from_year: app.current_address_from_year,
          license_number: app.license_number,
          license_state: app.license_state,
          license_expiration_date: app.license_expiration_date,
          addresses: app.addresses,
          jobs: app.jobs,
          social_security_number: app.social_security_number,
          consent_to_background_check: app.consent_to_background_check,
        }));

        setApplications(transformedApplications);
      } else {
        setError(result.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};

export const useDriverApplication = (id: string) => {
  const [application, setApplication] = useState<DriverApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchApplication = async () => {
    if (!id) {
      setApplication(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        "GET",
        `/api/v1/driver-applications/${id}`
      );
      const result: ApiResponse<DriverApplication> = await response.json();

      if (result.success) {
        // Transform the data to match our DriverApplication type
        const app = result.data;
        const transformedApplication = {
          id: app.id.toString(),
          first_name: app.first_name,
          last_name: app.last_name,
          email: app.email,
          phone: app.phone,
          company_id: app.company_id?.toString(),
          status: app.status || "pending",
          submitted_at: app.submitted_at,
          company: "", // This might need to be fetched separately
          dob: app.dob,
          position_applied_for: app.position_applied_for,
          background_check_status: app.background_check_status,
          current_address: app.current_address,
          current_city: app.current_city,
          current_state: app.current_state,
          current_zip: app.current_zip,
          current_address_from_month: app.current_address_from_month,
          current_address_from_year: app.current_address_from_year,
          license_number: app.license_number,
          license_state: app.license_state,
          license_expiration_date: app.license_expiration_date,
          addresses: app.addresses,
          jobs: app.jobs,
          social_security_number: app.social_security_number,
          consent_to_background_check: app.consent_to_background_check,
        };

        setApplication(transformedApplication);
      } else {
        setError(result.message || "Failed to fetch application");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch application"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplication();
  }, [id]);
  
  console.log(application);
  return {
    application,
    loading,
    error,
    refetch: fetchApplication,
  };
};
