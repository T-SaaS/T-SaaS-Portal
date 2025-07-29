import React from "react";
import { SignatureConsent } from "@/components/SignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
        consentText={`I, ${driverName}, hereby acknowledge and agree to the following terms and conditions for my employment application with ${companyName}:

1. I understand that this application is for employment purposes and that any false statements, omissions, or misrepresentations may result in the rejection of my application or termination of employment if hired.

2. I authorize ${companyName} to contact my previous employers, educational institutions, and other references to verify the information provided in this application.

3. I understand that employment is contingent upon successful completion of a background check, drug and alcohol testing, and any other pre-employment requirements.

4. I agree to comply with all company policies, procedures, and safety requirements if employed.

5. I understand that this application does not constitute a contract of employment and that employment is at-will, meaning either party may terminate the employment relationship at any time with or without cause.

6. I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge.

7. I understand that ${companyName} is an equal opportunity employer and does not discriminate on the basis of race, color, religion, sex, national origin, age, disability, or any other protected characteristic.

By signing below, I acknowledge that I have read, understood, and agree to all the terms and conditions stated above.`}
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
