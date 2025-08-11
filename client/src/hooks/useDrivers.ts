import { apiRequest } from "@/lib/queryClient";
import { Driver } from "@/types";
import { useEffect, useState } from "react";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("GET", "/api/v1/drivers");
      const result: ApiResponse<Driver[]> = await response.json();

      if (result.success) {
        // Transform the data to match our Driver type
        const transformedDrivers = result.data.map((driver: Driver) => ({
          id: driver.id.toString(),
          company_id: driver.company_id?.toString(),
          application_id: driver.application_id?.toString(),
          first_name: driver.first_name,
          last_name: driver.last_name,
          status: driver.status || "active",
          dob: driver.dob,
          phone: driver.phone,
          email: driver.email,
          current_address: driver.current_address,
          current_city: driver.current_city,
          current_state: driver.current_state,
          current_zip: driver.current_zip,
          current_address_from_month: driver.current_address_from_month,
          current_address_from_year: driver.current_address_from_year,
          license_number: driver.license_number,
          license_state: driver.license_state,
          license_expiration_date: driver.license_expiration_date,
          medical_card_expiration_date: driver.medical_card_expiration_date,
          position: driver.position,
          license_photo: driver.license_photo,
          medical_card_photo: driver.medical_card_photo,
          hire_date: driver.hire_date,
          termination_date: driver.termination_date,
          emergency_contact_name: driver.emergency_contact_name,
          emergency_contact_phone: driver.emergency_contact_phone,
          emergency_contact_relationship: driver.emergency_contact_relationship,
          notes: driver.notes,
          logs: driver.logs,
          created_at: driver.created_at,
          updated_at: driver.updated_at,
        }));

        setDrivers(transformedDrivers);
      } else {
        setError(result.message || "Failed to fetch drivers");
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    refetch: fetchDrivers,
  };
};

export const useDriver = (id: string) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriver = async () => {
    if (!id) {
      setDriver(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("GET", `/api/v1/drivers/${id}`);
      const result: ApiResponse<Driver> = await response.json();

      if (result.success) {
        // Transform the data to match our Driver type
        const driverData = result.data;
        const transformedDriver = {
          id: driverData.id.toString(),
          company_id: driverData.company_id?.toString(),
          application_id: driverData.application_id?.toString(),
          first_name: driverData.first_name,
          last_name: driverData.last_name,
          status: driverData.status || "active",
          dob: driverData.dob,
          phone: driverData.phone,
          email: driverData.email,
          current_address: driverData.current_address,
          current_city: driverData.current_city,
          current_state: driverData.current_state,
          current_zip: driverData.current_zip,
          current_address_from_month: driverData.current_address_from_month,
          current_address_from_year: driverData.current_address_from_year,
          license_number: driverData.license_number,
          license_state: driverData.license_state,
          license_expiration_date: driverData.license_expiration_date,
          medical_card_expiration_date: driverData.medical_card_expiration_date,
          position: driverData.position,
          license_photo: driverData.license_photo,
          medical_card_photo: driverData.medical_card_photo,
          hire_date: driverData.hire_date,
          termination_date: driverData.termination_date,
          emergency_contact_name: driverData.emergency_contact_name,
          emergency_contact_phone: driverData.emergency_contact_phone,
          emergency_contact_relationship:
            driverData.emergency_contact_relationship,
          notes: driverData.notes,
          logs: driverData.logs,
          created_at: driverData.created_at,
          updated_at: driverData.updated_at,
        };

        setDriver(transformedDriver);
      } else {
        setError(result.message || "Failed to fetch driver");
      }
    } catch (err) {
      console.error("Error fetching driver:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch driver");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [id]);

  return {
    driver,
    loading,
    error,
    refetch: fetchDriver,
  };
};
