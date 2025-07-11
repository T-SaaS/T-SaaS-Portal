import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GapPeriod } from "@/types/driverApplicationForm";

export interface GapWarningProps {
  title: string;
  description: string;
  periods: GapPeriod[];
  onAcknowledge?: () => void;
  acknowledgeText?: string;
  className?: string;
}

export function GapWarning({
  title,
  description,
  periods,
  onAcknowledge,
  acknowledgeText,
  className,
}: GapWarningProps) {
  // Determine if we have overlaps vs gaps
  const hasOverlaps = periods.some((period) => period.type === "overlap");
  const hasGaps = periods.some(
    (period) => period.type === "gap" || !period.type
  );

  // Auto-generate appropriate acknowledge text if not provided
  const finalAcknowledgeText =
    acknowledgeText ||
    (hasOverlaps && !hasGaps
      ? "I Understand These Overlaps"
      : "I Understand, Continue Anyway");
  return (
    <div
      className={cn(
        "bg-amber-50 border border-amber-200 rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="text-amber-500 mt-1 h-5 w-5" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-800">{title}</h4>
          <p className="text-amber-700 text-sm mt-1">{description}</p>
          {periods.map((period, idx) => (
            <p key={idx} className="text-amber-700 text-sm">
              {period.type === "overlap" ? "Overlap" : "Gap"} between{" "}
              {period.from} and {period.to}
            </p>
          ))}
          {onAcknowledge && (
            <Button
              type="button"
              className="mt-2 bg-amber-600 hover:bg-amber-700"
              onClick={onAcknowledge}
            >
              {finalAcknowledgeText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
