import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DriverFormValues } from "@/types/driverApplicationForm";
import type { InsertDriverApplication } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";

export const useFormSubmission = () => {
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: InsertDriverApplication) => {
      const response = await apiRequest(
        "POST",
        "/api/driver-applications",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully",
        description:
          "Your driver qualification application has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatFormData = (data: DriverFormValues): InsertDriverApplication => {
    return {
      company_id: 1, // TODO: Get from context/params
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob,
      phone: data.phone,
      email: data.email,
      current_address: data.currentAddress,
      current_city: data.currentCity,
      current_state: data.currentState,
      current_zip: data.currentZip,
      current_address_from_month: Number(data.currentAddressFromMonth),
      current_address_from_year: Number(data.currentAddressFromYear),
      license_number: data.licenseNumber,
      license_state: data.licenseState,
      position_applied_for: data.positionAppliedFor,
      addresses: data.addresses.map((addr) => ({
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        fromMonth: Number(addr.fromMonth),
        fromYear: Number(addr.fromYear),
        toMonth: Number(addr.toMonth),
        toYear: Number(addr.toYear),
      })),
      jobs: data.jobs.map((job) => ({
        employerName: job.employerName,
        positionHeld: job.positionHeld,
        fromMonth: Number(job.fromMonth),
        fromYear: Number(job.fromYear),
        toMonth: Number(job.toMonth),
        toYear: Number(job.toYear),
      })),
      social_security_number: data.socialSecurityNumber,
      consent_to_background_check: Number(data.consentToBackgroundCheck),
    };
  };

  const submitForm = async (data: DriverFormValues): Promise<void> => {
    const formattedData = formatFormData(data);
    return new Promise((resolve, reject) => {
      submitMutation.mutate(formattedData, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return {
    submitForm,
    submitMutation,
    isSubmitting: submitMutation.isPending,
  };
};
