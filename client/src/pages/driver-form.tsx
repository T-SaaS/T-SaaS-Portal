import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { IdCard, ChevronLeft, ChevronRight, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertDriverApplication } from "@shared/schema";

const stepSchemas = [
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    dob: Yup.string().required("Date of Birth is required"),
  }),
  Yup.object().shape({
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
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
        fromMonth: Yup.number().min(1).max(12).required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    ).min(1, "At least one address is required"),
  }),
  Yup.object().shape({
    jobs: Yup.array().of(
      Yup.object().shape({
        employerName: Yup.string().required("Employer Name is required"),
        positionHeld: Yup.string().required("Position Held is required"),
        fromMonth: Yup.number().min(1).max(12).required("From Month is required"),
        fromYear: Yup.number().min(1900).required("From Year is required"),
        toMonth: Yup.number().min(1).max(12).required("To Month is required"),
        toYear: Yup.number().min(1900).required("To Year is required"),
      })
    ).min(1, "At least one job is required"),
  })
];

const stepTitles = ["Personal Information", "Contact Information", "License Information", "Address History", "Employment History"];
const stepLabels = ["Personal Info", "Contact Info", "License Info", "Address History", "Employment"];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

const positions = [
  { value: "local-driver", label: "Local Driver" },
  { value: "regional-driver", label: "Regional Driver" },
  { value: "long-haul-driver", label: "Long Haul Driver" },
  { value: "delivery-driver", label: "Delivery Driver" }
];

