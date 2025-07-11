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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {stepConfig.title}
        </h2>
        <span className="text-sm text-slate-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      <Progress value={progressPercentage} className="mb-6 h-3" />

      <div className="flex items-start justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <StepIndicator
            key={index}
            step={index}
            currentStep={currentStep}
            label={getStepConfig(index).label}
          />
        ))}
      </div>
    </div>
  );
}
