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
  isSavingDraft?: boolean;
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
  isSavingDraft = false,
  className,
}: FormNavigationProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-slate-200 mt-6 sm:mt-8 space-y-4 sm:space-y-0 gap-2 ${className}`}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-full sm:w-auto order-2 sm:order-1"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto order-1 sm:order-2">
        {onSaveDraft && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="text-slate-500 hover:text-slate-700 w-full sm:w-auto text-sm"
          >
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
        )}

        {!isLastStep ? (
          <Button
            type="button"
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
            disabled={gapDetected}
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Continue</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="hidden sm:inline">Submitting...</span>
                <span className="sm:hidden">Submitting</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Submit Application</span>
                <span className="sm:hidden">Submit</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
