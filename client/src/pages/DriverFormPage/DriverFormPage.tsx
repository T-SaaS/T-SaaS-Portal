import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import {
  IdCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/atoms/Button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStepper } from "@/organisms/ProgressStepper";
import { Input } from "@/atoms/Input";
import { Label } from "@/atoms/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DriverFormValues } from "@/types";
import { months, states, positions } from "@shared/utilities/globalConsts";
import { loadTestData } from "@/utils/testData";

const stepSchemas = [
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    dob: Yup.string().required("Date of Birth is required"),
  }),
  Yup.object().shape({
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    currentAddress: Yup.string().required("Current Address is required"),
    currentCity: Yup.string().required("Current City is required"),
    currentState: Yup.string().required("Current State is required"),
    currentZip: Yup.string().required("Current ZIP code is required"),
    currentAddressFromMonth: Yup.number()
      .min(1)
      .max(12)
      .required("Move-in Month is required"),
    currentAddressFromYear: Yup.number()
      .min(1900)
      .required("Move-in Year is required"),
  }),
  Yup.object().shape({
    licenseNumber: Yup.string().required("License Number is required"),
    licenseState: Yup.string().required("License State is required"),
    positionAppliedFor: Yup.string().required("Position is required"),
  }),
  Yup.object().shape({
    addresses: Yup.array().of(
      Yup.object().shape({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zip: Yup.string().required("ZIP code is required"),
        fromMonth: Yup.number()
          .min(1)
          .max(12)
          .required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    ),
  }),
  Yup.object().shape({
    jobs: Yup.array()
      .of(
        Yup.object().shape({
          employerName: Yup.string().required("Employer Name is required"),
          positionHeld: Yup.string().required("Position Held is required"),
          fromMonth: Yup.number()
            .min(1)
            .max(12)
            .required("From Month is required"),
          fromYear: Yup.number().min(1900).required("From Year is required"),
          toMonth: Yup.number().min(1).max(12).required("To Month is required"),
          toYear: Yup.number().min(1900).required("To Year is required"),
        })
      )
      .min(1, "At least one job is required"),
  }),
  Yup.object().shape({
    socialSecurityNumber: Yup.string()
      .matches(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format 123-45-6789")
      .required("Social Security Number is required"),
    consentToBackgroundCheck: Yup.number()
      .min(1, "You must consent to background check to proceed")
      .required("Background check consent is required"),
  }),
];

const stepTitles = [
  "Personal Information",
  "Contact & Address",
  "License Information",
  "Address History",
  "Employment History",
  "Background Check",
];

const stepLabels = [
  "Personal Info",
  "Contact & Address",
  "License Info",
  "Address History",
  "Employment",
  "Background Check",
];

// Helper function to get fields for each step
const getStepFields = (step: number): (keyof DriverFormValues)[] => {
  switch (step) {
    case 0:
      return ["firstName", "lastName", "dob"];
    case 1:
      return [
        "phone",
        "email",
        "currentAddress",
        "currentCity",
        "currentState",
        "currentZip",
        "currentAddressFromMonth",
        "currentAddressFromYear",
      ];
    case 2:
      return ["licenseNumber", "licenseState", "positionAppliedFor"];
    case 3:
      return ["addresses"];
    case 4:
      return ["jobs"];
    case 5:
      return ["socialSecurityNumber", "consentToBackgroundCheck"];
    default:
      return [];
  }
};

export function DriverFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [needsAdditionalAddresses, setNeedsAdditionalAddresses] =
    useState(false);
  const [gapDetected, setGapDetected] = useState(false);
  const [residencyGapDetected, setResidencyGapDetected] = useState(false);
  const { toast } = useToast();

  const form = useForm<DriverFormValues>({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      email: "",
      currentAddress: "",
      currentCity: "",
      currentState: "",
      currentZip: "",
      currentAddressFromMonth: 1,
      currentAddressFromYear: new Date().getFullYear(),
      licenseNumber: "",
      licenseState: "",
      positionAppliedFor: "",
      addresses: [
        {
          address: "",
          city: "",
          state: "",
          zip: "",
          fromMonth: 1,
          fromYear: new Date().getFullYear(),
          toMonth: 1,
          toYear: new Date().getFullYear(),
        },
      ],
      jobs: [
        {
          employerName: "",
          positionHeld: "",
          fromMonth: 1,
          fromYear: new Date().getFullYear(),
          toMonth: 1,
          toYear: new Date().getFullYear(),
        },
      ],
      socialSecurityNumber: "",
      consentToBackgroundCheck: 0,
    },
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const {
    fields: jobFields,
    append: appendJob,
    remove: removeJob,
  } = useFieldArray({
    control: form.control,
    name: "jobs",
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("/api/driver-applications", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your driver application has been submitted successfully.",
      });
      form.reset();
      setCurrentStep(0);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description:
          error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update resolver when step changes
  useEffect(() => {
    form.clearErrors();
    const currentFields = getStepFields(currentStep);
    const currentSchema = stepSchemas[currentStep];

    // Create a custom resolver for the current step
    const stepResolver = yupResolver(currentSchema);
    form.resolver = stepResolver;
  }, [currentStep, form]);

  const onNext = async () => {
    const currentFields = getStepFields(currentStep);
    const isValid = await form.trigger(currentFields);

    if (isValid) {
      if (currentStep === 1) {
        checkResidencyRequirements();
      }
      if (currentStep === 4) {
        checkForEmploymentGaps();
      }
      if (currentStep < stepTitles.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit the form
        const data = form.getValues();
        onSubmit(data);
      }
    }
  };

  const checkResidencyRequirements = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentAddressFromYear = form.getValues("currentAddressFromYear");
    const currentAddressFromMonth = form.getValues("currentAddressFromMonth");

    // Check if current address is less than 3 years
    const yearsAtCurrentAddress =
      currentYear -
      currentAddressFromYear +
      (currentMonth - currentAddressFromMonth) / 12;

    if (yearsAtCurrentAddress < 3) {
      setNeedsAdditionalAddresses(true);
      setResidencyGapDetected(true);
    }
  };

  const checkForResidencyGaps = () => {
    const addresses = form.getValues("addresses");
    if (addresses.length < 2) return;

    // Sort addresses by date
    const sortedAddresses = [...addresses].sort((a, b) => {
      const aDate = new Date(a.fromYear, a.fromMonth - 1);
      const bDate = new Date(b.fromYear, b.fromMonth - 1);
      return aDate.getTime() - bDate.getTime();
    });

    // Check for gaps
    for (let i = 0; i < sortedAddresses.length - 1; i++) {
      const current = sortedAddresses[i];
      const next = sortedAddresses[i + 1];

      const currentEndDate = new Date(current.toYear, current.toMonth - 1);
      const nextStartDate = new Date(next.fromYear, next.fromMonth - 1);

      const gapInMonths =
        (nextStartDate.getTime() - currentEndDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30);

      if (gapInMonths > 1) {
        setResidencyGapDetected(true);
        return;
      }
    }
    setResidencyGapDetected(false);
  };

  const checkForEmploymentGaps = () => {
    const jobs = form.getValues("jobs");
    if (jobs.length < 2) return;

    // Sort jobs by date
    const sortedJobs = [...jobs].sort((a, b) => {
      const aDate = new Date(a.fromYear, a.fromMonth - 1);
      const bDate = new Date(b.fromYear, b.fromMonth - 1);
      return aDate.getTime() - bDate.getTime();
    });

    // Check for gaps
    for (let i = 0; i < sortedJobs.length - 1; i++) {
      const current = sortedJobs[i];
      const next = sortedJobs[i + 1];

      const currentEndDate = new Date(current.toYear, current.toMonth - 1);
      const nextStartDate = new Date(next.fromYear, next.fromMonth - 1);

      const gapInMonths =
        (nextStartDate.getTime() - currentEndDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30);

      if (gapInMonths > 1) {
        setGapDetected(true);
        return;
      }
    }
    setGapDetected(false);
  };

  const calculateJobDuration = (jobs: any[]) => {
    return jobs.reduce((total, job) => {
      const startDate = new Date(job.fromYear, job.fromMonth - 1);
      const endDate = new Date(job.toYear, job.toMonth - 1);
      const duration =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + duration;
    }, 0);
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: any) => {
    const formattedData = {
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dob,
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
      addresses: data.addresses.map((addr: any) => ({
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        fromMonth: Number(addr.fromMonth),
        fromYear: Number(addr.fromYear),
        toMonth: Number(addr.toMonth),
        toYear: Number(addr.toYear),
      })),
      jobs: data.jobs.map((job: any) => ({
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
    submitMutation.mutate(formattedData);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <IdCard className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Driver Qualification Application
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Complete all sections to submit your driver application
                  </p>
                </div>
              </div>

              {/* Test Data Buttons - Only show in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadTestData(form, "full");
                      setCurrentStep(0);
                      setNeedsAdditionalAddresses(true);
                      setGapDetected(false);
                      setResidencyGapDetected(false);
                      toast({
                        title: "Test Data Loaded",
                        description:
                          "Full test data has been loaded into the form.",
                      });
                    }}
                    className="text-xs"
                  >
                    Load Full Test Data
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadTestData(form, "minimal");
                      setCurrentStep(0);
                      setNeedsAdditionalAddresses(false);
                      setGapDetected(false);
                      setResidencyGapDetected(false);
                      toast({
                        title: "Test Data Loaded",
                        description:
                          "Minimal test data has been loaded into the form.",
                      });
                    }}
                    className="text-xs"
                  >
                    Load Minimal Test Data
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadTestData(form, "gaps");
                      setCurrentStep(0);
                      setNeedsAdditionalAddresses(true);
                      setGapDetected(true);
                      setResidencyGapDetected(true);
                      toast({
                        title: "Test Data Loaded",
                        description:
                          "Test data with gaps has been loaded into the form.",
                      });
                    }}
                    className="text-xs"
                  >
                    Load Gaps Test Data
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <ProgressStepper
              currentStep={currentStep}
              totalSteps={stepTitles.length}
              stepTitles={stepTitles}
              stepLabels={stepLabels}
            />
          </CardContent>
        </Card>

        {/* Main Form Content */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Label required>First Name</Label>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Label required>Last Name</Label>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Label required>Date of Birth</Label>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={currentStep === 0}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Save Draft
                    </Button>

                    {currentStep < stepTitles.length - 1 ? (
                      <Button
                        type="button"
                        onClick={onNext}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={currentStep === 4 && gapDetected}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={onNext}
                        disabled={submitMutation.isPending}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {submitMutation.isPending
                          ? "Submitting..."
                          : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
