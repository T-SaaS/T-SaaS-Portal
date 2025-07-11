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
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
          {
            "bg-blue-500 text-white": isActive || isCompleted,
            "bg-slate-200 text-slate-500": isUpcoming,
          }
        )}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : step + 1}
      </div>
      <span
        className={cn("text-xs text-center max-w-20 transition-colors", {
          "text-slate-600": isActive || isCompleted,
          "text-slate-400": isUpcoming,
        })}
      >
        {label}
      </span>
    </div>
  );
}
