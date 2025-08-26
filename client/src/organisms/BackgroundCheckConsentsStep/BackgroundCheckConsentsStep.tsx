import React from "react";
import { SignatureConsent } from "@/components/SignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CONSENT_TEXTS } from "@/utils/consentTexts";

interface BackgroundCheckConsentsStepProps {
  companyName?: string;
  driverName?: string;
}

export const BackgroundCheckConsentsStep: React.FC<
  BackgroundCheckConsentsStepProps
> = ({ companyName, driverName }) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review and sign the background check consent forms below. These
          are required for employment verification and background screening.
        </AlertDescription>
      </Alert>

      {/* Fair Credit Reporting Act */}
      <SignatureConsent
        title="Fair Credit Reporting Act"
        description="Authorization for Fair Credit Reporting Act"
        consentText={CONSENT_TEXTS.fairCreditReportingAct(companyName || "")}
        fieldName="fairCreditReportingActConsentSignature"
        required={true}
      />

      {/* General Consent for Limited Queries of the Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse */}
      <SignatureConsent
        title="General Consent for Limited Queries of the Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse"
        description=""
        consentText={CONSENT_TEXTS.fmcsaClearinghouse(
          companyName || "",
          driverName || ""
        )}
        fieldName="fmcsaClearinghouseConsentSignature"
        required={true}
      />

      {/* Motor Vehicle Record Consent */}
      <SignatureConsent
        title="Motor Vehicle Record Consent"
        description="Authorization for driving record checks"
        consentText={CONSENT_TEXTS.motorVehicleRecord(companyName || "")}
        fieldName="motorVehicleRecordConsentSignature"
        required={true}
      />

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Background Check Consents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <strong>Required Consents:</strong> All 3 background check consent
              forms above must be signed to proceed.
            </p>
            <p className="text-blue-700">
              <strong>Purpose:</strong> These consents allow us to verify your
              background, employment history, and driving record as required for
              commercial driver positions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
