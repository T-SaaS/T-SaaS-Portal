import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
  className?: string;
}

export function StepIndicator({
  step,
  currentStep,
  label,
  className,
}: StepIndicatorProps) {
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;
  const isUpcoming = step > currentStep;

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors",
          {
            "bg-blue-500 text-white": isActive || isCompleted,
            "bg-slate-200 text-slate-500": isUpcoming,
          }
        )}
      >
        {isCompleted ? (
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          step + 1
        )}
      </div>
      <span
        className={cn(
          "text-xs text-center max-w-16 sm:max-w-20 transition-colors hidden sm:block",
          {
            "text-slate-600": isActive || isCompleted,
            "text-slate-400": isUpcoming,
          }
        )}
      >
        {label}
      </span>
    </div>
  );
}
