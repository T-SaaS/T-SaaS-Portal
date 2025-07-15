import { useState } from "react";
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
import { ApplicationConsentsStep } from "@/organisms/ApplicationConsentsStep/ApplicationConsentsStep";
import { useDriverApplicationForm } from "@/hooks/useDriverApplicationForm";
import { useFormSteps } from "@/hooks/useFormSteps";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { useGapDetection } from "@/hooks/useGapDetection";
import { loadTestData } from "@/utils/testData";
import { useToast } from "@/hooks/use-toast";
import { useCompanyContext } from "@/contexts/CompanyContext";
import type { GapPeriod } from "@/types/driverApplicationForm";

export function DriverFormPageRefactored() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { company } = useCompanyContext();
  const [unemploymentPeriods, setUnemploymentPeriods] = useState<GapPeriod[]>(
    []
  );
  const [residencyPeriods, setResidencyPeriods] = useState<GapPeriod[]>([]);

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
      } else if (currentStep === 5) {
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
        return <ApplicationConsentsStep companyName={companyName} />;
      default:
        return null;
    }
  };

  return (
    <DriverFormTemplate currentStep={currentStep}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm as any)}
          className="space-y-6"
        >
          {/* Test Data Buttons - Only show in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex space-x-2 mb-6">
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
            onSaveDraft={() => {
              // TODO: Implement save draft functionality
              toast({
                title: "Draft Saved",
                description: "Your progress has been saved as a draft.",
              });
            }}
          />
        </form>
      </Form>
    </DriverFormTemplate>
  );
}
