import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { JobForm } from "@/molecules/JobForm";
import { GapWarning } from "@/atoms/GapWarning";
import { useGapDetection } from "@/hooks/useGapDetection";
import { useMemo } from "react";
import type {
  DriverFormValues,
  GapPeriod,
} from "@/types/driverApplicationForm";

export interface EmploymentHistoryStepProps {
  control: Control<DriverFormValues>;
  gapDetected: boolean;
  unemploymentPeriods: GapPeriod[];
  onAcknowledgeGaps?: () => void;
  onGapDetectionChange?: (gapDetected: boolean, periods: GapPeriod[]) => void;
  className?: string;
}

export function EmploymentHistoryStep({
  control,
  gapDetected,
  unemploymentPeriods,
  onAcknowledgeGaps,
  onGapDetectionChange,
  className,
}: EmploymentHistoryStepProps) {
  const { checkForEmploymentGaps } = useGapDetection();

  // Watch all job fields for real-time validation
  const jobs = useWatch({
    control,
    name: "jobs",
  });

  // Real-time gap detection
  const gapDetectionResult = useMemo(() => {
    return checkForEmploymentGaps(jobs || []);
  }, [jobs, checkForEmploymentGaps]);

  // Notify parent component of gap detection changes
  useMemo(() => {
    if (onGapDetectionChange) {
      onGapDetectionChange(
        gapDetectionResult.gapDetected,
        gapDetectionResult.periods
      );
    }
  }, [gapDetectionResult, onGapDetectionChange]);

  const {
    fields: jobFields,
    append: appendJob,
    remove: removeJob,
  } = useFieldArray({
    control,
    name: "jobs",
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">
          Employment History
        </h3>
        <Button
          type="button"
          onClick={() =>
            appendJob({
              employerName: "",
              positionHeld: "",
              fromMonth: 1,
              fromYear: new Date().getFullYear(),
              toMonth: 12,
              toYear: new Date().getFullYear(),
              businessName: "",
              companyEmail: "",
            })
          }
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Show real-time gap detection */}
      {gapDetectionResult.gapDetected && (
        <GapWarning
          title="Employment Gap Detected"
          description="We detected gaps in your employment history. Please add additional jobs or explain unemployment periods to meet the 36-month requirement."
          periods={gapDetectionResult.periods}
          onAcknowledge={onAcknowledgeGaps}
        />
      )}

      {/* Show existing gap warning if provided by parent */}
      {gapDetected && !gapDetectionResult.gapDetected && (
        <GapWarning
          title="Employment Gap Detected"
          description="We detected gaps in your employment history. Please add additional jobs or explain unemployment periods to meet the 36-month requirement."
          periods={unemploymentPeriods}
          onAcknowledge={onAcknowledgeGaps}
        />
      )}

      {jobFields.map((item, index) => (
        <Card key={item.id} className="border border-slate-200 bg-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">Job {index + 1}</h4>
              {jobFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeJob(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <JobForm
              control={control}
              employerName={`jobs.${index}.employerName`}
              positionHeldName={`jobs.${index}.positionHeld`}
              fromMonthName={`jobs.${index}.fromMonth`}
              fromYearName={`jobs.${index}.fromYear`}
              toMonthName={`jobs.${index}.toMonth`}
              toYearName={`jobs.${index}.toYear`}
              businessName={`jobs.${index}.businessName`}
              companyEmail={`jobs.${index}.companyEmail`}
              label="Employment Details"
              required
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
