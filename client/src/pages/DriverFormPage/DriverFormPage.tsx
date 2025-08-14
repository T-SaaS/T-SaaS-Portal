import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormNavigation } from "@/organisms/FormNavigation";
import { DriverFormTemplate } from "@/templates/DriverFormTemplate";
import { PersonalInfoStep } from "@/organisms/PersonalInfoStep";
import { ContactAddressStep } from "@/organisms/ContactAddressStep";
import { LicenseInfoStep } from "@/organisms/LicenseInfoStep";
import { AddressHistoryStep } from "@/organisms/AddressHistoryStep";
import { EmploymentHistoryStep } from "@/organisms/EmploymentHistoryStep";
import { BackgroundCheckConsentsStep } from "@/organisms/BackgroundCheckConsentsStep/BackgroundCheckConsentsStep";
import { DrugAlcoholTestingConsentStep } from "@/organisms/DrugAlcoholTestingConsentStep/DrugAlcoholTestingConsentStep";
import { GeneralApplicationConsentStep } from "@/organisms/GeneralApplicationConsentStep/GeneralApplicationConsentStep";
import { useDriverApplicationForm } from "@/hooks/useDriverApplicationForm";
import { useFormSteps } from "@/hooks/useFormSteps";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { useGapDetection } from "@/hooks/useGapDetection";
import { useDraft } from "@/hooks/useDraft";
import { loadTestData } from "@/utils/testData";
import { useToast } from "@/hooks/use-toast";
import { useCompanyContext } from "@/contexts/CompanyContext";
import type { GapPeriod } from "@/types/driverApplicationForm";

