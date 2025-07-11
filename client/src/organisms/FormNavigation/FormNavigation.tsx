import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FormNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  gapDetected: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  className?: string;
}

export function FormNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  gapDetected,
  onPrevious,
  onNext,
  onSaveDraft,
  className,
}: FormNavigationProps) {
  return (
    <div
      className={`flex items-center justify-between pt-8 border-t border-slate-200 mt-8 ${className}`}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="bg-slate-100 hover:bg-slate-200 text-slate-700"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <div className="flex items-center space-x-4">
        {onSaveDraft && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSaveDraft}
            className="text-slate-500 hover:text-slate-700"
          >
            Save Draft
          </Button>
        )}

        {!isLastStep ? (
          <Button
            type="button"
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={gapDetected}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
