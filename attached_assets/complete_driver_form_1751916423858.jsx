import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stepSchemas = [
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    dob: Yup.date().required("Date of Birth is required"),
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

const StepTitles = ["Personal Information", "Contact Information", "License Information", "Address History", "Employment History"];

export default function CompleteDriverForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gapDetected, setGapDetected] = useState(false);
  const [unemploymentPeriods, setUnemploymentPeriods] = useState([]);

  const methods = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    defaultValues: {
      addresses: [],
      jobs: []
    },
    mode: "onTouched"
  });

  const { handleSubmit, register, formState: { errors }, trigger, watch } = methods;
  const { fields: addressFields, append: appendAddress } = useFieldArray({
    control: methods.control,
    name: "addresses"
  });
  const { fields: jobFields, append: appendJob } = useFieldArray({
    control: methods.control,
    name: "jobs"
  });

  const onNext = async () => {
    const valid = await trigger();
    if (valid) {
      if (currentStep === 4) {
        checkForEmploymentGaps();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const checkForEmploymentGaps = () => {
    const jobs = watch("jobs").sort((a, b) => {
      const aDate = dayjs(`${a.toYear}-${a.toMonth}-01`).endOf('month');
      const bDate = dayjs(`${b.toYear}-${b.toMonth}-01`).endOf('month');
      return bDate - aDate;
    });

    let gaps = [];
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
      setCurrentStep((prev) => prev + 1);
    }
  };

  const calculateJobDuration = (jobs) => {
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
  };

  const onSubmit = (data) => {
    console.log("Final Submission", data);
  };

  const progressPercentage = ((currentStep + 1) / StepTitles.length) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-3xl w-full p-6">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">{StepTitles[currentStep]}</h1>
          <Progress value={progressPercentage} className="mb-6 h-4" />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">

              {currentStep === 0 && (
                <>
                  <div>
                    <label>First Name</label>
                    <input {...register("firstName")} className="border p-2 w-full rounded" />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label>Last Name</label>
                    <input {...register("lastName")} className="border p-2 w-full rounded" />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                  </div>

                  <div>
                    <label>Date of Birth</label>
                    <input type="date" {...register("dob")} className="border p-2 w-full rounded" />
                    {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div>
                    <label>Phone</label>
                    <input {...register("phone")} className="border p-2 w-full rounded" />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label>Email</label>
                    <input {...register("email")} className="border p-2 w-full rounded" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label>License Number</label>
                    <input {...register("licenseNumber")} className="border p-2 w-full rounded" />
                    {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>}
                  </div>

                  <div>
                    <label>License State</label>
                    <input {...register("licenseState")} className="border p-2 w-full rounded" />
                    {errors.licenseState && <p className="text-red-500 text-sm">{errors.licenseState.message}</p>}
                  </div>

                  <div>
                    <label>Position Applied For</label>
                    <input {...register("positionAppliedFor")} className="border p-2 w-full rounded" />
                    {errors.positionAppliedFor && <p className="text-red-500 text-sm">{errors.positionAppliedFor.message}</p>}
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  {addressFields.map((item, index) => (
                    <div key={item.id} className="border p-4 rounded mb-4">
                      <h2 className="font-bold mb-2">Address {index + 1}</h2>
                      <div className="mb-2">
                        <label>Address</label>
                        <input {...register(`addresses.${index}.address`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>City</label>
                        <input {...register(`addresses.${index}.city`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>State</label>
                        <input {...register(`addresses.${index}.state`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>ZIP</label>
                        <input {...register(`addresses.${index}.zip`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>From Month</label>
                        <input type="number" {...register(`addresses.${index}.fromMonth`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>From Year</label>
                        <input type="number" {...register(`addresses.${index}.fromYear`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>To Month</label>
                        <input type="number" {...register(`addresses.${index}.toMonth`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>To Year</label>
                        <input type="number" {...register(`addresses.${index}.toYear`)} className="border p-2 w-full rounded" />
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={() => appendAddress({ address: "", city: "", state: "", zip: "", fromMonth: "", fromYear: "", toMonth: "", toYear: "" })}>Add Address</Button>
                </>
              )}

              {currentStep === 4 && (
                <>
                  {jobFields.map((item, index) => (
                    <div key={item.id} className="border p-4 rounded mb-4">
                      <h2 className="font-bold mb-2">Job {index + 1}</h2>
                      <div className="mb-2">
                        <label>Employer Name</label>
                        <input {...register(`jobs.${index}.employerName`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>Position Held</label>
                        <input {...register(`jobs.${index}.positionHeld`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>From Month</label>
                        <input type="number" {...register(`jobs.${index}.fromMonth`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>From Year</label>
                        <input type="number" {...register(`jobs.${index}.fromYear`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>To Month</label>
                        <input type="number" {...register(`jobs.${index}.toMonth`)} className="border p-2 w-full rounded" />
                      </div>
                      <div className="mb-2">
                        <label>To Year</label>
                        <input type="number" {...register(`jobs.${index}.toYear`)} className="border p-2 w-full rounded" />
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={() => appendJob({ employerName: "", positionHeld: "", fromMonth: "", fromYear: "", toMonth: "", toYear: "" })}>Add Job</Button>

                  {gapDetected && (
                    <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                      <h2 className="font-bold mb-2">Employment Gaps Detected</h2>
                      {unemploymentPeriods.map((gap, idx) => (
                        <p key={idx}>Please account for the gap between {gap.from.format('MM/YYYY')} and {gap.to.format('MM/YYYY')}.</p>
                      ))}
                      <p className="mt-2">If you were unemployed during these periods, please confirm and continue.</p>
                      <Button className="mt-2" onClick={() => setCurrentStep((prev) => prev + 1)}>I Was Unemployed During These Periods</Button>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between mt-4">
                {currentStep > 0 && (
                  <Button type="button" onClick={onBack}>Back</Button>
                )}

                {currentStep < StepTitles.length - 1 && (
                  <Button type="button" onClick={onNext}>Next</Button>
                )}

                {currentStep === StepTitles.length - 1 && (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
