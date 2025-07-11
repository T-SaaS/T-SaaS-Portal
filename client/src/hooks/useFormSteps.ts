import { getTotalSteps } from "@/schemas/stepSchemas";
import type { FormStep } from "@/types/driverApplicationForm";
import { useCallback, useState } from "react";

export const useFormSteps = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(0);
  const [needsAdditionalAddresses, setNeedsAdditionalAddresses] =
    useState(false);
  const [gapDetected, setGapDetected] = useState(false);
  const [residencyGapDetected, setResidencyGapDetected] = useState(false);

  const totalSteps = getTotalSteps();

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canGoNext = currentStep < totalSteps - 1;
  const canGoBack = currentStep > 0;

  const getProgressPercentage = () => {
    return ((currentStep + 1) / totalSteps) * 100;
  };

  const resetSteps = useCallback(() => {
    setCurrentStep(0);
    setNeedsAdditionalAddresses(false);
    setGapDetected(false);
    setResidencyGapDetected(false);
  }, []);

  return {
    currentStep,
    totalSteps,
    needsAdditionalAddresses,
    gapDetected,
    residencyGapDetected,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoBack,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    getProgressPercentage,
    setNeedsAdditionalAddresses,
    setGapDetected,
    setResidencyGapDetected,
    resetSteps,
  };
};
