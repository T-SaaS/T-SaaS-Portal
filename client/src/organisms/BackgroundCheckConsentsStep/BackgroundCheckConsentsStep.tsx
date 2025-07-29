import React from "react";
import { SignatureConsent } from "@/components/SignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
        consentText={`Pursuant to the federal Fair Credit Reporting Act, I hereby authorize ${companyName} and its designated agents and representatives to conduct a comprehensive review of my background through any consumer report for employment. I understand that the scope of the consumer report/investigative consumer report may include, but is not limited to, the following areas: verification of Social Security number; current and previous residences; employment history, including all personnel files; education; references; credit history and reports; criminal history, including records from any criminal justice agency in any or all federal, state or county jurisdictions; birth records; motor vehicle records, including traffic citations and registration; and any other public records.`}
        fieldName="fairCreditReportingActConsentSignature"
        required={true}
      />

      {/* General Consent for Limited Queries of the Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse */}
      <SignatureConsent
        title="General Consent for Limited Queries of the Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse"
        description=""
        consentText={`I, ${driverName}, hereby provide consent to ${companyName} to conduct a limited query of the FMCSA Commercial Driver's License Drug and Alcohol Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse. I am consenting to multiple unlimited queries and for the duration of employment with ${companyName}. I understand that if the limited query conducted by ${companyName} indicates that drug or alcohol violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to ${companyName} without first obtaining additional specific consent from me. I further understand that if I refuse to provide consent for ${companyName} to conduct a limited query of the Clearinghouse, ${companyName} must prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA's drug and alcohol program regulations.`}
        fieldName="fmcsaClearinghouseConsentSignature"
        required={true}
      />

      {/* Motor Vehicle Record Consent */}
      <SignatureConsent
        title="Motor Vehicle Record Consent"
        description="Authorization for driving record checks"
        consentText={`I authorize ${companyName} to obtain my motor vehicle driving record from any state or jurisdiction where I have held a driver's license. I understand this authorization remains valid for the duration of my employment and may be used for periodic driving record reviews.`}
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
