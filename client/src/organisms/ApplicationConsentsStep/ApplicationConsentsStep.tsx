import React from "react";
import { SignatureConsent } from "@/components/SignatureConsent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ApplicationConsentsStepProps {
  companyName?: string;
}

export const ApplicationConsentsStep: React.FC<
  ApplicationConsentsStepProps
> = ({ companyName }) => {
  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review and sign each consent form below. These consents are
          required for your driver application. You can sign each consent
          individually, and you'll have the option to review and modify
          signatures before final submission.
        </AlertDescription>
      </Alert>

      {/* Background Check Consent */}
      <SignatureConsent
        title="Background Check Consent"
        description="Authorization for background investigation and release of information"
        consentText={`I authorize ${companyName} and its agents to conduct a comprehensive background investigation including, but not limited to, criminal history, driving record, employment verification, and drug testing. I release all parties from liability for providing this information and understand this consent remains valid for the duration of my employment consideration.`}
        fieldName="backgroundCheckConsentSignature"
        required={true}
      />

      {/* Employment Consent */}
      <SignatureConsent
        title="Employment Verification Consent"
        description="Authorization for employment verification and reference checks"
        consentText={`I authorize ${companyName} to contact my current and former employers, educational institutions, and personal references to verify my employment history, qualifications, and character. I release all parties from liability for providing truthful information about my background and performance.`}
        fieldName="employmentConsentSignature"
        required={true}
      />

      {/* Drug Test Consent */}
      <SignatureConsent
        title="Drug and Alcohol Testing Consent"
        description="Consent for pre-employment and ongoing drug/alcohol testing"
        consentText={`I consent to pre-employment drug and alcohol testing as required by DOT regulations and company policy. I understand that testing may include urine, blood, breath, or other specimen collection methods. I agree to submit to random, post-accident, and reasonable suspicion testing during employment.`}
        fieldName="drugTestConsentSignature"
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

      {/* General Consent */}
      <SignatureConsent
        title="General Application Consent"
        description="General terms and conditions for employment application"
        consentText={`I certify that all information provided in this application is true and complete. I understand that false statements may result in disqualification from employment or termination if discovered after hire. I agree to comply with all company policies and DOT regulations if employed.`}
        fieldName="generalConsentSignature"
        required={true}
      />

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Consent Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <strong>Required Consents:</strong> All 5 consent forms above must
              be signed to proceed.
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
