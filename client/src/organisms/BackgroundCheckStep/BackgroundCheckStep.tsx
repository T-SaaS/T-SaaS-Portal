import { Control } from "react-hook-form";
import { SSNInput } from "@/molecules/SSNInput";
import { ConsentCheckbox } from "@/molecules/ConsentCheckbox";
import { InfoCard } from "@/atoms/InfoCard";
import type { DriverFormValues } from "@/types/driverApplicationForm";

export interface BackgroundCheckStepProps {
  control: Control<DriverFormValues>;
  className?: string;
}

export function BackgroundCheckStep({
  control,
  className,
}: BackgroundCheckStepProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <InfoCard
        variant="info"
        title="Background Check Authorization"
        description="To complete your driver application, we need to perform a comprehensive background check including criminal history, driving record, and employment verification."
      />

      <SSNInput
        control={control}
        name="socialSecurityNumber"
        label="Social Security Number"
        required
      />

      <InfoCard
        variant="warning"
        title="Background Check Details"
        description=""
      >
        <div className="text-amber-700 text-sm space-y-1">
          <p>
            • <strong>Criminal History Check:</strong> National and local
            criminal records
          </p>
          <p>
            • <strong>Driving Record:</strong> MVR check for violations,
            suspensions, and accidents
          </p>
          <p>
            • <strong>Employment Verification:</strong> Confirmation of previous
            employment history
          </p>
          <p>
            • <strong>Drug Screening:</strong> DOT-compliant drug testing
            (scheduled separately)
          </p>
        </div>
      </InfoCard>

      <ConsentCheckbox
        control={control}
        name="consentToBackgroundCheck"
        label="Background Check Consent"
        description="I hereby authorize the company to conduct a comprehensive background check including but not limited to: criminal history, driving record, employment verification, and drug screening. I understand that this information will be used to determine my eligibility for employment as a driver. I certify that all information provided is true and accurate to the best of my knowledge."
        required
      />

      <InfoCard
        variant="success"
        title="Next Steps"
        description="After submitting your application, we'll initiate the background check process. You'll receive updates via email and can track the status in your applicant portal."
      />
    </div>
  );
}
