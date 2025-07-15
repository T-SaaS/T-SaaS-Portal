import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  stepLabels: string[];
  className?: string;
}

export function ProgressStepper({
  currentStep,
  totalSteps,
  stepTitles,
  stepLabels,
  className,
}: ProgressStepperProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {stepTitles[currentStep]}
        </h2>
        <span className="text-sm text-slate-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      <Progress value={progressPercentage} className="h-3" />

      <div className="grid grid-cols-6 gap-2 sm:gap-4">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index <= currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs text-center transition-colors w-full px-1",
                index <= currentStep ? "text-slate-600" : "text-slate-400"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