export function DriverFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { company } = useCompanyContext();
  const [unemploymentPeriods, setUnemploymentPeriods] = useState<GapPeriod[]>(
    []
  );
  const [residencyPeriods, setResidencyPeriods] = useState<GapPeriod[]>([]);

  // Ref to track if draft has been loaded to prevent infinite loops
  const draftLoadedRef = useRef(false);

  const companyName = company?.name;

  const {
    currentStep,
    needsAdditionalAddresses,
    gapDetected,
    residencyGapDetected,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    setNeedsAdditionalAddresses,
    setGapDetected,
    setResidencyGapDetected,
    resetSteps,
  } = useFormSteps();

  const { form, validateCurrentStep } = useDriverApplicationForm(currentStep);
  const { submitForm, isSubmitting } = useFormSubmission();
  const { checkResidencyRequirements, checkForEmploymentGaps } =
    useGapDetection();

  // Draft functionality
  const {
    saveDraft,
    resumeDraft,
    isSavingDraft,
    isResumingDraft,
    resumeToken,
    convertDraftToFormValues,
    draftData,
  } = useDraft();

  const driverName = `${form.watch("firstName")} ${form.watch("lastName")}`;

  // Function to scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Handle draft resume from URL token
  useEffect(() => {
    if (resumeToken && !isResumingDraft && !draftData) {
      // Reset the draft loaded flag when starting a new resume
      draftLoadedRef.current = false;
      resumeDraft(resumeToken);
    }
  }, [resumeToken, isResumingDraft, draftData, resumeDraft]);

  // Load draft data into form when available
  useEffect(() => {
    if (draftData && !draftLoadedRef.current) {
      const formValues = convertDraftToFormValues(draftData);

      // Reset form with draft data
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.setValue(key as any, value);
        }
      });

      // Reset steps to beginning
      resetSteps();

      // Mark draft as loaded to prevent infinite loops
      draftLoadedRef.current = true;

      toast({
        title: "Draft Loaded",
        description: "Your saved draft has been loaded successfully.",
      });
    }
  }, [draftData, convertDraftToFormValues, form, resetSteps, toast]);

  // Cleanup effect to reset draft loaded flag on unmount
  useEffect(() => {
    return () => {
      draftLoadedRef.current = false;
    };
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    // Small delay to ensure content has rendered
    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const onNext = async () => {

    const valid = await validateCurrentStep();

    if (valid) {
      if (currentStep === 1) {
        const needsAddresses = checkResidencyRequirements(
          form.watch("currentAddressFromMonth"),
          form.watch("currentAddressFromYear")
        );
        setNeedsAdditionalAddresses(needsAddresses);
        if (!needsAddresses) {
          // Skip to employment history
          goToNextStep();
          goToNextStep();
          return;
        }
      } else if (currentStep === 3 && needsAdditionalAddresses) {
        // Gap detection is now handled automatically in the AddressHistoryStep component
        // Just check if there are any gaps detected
        if (residencyGapDetected) {
          return; // Don't proceed if gaps are detected
        }
      } else if (currentStep === 4) {
        const employmentGaps = checkForEmploymentGaps(form.watch("jobs"));
        if (employmentGaps.gapDetected) {
          setGapDetected(true);
          setUnemploymentPeriods(employmentGaps.periods);
          return;
        }
      } else if (currentStep === 7) {
        // Final step - submit the form

        try {
          await submitForm(form.getValues());
          // Navigate to thank you page after successful submission
          navigate("/thank-you");
        } catch (error) {
          // Error handling is done in the submitForm function
          console.error("Form submission failed:", error);
        }
        return;
      }
      goToNextStep();
    }
  };

  const onBack = () => {
    if (currentStep === 4 && !needsAdditionalAddresses) {
      // Skip back to license info (step 2) if address history was skipped
      goToPreviousStep();
      goToPreviousStep();
    } else {
      goToPreviousStep();
    }
  };

  const handleAcknowledgeResidencyGaps = () => {
    setResidencyGapDetected(false);
    goToNextStep();
  };

  const handleAcknowledgeEmploymentGaps = () => {
    setGapDetected(false);
    goToNextStep();
  };

  const handleLoadTestData = (type: "full" | "minimal" | "gaps") => {
    loadTestData(form, type);
    resetSteps();
    if (type === "full" || type === "gaps") {
      setNeedsAdditionalAddresses(true);
    }
    toast({
      title: "Test Data Loaded",
      description: `${type} test data has been loaded into the form.`,
    });
  };

  const handleSaveDraft = () => {
    const formValues = form.getValues();

    // Only save if we have at least an email
    if (!formValues.email) {
      toast({
        title: "Cannot Save Draft",
        description: "Please provide an email address to save your draft.",
        variant: "destructive",
      });
      return;
    }
    saveDraft(formValues);
  };

  const handleResidencyGapDetectionChange = (
    gapDetected: boolean,
    periods: GapPeriod[]
  ) => {
    setResidencyGapDetected(gapDetected);
    setResidencyPeriods(periods);
  };

  const handleEmploymentGapDetectionChange = (
    gapDetected: boolean,
    periods: GapPeriod[]
  ) => {
    setGapDetected(gapDetected);
    setUnemploymentPeriods(periods);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep control={form.control as any} />;
      case 1:
        return <ContactAddressStep control={form.control as any} />;
      case 2:
        return <LicenseInfoStep control={form.control as any} />;
      case 3:
        return (
          <AddressHistoryStep
            control={form.control as any}
            needsAdditionalAddresses={needsAdditionalAddresses}
            residencyGapDetected={residencyGapDetected}
            residencyPeriods={residencyPeriods}
            onAcknowledgeGaps={handleAcknowledgeResidencyGaps}
            onGapDetectionChange={handleResidencyGapDetectionChange}
          />
        );
      case 4:
        return (
          <EmploymentHistoryStep
            control={form.control as any}
            gapDetected={gapDetected}
            unemploymentPeriods={unemploymentPeriods}
            onAcknowledgeGaps={handleAcknowledgeEmploymentGaps}
            onGapDetectionChange={handleEmploymentGapDetectionChange}
          />
        );
      case 5:
        return (
          <BackgroundCheckConsentsStep
            companyName={companyName}
            driverName={driverName}
          />
        );
      case 6:
        return (
          <DrugAlcoholTestingConsentStep
            companyName={companyName}
            driverName={driverName}
          />
        );
      case 7:
        return (
          <GeneralApplicationConsentStep
            companyName={companyName}
            driverName={driverName}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state while resuming draft
  if (isResumingDraft) {
    return (
      <DriverFormTemplate currentStep={currentStep}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">
              Loading your saved draft...
            </p>
          </div>
        </div>
      </DriverFormTemplate>
    );
  }

  return (
    <DriverFormTemplate currentStep={currentStep}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm as any)}
          className="space-y-6"
        >
          {/* Test Data Buttons - Only show in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex space-y2 md:space-x-2 mb-6 flex-col md:flex-row">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleLoadTestData("full")}
                className="text-xs"
              >
                Load Full Test Data
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleLoadTestData("minimal")}
                className="text-xs"
              >
                Load Minimal Test Data
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleLoadTestData("gaps")}
                className="text-xs"
              >
                Load Gaps Test Data
              </Button>
            </div>
          )}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation */}
          <FormNavigation
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            gapDetected={currentStep === 4 && gapDetected}
            onPrevious={onBack}
            onNext={onNext}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={isSavingDraft}
          />
        </form>
      </Form>
    </DriverFormTemplate>
  );
}