export default function DriverForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gapDetected, setGapDetected] = useState(false);
  const [unemploymentPeriods, setUnemploymentPeriods] = useState<Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }>>([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      email: "",
      licenseNumber: "",
      licenseState: "",
      positionAppliedFor: "",
      addresses: [],
      jobs: []
    },
    mode: "onTouched"
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control: form.control,
    name: "addresses"
  });

  const { fields: jobFields, append: appendJob, remove: removeJob } = useFieldArray({
    control: form.control,
    name: "jobs"
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertDriverApplication) => {
      const response = await apiRequest("POST", "/api/driver-applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully",
        description: "Your driver qualification application has been submitted for review.",
      });
      form.reset();
      setCurrentStep(0);
      setGapDetected(false);
      setUnemploymentPeriods([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onNext = async () => {
    const valid = await form.trigger();
    if (valid) {
      if (currentStep === 4) {
        checkForEmploymentGaps();
      } else {
        setCurrentStep((prev) => prev + 1);
        // Update form resolver for next step
        form.clearErrors();
      }
    }
  };

  const checkForEmploymentGaps = () => {
    const jobs = form.watch("jobs").sort((a, b) => {
      const aDate = dayjs(`${a.toYear}-${a.toMonth}-01`).endOf('month');
      const bDate = dayjs(`${b.toYear}-${b.toMonth}-01`).endOf('month');
      return bDate.diff(aDate);
    });

    let gaps: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }> = [];
    const today = dayjs();
    let lastToDate = today;

    jobs.forEach((job) => {
      const jobTo = dayjs(`${job.toYear}-${job.toMonth}-01`).endOf('month');
      const jobFrom = dayjs(`${job.fromYear}-${job.fromMonth}-01`).startOf('month');

      if (lastToDate.diff(jobTo, 'month') > 1) {
        gaps.push({
          from: jobTo.add(1, 'month'),
          to: lastToDate.subtract(1, 'month')
        });
      }
      lastToDate = jobFrom;
    });

    const totalMonths = calculateJobDuration(jobs);

    if (gaps.length > 0 || totalMonths < 36) {
      setGapDetected(true);
      setUnemploymentPeriods(gaps);
    } else {
      setGapDetected(false);
      onSubmit(form.getValues());
    }
  };

  const calculateJobDuration = (jobs: any[]) => {
    let totalMonths = 0;
    jobs.forEach((job) => {
      const from = dayjs(`${job.fromYear}-${job.fromMonth}-01`);
      const to = dayjs(`${job.toYear}-${job.toMonth}-01`).endOf('month');
      totalMonths += to.diff(from, 'month') + 1;
    });
    return totalMonths;
  };

  const onBack = () => {
    setCurrentStep((prev) => prev - 1);
    form.clearErrors();
  };

  const onSubmit = (data: any) => {
    const formattedData: InsertDriverApplication = {
      ...data,
      addresses: data.addresses.map((addr: any) => ({
        ...addr,
        fromMonth: Number(addr.fromMonth),
        fromYear: Number(addr.fromYear),
        toMonth: Number(addr.toMonth),
        toYear: Number(addr.toYear),
      })),
      jobs: data.jobs.map((job: any) => ({
        ...job,
        fromMonth: Number(job.fromMonth),
        fromYear: Number(job.fromYear),
        toMonth: Number(job.toMonth),
        toYear: Number(job.toYear),
      })),
    };
    submitMutation.mutate(formattedData);
  };

  const progressPercentage = ((currentStep + 1) / stepTitles.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <IdCard className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Driver Qualification Application</h1>
                <p className="text-slate-600 mt-1">Complete all sections to submit your driver application</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{stepTitles[currentStep]}</h2>
              <span className="text-sm text-slate-500">Step {currentStep + 1} of {stepTitles.length}</span>
            </div>
            
            <Progress value={progressPercentage} className="mb-6 h-3" />
            
            <div className="flex items-center justify-between">
              {stepTitles.map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className={`text-xs text-center max-w-20 ${
                    index <= currentStep ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {stepLabels[index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Form Content */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
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
                          <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.smith@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: License Information */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="D123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="licenseState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License State <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="positionAppliedFor"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Position Applied For <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions.map((position) => (
                                <SelectItem key={position.value} value={position.value}>
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Address History */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-900">Address History</h3>
                      <Button
                        type="button"
                        onClick={() => appendAddress({
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                          fromMonth: 1,
                          fromYear: new Date().getFullYear(),
                          toMonth: 12,
                          toYear: new Date().getFullYear()
                        })}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                    
                    {addressFields.map((item, index) => (
                      <div key={item.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-slate-900">Address {index + 1}</h4>
                          {addressFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAddress(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.address`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.city`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="San Francisco" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.state`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {states.map((state) => (
                                      <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.zip`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="94102" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.fromMonth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Date</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                          {month.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name={`addresses.${index}.fromYear`}
                                    render={({ field: yearField }) => (
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="2020"
                                          {...yearField}
                                          onChange={(e) => yearField.onChange(Number(e.target.value))}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.toMonth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Date</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                          {month.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name={`addresses.${index}.toYear`}
                                    render={({ field: yearField }) => (
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="2024"
                                          {...yearField}
                                          onChange={(e) => yearField.onChange(Number(e.target.value))}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 5: Employment History */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-900">Employment History</h3>
                      <Button
                        type="button"
                        onClick={() => appendJob({
                          employerName: "",
                          positionHeld: "",
                          fromMonth: 1,
                          fromYear: new Date().getFullYear(),
                          toMonth: 12,
                          toYear: new Date().getFullYear()
                        })}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </div>
                    
                    {gapDetected && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="text-amber-500 mt-1 h-5 w-5" />
                          <div>
                            <h4 className="font-medium text-amber-800">Employment Gap Detected</h4>
                            <p className="text-amber-700 text-sm mt-1">
                              We detected gaps in your employment history. Please add additional jobs or explain unemployment periods to meet the 36-month requirement.
                            </p>
                            {unemploymentPeriods.map((gap, idx) => (
                              <p key={idx} className="text-amber-700 text-sm">
                                Gap between {gap.from.format('MM/YYYY')} and {gap.to.format('MM/YYYY')}
                              </p>
                            ))}
                            <Button
                              type="button"
                              className="mt-2 bg-amber-600 hover:bg-amber-700"
                              onClick={() => onSubmit(form.getValues())}
                            >
                              I Was Unemployed During These Periods
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {jobFields.map((item, index) => (
                      <div key={item.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-slate-900">Job {index + 1}</h4>
                          {jobFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeJob(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.employerName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employer Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="ABC Transportation" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.positionHeld`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position Held</FormLabel>
                                <FormControl>
                                  <Input placeholder="Delivery Driver" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.fromMonth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Date</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                          {month.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name={`jobs.${index}.fromYear`}
                                    render={({ field: yearField }) => (
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="2021"
                                          {...yearField}
                                          onChange={(e) => yearField.onChange(Number(e.target.value))}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.toMonth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Date</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                          {month.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name={`jobs.${index}.toYear`}
                                    render={({ field: yearField }) => (
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="2024"
                                          {...yearField}
                                          onChange={(e) => yearField.onChange(Number(e.target.value))}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
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
                    <Button type="button" variant="ghost" className="text-slate-500 hover:text-slate-700">
                      Save Draft
                    </Button>
                    
                    {currentStep < stepTitles.length - 1 ? (
                      <Button
                        type="button"
                        onClick={onNext}
                        className="bg-blue-500 hover:bg-blue-600"
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
                        {submitMutation.isPending ? "Submitting..." : "Submit Application"}
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
