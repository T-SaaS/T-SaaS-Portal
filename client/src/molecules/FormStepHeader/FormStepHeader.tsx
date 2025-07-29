import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "@/atoms/StepIndicator";
import { getStepConfig, getTotalSteps } from "@/schemas/stepSchemas";
import type { FormStep } from "@/types/driverApplicationForm";

export interface FormStepHeaderProps {
  currentStep: FormStep;
  className?: string;
}

export function FormStepHeader({
  currentStep,
  className,
}: FormStepHeaderProps) {
  const stepConfig = getStepConfig(currentStep);
  const totalSteps = getTotalSteps();
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={className}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg font-semibold text-slate-900">
          {stepConfig.title}
        </h2>
        <span className="text-sm text-slate-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercentage} className="mb-6 h-3" />

      {/* Step Indicators */}
      <div className="flex items-start justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <StepIndicator
            key={index}
            step={index}
            currentStep={currentStep}
            label={getStepConfig(index).label}
            className="flex-1 min-w-0"
          />
        ))}
      </div>

      {/* Mobile: Current Step Label */}
      <div className="mt-4 sm:hidden">
        <div className="text-center">
          <span className="text-sm font-medium text-blue-600">
            {stepConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}
