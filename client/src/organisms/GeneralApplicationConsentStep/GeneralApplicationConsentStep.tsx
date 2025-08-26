import React from "react";
import { SignatureConsent } from "@/components/SignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CONSENT_TEXTS } from "@/utils/consentTexts";

interface GeneralApplicationConsentStepProps {
  companyName?: string;
  driverName?: string;
}

export const GeneralApplicationConsentStep: React.FC<
  GeneralApplicationConsentStepProps
> = ({ companyName, driverName }) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review and sign the general application consent form. This
          final consent covers the general terms and conditions for your
          employment application.
        </AlertDescription>
      </Alert>

      {/* General Application Consent */}
      <SignatureConsent
        title="General Application Consent"
        description="Authorization for general application terms and conditions"
        consentText={CONSENT_TEXTS.generalApplication(
          driverName || "",
          companyName || ""
        )}
        fieldName="generalConsentSignature"
        required={true}
      />

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            General Application Consent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <strong>Required Consent:</strong> The general application consent
              form above must be signed to proceed.
            </p>
            <p className="text-blue-700">
              <strong>Next Steps:</strong> After submitting your application,
              we'll initiate the background check process. You'll receive
              updates via email and can track the status in your applicant
              portal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
