import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { AddressForm } from "@/molecules/AddressForm";
import { InfoCard } from "@/atoms/InfoCard";
import { GapWarning } from "@/atoms/GapWarning";
import { CheckCircle } from "lucide-react";
import dayjs from "dayjs";
import { useGapDetection } from "@/hooks/useGapDetection";
import { useMemo } from "react";
import type {
  DriverFormValues,
  GapPeriod,
} from "@/types/driverApplicationForm";

export interface AddressHistoryStepProps {
  control: Control<DriverFormValues>;
  needsAdditionalAddresses: boolean;
  residencyGapDetected: boolean;
  residencyPeriods: GapPeriod[];
  onAcknowledgeGaps?: () => void;
  onGapDetectionChange?: (gapDetected: boolean, periods: GapPeriod[]) => void;
  className?: string;
}

export function AddressHistoryStep({
  control,
  needsAdditionalAddresses,
  residencyGapDetected,
  residencyPeriods,
  onAcknowledgeGaps,
  onGapDetectionChange,
  className,
}: AddressHistoryStepProps) {
  const { checkForResidencyGaps } = useGapDetection();

  // Watch the current address fields to check residency duration
  const currentAddressFromMonth = useWatch({
    control,
    name: "currentAddressFromMonth",
  });
  const currentAddressFromYear = useWatch({
    control,
    name: "currentAddressFromYear",
  });

  // Watch all address fields for real-time validation
  const addresses = useWatch({
    control,
    name: "addresses",
  });

  // Check if user has lived at current address for 3+ years
  const hasLivedAtCurrentAddressForThreeYears = useMemo(() => {
    if (!currentAddressFromMonth || !currentAddressFromYear) return false;

    const currentAddressFrom = dayjs(
      `${currentAddressFromYear}-${currentAddressFromMonth}-01`
    );
    const threeYearsAgo = dayjs().subtract(3, "year");

    return currentAddressFrom.isBefore(threeYearsAgo);
  }, [currentAddressFromMonth, currentAddressFromYear]);

  // Real-time gap detection
  const gapDetectionResult = useMemo(() => {
    if (!needsAdditionalAddresses || hasLivedAtCurrentAddressForThreeYears) {
      return { gapDetected: false, periods: [] };
    }

    return checkForResidencyGaps(
      addresses || [],
      currentAddressFromMonth || 1,
      currentAddressFromYear || new Date().getFullYear()
    );
  }, [
    addresses,
    currentAddressFromMonth,
    currentAddressFromYear,
    needsAdditionalAddresses,
    hasLivedAtCurrentAddressForThreeYears,
    checkForResidencyGaps,
  ]);

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
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "addresses",
  });

  // Use the check to determine if address history is needed
  const needsAddressHistory =
    needsAdditionalAddresses || !hasLivedAtCurrentAddressForThreeYears;

  if (!needsAddressHistory) {
    return (
      <div className={className}>
        <InfoCard
          variant="success"
          title="Address History Complete"
          description="Since you've lived at your current address for 3 years or more, no additional address history is needed."
          icon={<CheckCircle className="text-green-500 mt-1 h-5 w-5" />}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <InfoCard
        variant="info"
        title="Address History Required"
        description="Since you've lived at your current address for less than 3 years, please provide your previous addresses to complete your 3-year residency history."
      />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Address History</h3>
        <Button
          type="button"
          onClick={() =>
            appendAddress({
              address: "",
              city: "",
              state: "",
              zip: "",
              fromMonth: 1,
              fromYear: new Date().getFullYear(),
              toMonth: new Date().getMonth() + 1,
              toYear: new Date().getFullYear(),
            })
          }
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Show real-time gap detection */}
      {gapDetectionResult.gapDetected && (
        <GapWarning
          title="Residency Gap Detected"
          description="We detected gaps in your 3-year residency history. Please add additional addresses to cover these periods."
          periods={gapDetectionResult.periods}
          onAcknowledge={onAcknowledgeGaps}
        />
      )}

      {/* Show existing gap warning if provided by parent */}
      {residencyGapDetected && !gapDetectionResult.gapDetected && (
        <GapWarning
          title="Residency Gap Detected"
          description="We detected gaps in your 3-year residency history. Please add additional addresses to cover these periods."
          periods={residencyPeriods}
          onAcknowledge={onAcknowledgeGaps}
        />
      )}

      {addressFields.map((item, index) => (
        <Card key={item.id} className="border border-slate-200 bg-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">
                Address {index + 1}
              </h4>
              {addressFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <AddressForm
              control={control}
              addressName={`addresses.${index}.address`}
              cityName={`addresses.${index}.city`}
              stateName={`addresses.${index}.state`}
              zipName={`addresses.${index}.zip`}
              fromMonthName={`addresses.${index}.fromMonth`}
              fromYearName={`addresses.${index}.fromYear`}
              toMonthName={`addresses.${index}.toMonth`}
              toYearName={`addresses.${index}.toYear`}
              label="Previous Address"
              required
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
